CREATE TABLE public.career_studio_generations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  tool TEXT NOT NULL CHECK (tool IN ('job_match', 'cover_letter', 'interview_prep', 'suggest_skills')),
  title TEXT NOT NULL DEFAULT 'Career Studio generation',
  job_description TEXT,
  cv_snapshot JSONB NOT NULL DEFAULT '{}'::jsonb,
  uploaded_cv_name TEXT,
  uploaded_cv_context TEXT,
  result JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.career_studio_generations TO authenticated;
GRANT ALL ON public.career_studio_generations TO service_role;

ALTER TABLE public.career_studio_generations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own career studio generations"
ON public.career_studio_generations
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own career studio generations"
ON public.career_studio_generations
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own career studio generations"
ON public.career_studio_generations
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own career studio generations"
ON public.career_studio_generations
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

CREATE TRIGGER update_career_studio_generations_updated_at
  BEFORE UPDATE ON public.career_studio_generations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_career_studio_generations_user_created
  ON public.career_studio_generations (user_id, created_at DESC);

CREATE INDEX idx_career_studio_generations_user_tool
  ON public.career_studio_generations (user_id, tool);