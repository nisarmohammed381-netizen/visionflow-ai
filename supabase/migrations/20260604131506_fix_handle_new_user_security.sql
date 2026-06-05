/*
  # Fix handle_new_user function security

  1. Changes
     - Set `search_path = ''` to prevent search path injection attacks
     - Revoke EXECUTE on the function from `anon` and `authenticated` roles
       so it cannot be called directly via the REST API

  2. Security
     - The function is only triggered internally via the auth trigger,
       so public/authenticated RPC access is not needed
*/

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url, credits, plan)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', ''),
    5,
    'free'
  );
  RETURN NEW;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM authenticated;
