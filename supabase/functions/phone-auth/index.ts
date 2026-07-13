import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

const MAX_ATTEMPTS = 5;
const OTP_TTL_MINUTES = 10;
const RESEND_COOLDOWN_SECONDS = 45;

function normalizePhone(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const compact = value.trim().replace(/[\s().-]/g, "");
  const phone = compact.startsWith("+") ? compact : `+${compact}`;
  return /^\+[1-9]\d{7,14}$/.test(phone) ? phone : null;
}

function randomCode(): string {
  const bytes = new Uint32Array(1);
  crypto.getRandomValues(bytes);
  return String(bytes[0] % 1_000_000).padStart(6, "0");
}

function randomPassword(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return btoa(String.fromCharCode(...bytes)).replace(/[+/=]/g, "A");
}

function maskPhone(phone: string): string {
  return phone.replace(/(\+\d{2})\d+(\d{2})$/, "$1XXXXXX$2");
}

function normalizeSmsSender(value: string | undefined): string | null {
  if (!value) return null;
  const sender = value.trim().replace(/[\s().-]/g, "");
  if (/^MG[a-fA-F0-9]{32}$/.test(sender)) return sender;
  if (/^\+[1-9]\d{7,14}$/.test(sender)) return sender;
  return null;
}

async function hashCode(phone: string, code: string): Promise<string> {
  const secret = Deno.env.get("PHONE_OTP_SECRET");
  if (!secret) throw new Error("PHONE_OTP_SECRET is not configured");
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(`${phone}:${code}`));
  return Array.from(new Uint8Array(signature)).map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

function serviceClient() {
  const url = Deno.env.get("SUPABASE_URL");
  const key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !key) throw new Error("Backend auth service is not configured");
  return createClient(url, key, { auth: { persistSession: false } });
}

function anonClient() {
  const url = Deno.env.get("SUPABASE_URL");
  const key = Deno.env.get("SUPABASE_ANON_KEY");
  if (!url || !key) throw new Error("Backend auth client is not configured");
  return createClient(url, key, { auth: { persistSession: false } });
}

