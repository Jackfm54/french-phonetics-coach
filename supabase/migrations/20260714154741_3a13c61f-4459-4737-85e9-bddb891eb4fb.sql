
-- ============ SRS ITEMS ============
CREATE TABLE public.srs_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  item_type text NOT NULL CHECK (item_type IN ('phoneme','word','phrase','lesson')),
  item_ref text NOT NULL,
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  ease numeric NOT NULL DEFAULT 2.5,
  interval_days integer NOT NULL DEFAULT 1,
  lapses integer NOT NULL DEFAULT 0,
  reviews integer NOT NULL DEFAULT 0,
  due_at timestamptz NOT NULL DEFAULT now(),
  last_reviewed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, item_type, item_ref)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.srs_items TO authenticated;
GRANT ALL ON public.srs_items TO service_role;
ALTER TABLE public.srs_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY srs_self ON public.srs_items FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY srs_teachers_read ON public.srs_items FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'teacher') OR public.has_role(auth.uid(), 'admin'));
CREATE INDEX srs_items_user_due_idx ON public.srs_items (user_id, due_at);
CREATE TRIGGER srs_items_updated_at BEFORE UPDATE ON public.srs_items
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============ USER STATS ============
CREATE TABLE public.user_stats (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  xp integer NOT NULL DEFAULT 0,
  streak_days integer NOT NULL DEFAULT 0,
  best_streak integer NOT NULL DEFAULT 0,
  last_active_on date,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_stats TO authenticated;
GRANT ALL ON public.user_stats TO service_role;
ALTER TABLE public.user_stats ENABLE ROW LEVEL SECURITY;
CREATE POLICY stats_self ON public.user_stats FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY stats_teachers_read ON public.user_stats FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'teacher') OR public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER user_stats_updated_at BEFORE UPDATE ON public.user_stats
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============ BADGES EARNED ============
CREATE TABLE public.badges_earned (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  badge_code text NOT NULL,
  earned_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, badge_code)
);
GRANT SELECT, INSERT, DELETE ON public.badges_earned TO authenticated;
GRANT ALL ON public.badges_earned TO service_role;
ALTER TABLE public.badges_earned ENABLE ROW LEVEL SECURITY;
CREATE POLICY badges_self ON public.badges_earned FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY badges_teachers_read ON public.badges_earned FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'teacher') OR public.has_role(auth.uid(), 'admin'));

-- ============ VOCABULARY ============
CREATE TABLE public.vocabulary (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  word text NOT NULL,
  ipa text,
  definition_es text,
  example_fr text,
  source text,
  srs_item_id uuid REFERENCES public.srs_items(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, word)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.vocabulary TO authenticated;
GRANT ALL ON public.vocabulary TO service_role;
ALTER TABLE public.vocabulary ENABLE ROW LEVEL SECURITY;
CREATE POLICY vocab_self ON public.vocabulary FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY vocab_teachers_read ON public.vocabulary FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'teacher') OR public.has_role(auth.uid(), 'admin'));
CREATE INDEX vocabulary_user_idx ON public.vocabulary (user_id, created_at DESC);

-- ============ PROFILE: preferred_accent ============
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS preferred_accent text NOT NULL DEFAULT 'france'
  CHECK (preferred_accent IN ('france','quebec','belgique','suisse'));
