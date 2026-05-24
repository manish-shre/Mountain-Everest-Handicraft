# Setup for your Supabase project

Project ID: **ewwzzsbaicqbaadxfgkx**

I cannot log into your dashboard for you (only you have access). Follow these 4 steps — about 5 minutes.

---

## Step 1 — Run the database schema

1. Open [SQL Editor (new query)](https://supabase.com/dashboard/project/ewwzzsbaicqbaadxfgkx/sql/new)
2. Open the file `supabase/schema.sql` in this project, copy **all** of it, paste into the editor
3. Click **Run**

---

## Step 2 — Add your API key to `.env`

1. Open [Project API settings](https://supabase.com/dashboard/project/ewwzzsbaicqbaadxfgkx/settings/api)
2. Under **Project API keys**, copy the **`anon` `public`** key (not the `service_role` key)
3. Open `.env` in this project and replace `PASTE_YOUR_ANON_KEY_HERE` with that key
4. Save the file

The URL is already set:

```
VITE_SUPABASE_URL=https://ewwzzsbaicqbaadxfgkx.supabase.co
```

---

## Step 3 — Create an admin user

1. Open [Authentication → Users](https://supabase.com/dashboard/project/ewwzzsbaicqbaadxfgkx/auth/users)
2. Click **Add user** → **Create new user**
3. Enter email + password (e.g. your email and a strong password)
4. After the user is created, click the user row and **copy their User UID** (UUID)

---

## Step 4 — Allow that user as admin

1. Open [SQL Editor](https://supabase.com/dashboard/project/ewwzzsbaicqbaadxfgkx/sql/new) again
2. Run this (replace the UUID and email):

```sql
insert into public.admin_users (user_id, email)
values ('PASTE-USER-UUID-HERE', 'your-email@example.com');
```

---

## Step 5 — Test locally

```powershell
npm run dev
```

- Website: http://localhost:5173/
- Admin login: http://localhost:5173/admin/login

Sign in with the email/password from Step 3.

---

## Optional — Seed initial content

After first login to admin, click **Save all changes** once. That writes the full default site content to Supabase.

---

## Deploy to Vercel

Add the same two variables in Vercel → Settings → Environment Variables, then redeploy.
