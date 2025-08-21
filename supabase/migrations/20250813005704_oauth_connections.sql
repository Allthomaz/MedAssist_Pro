-- 1) Helper to auto-update updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 2) Store Google OAuth tokens per user
CREATE TABLE IF NOT EXISTS public.oauth_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  provider TEXT NOT NULL CHECK (provider = 'google'),
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  scope TEXT,
  token_type TEXT,
  expiry_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, provider)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_oauth_connections_user_id ON public.oauth_connections(user_id);

-- Trigger for updated_at
DROP TRIGGER IF EXISTS trg_oauth_connections_updated_at ON public.oauth_connections;
CREATE TRIGGER trg_oauth_connections_updated_at
BEFORE UPDATE ON public.oauth_connections
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Enable RLS and secure policies
ALTER TABLE public.oauth_connections ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own oauth connections" ON public.oauth_connections;
CREATE POLICY "Users can view their own oauth connections"
ON public.oauth_connections FOR SELECT
USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can insert their own oauth connection" ON public.oauth_connections;
CREATE POLICY "Users can insert their own oauth connection"
ON public.oauth_connections FOR INSERT
WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can update their own oauth connection" ON public.oauth_connections;
CREATE POLICY "Users can update their own oauth connection"
ON public.oauth_connections FOR UPDATE
USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can delete their own oauth connection" ON public.oauth_connections;
CREATE POLICY "Users can delete their own oauth connection"
ON public.oauth_connections FOR DELETE
USING ((select auth.uid()) = user_id);

-- 3) Ephemeral OAuth state storage for CSRF protection
CREATE TABLE IF NOT EXISTS public.oauth_states (
  state TEXT PRIMARY KEY,
  user_id UUID NOT NULL,
  redirect_to TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.oauth_states ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can insert their own oauth state" ON public.oauth_states;
CREATE POLICY "Users can insert their own oauth state"
ON public.oauth_states FOR INSERT
WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can view their own oauth state (recent)" ON public.oauth_states;
CREATE POLICY "Users can view their own oauth state (recent)"
ON public.oauth_states FOR SELECT
USING ((select auth.uid()) = user_id AND created_at > now() - interval '15 minutes');

DROP POLICY IF EXISTS "Users can delete their own oauth state" ON public.oauth_states;
CREATE POLICY "Users can delete their own oauth state"
ON public.oauth_states FOR DELETE
USING ((select auth.uid()) = user_id);
