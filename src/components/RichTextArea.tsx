import { useRef, useState, useCallback, useEffect, useMemo } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Type,
  CaseUpper,
  CaseLower,
  CaseSensitive,
  List,
  ListOrdered,
  ArrowRight,
  Minus,
  Check,
  Star,
  Sparkles,
  Undo2,
  Redo2,
  Eraser,
  Copy,
  ClipboardPaste,
  Quote,
  Braces,
  ArrowDownAZ,
  Filter,
  Wand2,
  Percent,
  DollarSign,
  Hash,
  Scissors,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
  id?: string;
  className?: string;
}

const ACTION_VERBS = [
  "Led", "Managed", "Directed", "Spearheaded", "Architected",
  "Built", "Designed", "Developed", "Engineered", "Implemented",
  "Launched", "Delivered", "Shipped", "Executed", "Drove",
  "Optimized", "Streamlined", "Automated", "Improved", "Reduced",
  "Increased", "Accelerated", "Scaled", "Transformed", "Pioneered",
  "Achieved", "Exceeded", "Generated", "Negotiated", "Mentored",
];

const RichTextArea = ({ value, onChange, placeholder, rows = 6, id, className }: Props) => {
  const ref = useRef<HTMLTextAreaElement>(null);
  const historyRef = useRef<{ stack: string[]; index: number }>({ stack: [value], index: 0 });
  const skipHistoryRef = useRef(false);

  // Track history whenever value changes externally
  useEffect(() => {
    const h = historyRef.current;
    if (skipHistoryRef.current) {
      skipHistoryRef.current = false;
      return;
    }
    if (h.stack[h.index] === value) return;
    h.stack = h.stack.slice(0, h.index + 1);
    h.stack.push(value);
    if (h.stack.length > 100) h.stack.shift();
    h.index = h.stack.length - 1;
  }, [value]);

  const stats = useMemo(() => {
    const words = value.trim() ? value.trim().split(/\s+/).length : 0;
    const chars = value.length;
    const lines = value ? value.split("\n").length : 0;
    return { words, chars, lines };
  }, [value]);

  const getSelection = () => {
    const el = ref.current;
    if (!el) return { start: 0, end: 0, selected: "", before: "", after: "" };
    const start = el.selectionStart;
    const end = el.selectionEnd;
    return {
      start,
      end,
      selected: value.slice(start, end),
      before: value.slice(0, start),
      after: value.slice(end),
    };
  };

  const applyToSelection = useCallback(
    (transform: (selected: string, full: string) => string, opts?: { fallbackAll?: boolean }) => {
      const el = ref.current;
      if (!el) return;
      const { start, end, selected, before, after } = getSelection();
      const target = selected || (opts?.fallbackAll ? value : "");
      if (!target && !opts?.fallbackAll) return;

      if (!selected && opts?.fallbackAll) {
        const next = transform(value, value);
        onChange(next);
        requestAnimationFrame(() => el.focus());
        return;
      }
      const replaced = transform(selected, value);
      const next = before + replaced + after;
      onChange(next);
      requestAnimationFrame(() => {
        el.focus();
        el.setSelectionRange(start, start + replaced.length);
      });
    },
    [onChange, value]
  );

  const insertAtCursor = useCallback(
    (text: string) => {
      const el = ref.current;
      if (!el) return;
      const { start, before, after, end } = getSelection();
      const next = before + text + after.slice(end - start === 0 ? 0 : 0);
      onChange(before + text + after);
      requestAnimationFrame(() => {
        el.focus();
        const pos = start + text.length;
        el.setSelectionRange(pos, pos);
      });
    },
    [onChange, value]
  );

  const toBulletList = (text: string) =>
    text
      .split("\n")
      .map((l) => {
        const t = l.trim();
        if (!t) return "";
        if (/^[•\-*→▸✓★]\s/.test(t)) return l;
        return `• ${t}`;
      })
      .join("\n");

  const toNumberedList = (text: string) => {
    let n = 0;
    return text
      .split("\n")
      .map((l) => {
        const t = l.trim();
        if (!t) return "";
        n += 1;
        return `${n}. ${t.replace(/^\d+\.\s*/, "")}`;
      })
      .join("\n");
  };

  const stripListMarkers = (text: string) =>
    text
      .split("\n")
      .map((l) => l.replace(/^\s*(?:[•\-*→▸✓★]|\d+\.)\s+/, ""))
      .join("\n");

  const titleCase = (t: string) =>
    t.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());

  const sentenceCase = (t: string) =>
    t.toLowerCase().replace(/(^\s*\w|[.!?]\s+\w)/g, (m) => m.toUpperCase());

  const cleanSpaces = (t: string) =>
    t
      .replace(/[ \t]+/g, " ")
      .replace(/ +\n/g, "\n")
      .replace(/\n{3,}/g, "\n\n")
      .trim();

  const undo = () => {
    const h = historyRef.current;
    if (h.index === 0) return;
    h.index -= 1;
    skipHistoryRef.current = true;
    onChange(h.stack[h.index]);
  };

  const redo = () => {
    const h = historyRef.current;
    if (h.index >= h.stack.length - 1) return;
    h.index += 1;
    skipHistoryRef.current = true;
    onChange(h.stack[h.index]);
  };

  const copySelection = async () => {
    const { selected } = getSelection();
    await navigator.clipboard.writeText(selected || value);
  };

  const paste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      insertAtCursor(text);
    } catch {}
  };

  const wrap = (l: string, r: string) => applyToSelection((s) => `${l}${s}${r}`);

  const sortLines = () =>
    applyToSelection(
      (s) => s.split("\n").sort((a, b) => a.localeCompare(b)).join("\n"),
      { fallbackAll: true }
    );

  const dedupeLines = () =>
    applyToSelection(
      (s) => {
        const seen = new Set<string>();
        return s
          .split("\n")
          .filter((l) => {
            const k = l.trim().toLowerCase();
            if (!k) return true;
            if (seen.has(k)) return false;
            seen.add(k);
            return true;
          })
          .join("\n");
      },
      { fallbackAll: true }
    );

  const btn = "h-8 w-8 p-0";

  const ToolBtn = ({ tip, onClick, children, disabled }: any) => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={btn}
          onClick={onClick}
          disabled={disabled}
        >
          {children}
        </Button>
      </TooltipTrigger>
      <TooltipContent side="top"><p className="text-xs">{tip}</p></TooltipContent>
    </Tooltip>
  );

  const Divider = () => <span className="w-px h-5 bg-border mx-0.5" />;

  return (
    <TooltipProvider delayDuration={200}>
      <div className={cn("rounded-xl border border-border bg-card overflow-hidden focus-within:ring-2 focus-within:ring-ring/50 transition-shadow", className)}>
        {/* Toolbar */}
        <div className="flex items-center gap-0.5 flex-wrap px-2 py-1.5 border-b border-border bg-muted/30">
          <ToolBtn tip="Undo" onClick={undo}><Undo2 className="h-3.5 w-3.5" /></ToolBtn>
          <ToolBtn tip="Redo" onClick={redo}><Redo2 className="h-3.5 w-3.5" /></ToolBtn>
          <Divider />

          {/* Case */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button type="button" variant="ghost" size="sm" className="h-8 gap-1 px-2">
                <Type className="h-3.5 w-3.5" />
                <span className="text-xs">Case</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              <DropdownMenuLabel className="text-xs">Change case</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => applyToSelection((s) => s.toUpperCase(), { fallbackAll: true })}>
                <CaseUpper className="h-4 w-4 mr-2" /> UPPERCASE
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => applyToSelection((s) => s.toLowerCase(), { fallbackAll: true })}>
                <CaseLower className="h-4 w-4 mr-2" /> lowercase
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => applyToSelection(titleCase, { fallbackAll: true })}>
                <CaseSensitive className="h-4 w-4 mr-2" /> Title Case
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => applyToSelection(sentenceCase, { fallbackAll: true })}>
                <CaseSensitive className="h-4 w-4 mr-2" /> Sentence case
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Divider />

          {/* Lists */}
          <ToolBtn tip="Bullet list" onClick={() => applyToSelection(toBulletList, { fallbackAll: true })}>
            <List className="h-3.5 w-3.5" />
          </ToolBtn>
          <ToolBtn tip="Numbered list" onClick={() => applyToSelection(toNumberedList, { fallbackAll: true })}>
            <ListOrdered className="h-3.5 w-3.5" />
          </ToolBtn>
          <ToolBtn tip="Remove list markers" onClick={() => applyToSelection(stripListMarkers, { fallbackAll: true })}>
            <Eraser className="h-3.5 w-3.5" />
          </ToolBtn>

          <Divider />

          {/* Insert symbols */}
          <ToolBtn tip="Insert •" onClick={() => insertAtCursor("• ")}><span className="text-sm leading-none">•</span></ToolBtn>
          <ToolBtn tip="Insert →" onClick={() => insertAtCursor("→ ")}><ArrowRight className="h-3.5 w-3.5" /></ToolBtn>
          <ToolBtn tip="Insert –" onClick={() => insertAtCursor("– ")}><Minus className="h-3.5 w-3.5" /></ToolBtn>
          <ToolBtn tip="Insert ✓" onClick={() => insertAtCursor("✓ ")}><Check className="h-3.5 w-3.5" /></ToolBtn>
          <ToolBtn tip="Insert ★" onClick={() => insertAtCursor("★ ")}><Star className="h-3.5 w-3.5" /></ToolBtn>

          <Divider />

          {/* Wrap */}
          <ToolBtn tip='Wrap in "quotes"' onClick={() => wrap("\u201C", "\u201D")}><Quote className="h-3.5 w-3.5" /></ToolBtn>
          <ToolBtn tip="Wrap in (parentheses)" onClick={() => wrap("(", ")")}><Braces className="h-3.5 w-3.5" /></ToolBtn>

          <Divider />

          {/* Metrics helpers */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button type="button" variant="ghost" size="sm" className="h-8 gap-1 px-2">
                <Hash className="h-3.5 w-3.5" />
                <span className="text-xs">Metric</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-44">
              <DropdownMenuLabel className="text-xs">Quantify impact</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => insertAtCursor("by X%")}><Percent className="h-4 w-4 mr-2" />by X%</DropdownMenuItem>
              <DropdownMenuItem onClick={() => insertAtCursor("$X ")}><DollarSign className="h-4 w-4 mr-2" />$X amount</DropdownMenuItem>
              <DropdownMenuItem onClick={() => insertAtCursor("Xx ")}><Hash className="h-4 w-4 mr-2" />Xx multiplier</DropdownMenuItem>
              <DropdownMenuItem onClick={() => insertAtCursor("across X+ ")}>across X+ scope</DropdownMenuItem>
              <DropdownMenuItem onClick={() => insertAtCursor("within X months")}>within X months</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Action verbs */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button type="button" variant="ghost" size="sm" className="h-8 gap-1 px-2">
                <Sparkles className="h-3.5 w-3.5" />
                <span className="text-xs">Action verb</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56 max-h-72 overflow-y-auto">
              <DropdownMenuLabel className="text-xs">Start with impact</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {ACTION_VERBS.map((v) => (
                <DropdownMenuItem key={v} onClick={() => insertAtCursor(`${v} `)}>
                  {v}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Divider />

          {/* Clean */}
          <ToolBtn tip="Clean spacing" onClick={() => applyToSelection(cleanSpaces, { fallbackAll: true })}>
            <Wand2 className="h-3.5 w-3.5" />
          </ToolBtn>
          <ToolBtn tip="Trim each line" onClick={() => applyToSelection((s) => s.split("\n").map((l) => l.trim()).join("\n"), { fallbackAll: true })}>
            <Scissors className="h-3.5 w-3.5" />
          </ToolBtn>
          <ToolBtn tip="Sort lines A→Z" onClick={sortLines}>
            <ArrowDownAZ className="h-3.5 w-3.5" />
          </ToolBtn>
          <ToolBtn tip="Remove duplicate lines" onClick={dedupeLines}>
            <Filter className="h-3.5 w-3.5" />
          </ToolBtn>

          <Divider />

          <ToolBtn tip="Copy" onClick={copySelection}><Copy className="h-3.5 w-3.5" /></ToolBtn>
          <ToolBtn tip="Paste" onClick={paste}><ClipboardPaste className="h-3.5 w-3.5" /></ToolBtn>
        </div>

        {/* Editor */}
        <Textarea
          ref={ref}
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          className="border-0 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 resize-y bg-transparent"
        />

        {/* Footer / stats */}
        <div className="flex items-center justify-between px-3 py-1.5 border-t border-border bg-muted/20 text-[11px] text-muted-foreground font-mono">
          <div className="flex items-center gap-3">
            <span>{stats.words} words</span>
            <span>{stats.chars} chars</span>
            <span>{stats.lines} {stats.lines === 1 ? "line" : "lines"}</span>
          </div>
          <div className="hidden sm:block opacity-70">
            Tip: select text, then use the toolbar to transform it
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default RichTextArea;
