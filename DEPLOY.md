# Deploy to Vercel — mteveresthandicraft.com

This project is configured for **mteveresthandicraft.com**.

---

## 1. Push to GitHub (if needed)

```bash
git init
git add .
git commit -m "Mount Everest Gold Silver Handicraft website"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

---

## 2. Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) and sign in (GitHub recommended).
2. **Add New…** → **Project** → import your repo.
3. Click **Deploy**. Your site will be at `https://your-project.vercel.app`.

**Or with CLI:**

```bash
npm i -g vercel
vercel login
vercel
vercel --prod
```

---

## 3. Add domain: mteveresthandicraft.com

1. In Vercel: open your project → **Settings** → **Domains**.
2. Click **Add** and enter:
   - **mteveresthandicraft.com** (apex)
   - **www.mteveresthandicraft.com** (optional)
3. Vercel will show the DNS records. Add these at your domain registrar:

### DNS records (at your registrar)

| Type  | Name | Value              | TTL  |
|-------|------|--------------------|------|
| **A** | `@`  | `76.76.21.21`      | 3600 |
| **CNAME** | `www` | `cname.vercel-dns.com` | 3600 |

- **A** record: points **mteveresthandicraft.com** to Vercel.
- **CNAME** record: points **www.mteveresthandicraft.com** to Vercel (add only if you want www).

4. Save DNS, then in Vercel click **Refresh** on the domain. Wait until it shows as verified (checkmark).
5. HTTPS is automatic. Your site will be live at **https://mteveresthandicraft.com**.

---

## 4. Quick reference

| Item        | Value                          |
|------------|----------------------------------|
| Domain     | **mteveresthandicraft.com**      |
| Production URL | https://mteveresthandicraft.com |
| A record   | `@` → `76.76.21.21`             |
| CNAME (www) | `www` → `cname.vercel-dns.com`  |

If your registrar uses different labels: use “@” or “root” for apex, and “www” for the CNAME.
