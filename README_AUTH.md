# Authentication Module for MedAssist Pro (Supabase)

This document explains how to use and test the authentication module implemented with Supabase.

Important note for Lovable users: Environment variables (VITE_*) are not supported inside Lovable previews. The Supabase URL and anon key are already configured in `src/integrations/supabase/client.ts` using your project's public values. In external deployments (your own Vite app), use the variables below.

## Environment variables (for external Vite apps)
- VITE_SUPABASE_URL
- VITE_SUPABASE_ANON_KEY

## Routes
- /auth — Sign in, Sign up, Forgot Password, Resend Confirmation
- /auth/reset — Password reset screen (target of reset emails)
- Protected pages: /patients, /consultations, /templates, /documents

## Features
- Email + password sign up with metadata: full_name, role (doctor|patient)
- Email + password sign in with persistent session
- Forgot password (resetPasswordForEmail) with redirect to /auth/reset
- Email confirmation handling and resend option
- Sign out and session updates via onAuthStateChange
- Inline form validation, accessible labels, generic error messages that avoid user enumeration
- UI-side debounce to prevent rapid attempts

## Supabase configuration
1. Authentication → URL Configuration
   - Site URL: your app URL
   - Redirect URLs: add both your app URL and `/auth/reset`
2. Authentication → Email Templates / SMTP
   - Set up SMTP to send emails (or use Supabase default if available)
   - Customize templates for: Confirm signup and Reset password
3. Email redirect URL used in code
   - Sign up: `${window.location.origin}/auth`
   - Reset password: `${window.location.origin}/auth/reset`

## Testing steps
1. Sign up with a new email (choose role and set a strong password)
2. Check your inbox and confirm the email
3. Sign in; you should be redirected to the dashboard
4. Try “Forgot password” and use the email link to set a new password
5. Sign out and verify protected routes redirect to /auth

## Server-side notes (RLS & Policies)
- User metadata is stored on the `auth.users` record. For app data, create tables in `public` and enable Row Level Security (RLS).
- Recommended: create a `profiles` table keyed by `auth.users.id` to store public profile info. Apply RLS so users can only view/edit their own profile.
- Use SECURITY DEFINER helper functions for role checks to avoid recursive RLS.

## Adapting to Next.js or mobile
- The module is modular: `AuthProvider` (context), `authService` (API), and React forms. Replace routing (Navigate) and pages as needed.