function json(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

async function sendSms(phone: string, code: string) {
  const lovableKey = Deno.env.get("LOVABLE_API_KEY");
  const twilioKey = Deno.env.get("TWILIO_API_KEY");
  const from = normalizeSmsSender(Deno.env.get("TWILIO_FROM_NUMBER"));

  if (!lovableKey || !twilioKey || !from) {
    return {
      ok: false,
      status: 500,
      details: "SMS sender is not configured. Add a Twilio phone number or Messaging Service SID.",
    };
  }

  if (from === phone) {
    console.error(`Blocked phone OTP send because Twilio sender equals recipient: ${maskPhone(phone)}`);
    return {
      ok: false,
      status: 500,
      details: "SMS sender is misconfigured. TWILIO_FROM_NUMBER must be your Twilio sender number, not the user's phone number.",
    };
  }

  const messageBody = new URLSearchParams({
    To: phone,
    Body: `Your Crafted CV sign-in code is ${code}. It expires in ${OTP_TTL_MINUTES} minutes.`,
  });

  if (from.startsWith("MG")) {
    messageBody.set("MessagingServiceSid", from);
  } else {
    messageBody.set("From", from);
  }

  const response = await fetch("https://connector-gateway.lovable.dev/twilio/Messages.json", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${lovableKey}`,
      "X-Connection-Api-Key": twilioKey,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: messageBody,
  });

  if (!response.ok) {
    const details = await response.text();
    console.error(`Twilio gateway failed [${response.status}]: ${details}`);
    return { ok: false, status: response.status, details };
  }

  return { ok: true, status: 200, details: "sent" };
}

async function sendCode(phone: string) {
  const supabase = serviceClient();
  const since = new Date(Date.now() - RESEND_COOLDOWN_SECONDS * 1000).toISOString();
  const { data: recent } = await supabase
    .from("phone_otp_challenges")
    .select("id")
    .eq("phone", phone)
    .is("consumed_at", null)
    .gte("created_at", since)
    .maybeSingle();

  if (recent) {
    return json({ error: "Please wait a moment before requesting another code." }, 429);
  }

  const code = randomCode();
  const codeHash = await hashCode(phone, code);
  const expiresAt = new Date(Date.now() + OTP_TTL_MINUTES * 60 * 1000).toISOString();

  const sms = await sendSms(phone, code);
  if (!sms.ok) {
    return json({ error: "Failed to send code", details: sms.details }, sms.status);
  }

  const { error } = await supabase.from("phone_otp_challenges").insert({
    phone,
    code_hash: codeHash,
    expires_at: expiresAt,
  });

  if (error) {
    console.error("Failed to save phone OTP challenge:", error.message);
    return json({ error: "Could not prepare verification code" }, 500);
  }

  return json({ success: true });
}

async function getOrCreatePhoneUser(phone: string, password: string) {
  const supabase = serviceClient();
  const { data: mapped } = await supabase
    .from("phone_auth_users")
    .select("user_id")
    .eq("phone", phone)
    .maybeSingle();

  if (mapped?.user_id) {
    const { error } = await supabase.auth.admin.updateUserById(mapped.user_id, {
      phone,
      password,
      phone_confirm: true,
      user_metadata: { phone_auth: true },
    });
    if (error) throw error;
    return mapped.user_id as string;
  }

  const { data, error } = await supabase.auth.admin.createUser({
    phone,
    password,
    phone_confirm: true,
    user_metadata: { phone_auth: true },
  });

  if (error || !data.user) throw error ?? new Error("Could not create phone user");

  const userId = data.user.id;
  await supabase.from("phone_auth_users").upsert({ phone, user_id: userId });
  await supabase.from("profiles").upsert({ user_id: userId, display_name: phone });
  return userId;
}

async function verifyCode(phone: string, code: unknown) {
  if (typeof code !== "string" || !/^\d{6}$/.test(code)) {
    return json({ error: "Enter the 6-digit verification code." }, 400);
  }

  const supabase = serviceClient();
  const { data: challenge, error } = await supabase
    .from("phone_otp_challenges")
    .select("id, code_hash, attempts, expires_at")
    .eq("phone", phone)
    .is("consumed_at", null)
    .gt("expires_at", new Date().toISOString())
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("Failed to read phone OTP challenge:", error.message);
    return json({ error: "Could not verify code" }, 500);
  }

  if (!challenge) return json({ error: "Code expired. Request a new code." }, 400);
  if ((challenge.attempts as number) >= MAX_ATTEMPTS) return json({ error: "Too many attempts. Request a new code." }, 429);

  const submittedHash = await hashCode(phone, code);
  if (submittedHash !== challenge.code_hash) {
    await supabase
      .from("phone_otp_challenges")
      .update({ attempts: (challenge.attempts as number) + 1 })
      .eq("id", challenge.id);
    return json({ error: "Invalid verification code." }, 400);
  }

  await supabase
    .from("phone_otp_challenges")
    .update({ consumed_at: new Date().toISOString() })
    .eq("id", challenge.id);

  const temporaryPassword = randomPassword();
  const userId = await getOrCreatePhoneUser(phone, temporaryPassword);
  const { data: sessionData, error: signInError } = await anonClient().auth.signInWithPassword({
    phone,
    password: temporaryPassword,
  });

  if (signInError || !sessionData.session) {
    console.error("Phone password exchange failed:", signInError?.message);
    return json({ error: "Could not create a sign-in session" }, 500);
  }

  await supabase.auth.admin.updateUserById(userId, { password: randomPassword() });
  return json({ session: sessionData.session });
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const body = await req.json();
    const phone = normalizePhone(body.phone);
    if (!phone) return json({ error: "Enter a valid phone number with country code." }, 400);

    if (body.action === "send_code") return await sendCode(phone);
    if (body.action === "verify_code") return await verifyCode(phone, body.code);

    return json({ error: "Invalid phone auth action" }, 400);
  } catch (error) {
    console.error("phone-auth error:", error instanceof Error ? error.message : error);
    return json({ error: "Phone sign-in failed. Please try again." }, 500);
  }
});