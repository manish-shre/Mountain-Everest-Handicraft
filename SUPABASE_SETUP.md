# Supabase CMS setup

This project uses **Supabase** as the backend so admins can edit all website text and images from `/admin`.

## 1. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) and create a free project.
2. Wait for the database to finish provisioning.

## 2. Run the database schema

1. In Supabase Dashboard → **SQL Editor** → **New query**.
2. Paste the full contents of `supabase/schema.sql` and click **Run**.

This creates:

- `website_content` — stores all site copy and image URLs (JSON)
- `admin_users` — allowlist of who can edit content
- `media` storage bucket — for uploaded images

Then open another new query, paste `supabase/contact_messages.sql` and click **Run**. This creates:

- `contact_messages` — messages sent from the website contact form. Visitors can only send; only admins can read, mark as read, or delete them (shown under **Messages** in `/admin`). Includes basic spam limits (3 messages per email per 10 minutes, 60 per hour in total).

Then open another new query, paste `supabase/reviews.sql` and click **Run**. This creates:

- `reviews` — reviews customers submit from the Testimonials section. New reviews are hidden until an admin approves them under **Reviews** in `/admin`; visitors can only read approved reviews. No email or phone is collected. Spam limits: 2 reviews per name per 10 minutes, 20 per hour in total. The Testimonials section stays hidden until this table exists.

## 3. Configure environment variables

1. Copy `.env.example` to `.env` in the project root.
2. In Supabase → **Project Settings** → **API**, copy:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public** key → `VITE_SUPABASE_ANON_KEY`
3. Restart the dev server: `npm run dev`

## 4. Create an admin user

1. Supabase Dashboard → **Authentication** → **Users** → **Add user**.
2. Enter email and password (e.g. `admin@yourdomain.com`).
3. Copy the user’s **UUID** from the users table.
4. SQL Editor → run:

```sql
insert into public.admin_users (user_id, email)
values ('PASTE_USER_UUID_HERE', 'admin@yourdomain.com');
```

## 5. Use the admin panel

1. Open [http://localhost:5173/admin/login](http://localhost:5173/admin/login)
2. Sign in with the admin email and password.
3. Edit sections in the sidebar and click **Save all changes**.
4. Open the public site (`/`) to see updates.

Phone numbers (3 or more) and social media links (Facebook, Instagram, TikTok, YouTube, WhatsApp, Viber, Messenger, Telegram, X, LinkedIn, Pinterest, Threads, Snapchat, Google Maps) are edited under **Phones & Social**. Empty fields are hidden on the website. No database migration is needed — content is stored as JSON, and content saved by older versions is upgraded automatically when loaded.

> A local `.env` that points at the production Supabase project edits the **live** website when you save in `/admin`.

## Image uploads

- Use **Upload image** in the admin panel (requires Supabase Storage).
- Or paste any public image URL into the image field.

## Deploying (Vercel)

Add the same environment variables in Vercel → **Settings** → **Environment Variables**:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Redeploy after saving.

## Without Supabase

If `.env` is missing, the site still works using built-in default content from `src/data/defaultContent.js`. The admin panel will show a configuration message until Supabase is connected.
