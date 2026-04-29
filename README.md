# Project Hunt Starter

This is the first working chassis for Project Hunt: a daily project lead tracker with a live web app and Supabase database.

## What it does today

- Add project leads
- Edit leads
- Delete leads
- Track status
- Track priority
- Save source links
- Search/filter your lead list
- Store data in Supabase

## Build path

1. Create a Supabase account.
2. Create a new Supabase project.
3. Open SQL Editor in Supabase.
4. Paste everything from `supabase/schema.sql` and run it.
5. Copy your Supabase Project URL and anon public key.
6. Create a Vercel account.
7. Upload/deploy this project folder to Vercel.
8. Add these Environment Variables in Vercel:
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY
9. Redeploy.
10. Open your live Project Hunt URL.

## Important security note

This starter uses open read/write database policies so you can get the chassis working fast. After the app is working, add login/authentication before putting sensitive data into it.
