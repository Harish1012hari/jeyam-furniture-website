# JEYAM FURNITURE — Website setup

This is a responsive furniture catalogue website with a private admin dashboard. Customers can browse furniture, see prices and enquire through WhatsApp. There is **no cart, checkout or online payment**.

## 1. What is included
- `index.html` — customer-facing catalogue website
- `admin.html` — private admin sign-in and product manager
- `styles.css`, `app.js` — storefront design and behaviour
- `admin.css`, `admin.js` — admin panel
- `config.js` — your Supabase and showroom settings
- `supabase-schema.sql` — database, access policies and image storage setup

## 2. Create the database and admin login
1. Create a project at https://supabase.com and save its database password safely.
2. In Supabase, open **SQL Editor**, paste all of `supabase-schema.sql`, and run it.
3. Open **Authentication → Users → Add user**. Create your admin email and a strong password. Keep these private.
4. Open **Project Settings → API**. Copy the Project URL and the `anon` / publishable public key.

The SQL grants product write access to authenticated users. For a real business deployment, create admin accounts only for trusted staff. Do not enable public sign-ups.

## 3. Configure the site
Edit `config.js`:
- `supabaseUrl`: your Supabase Project URL
- `supabaseAnonKey`: your anon / publishable public key (safe for browser use when RLS is enabled)
- `showroomAddress`: full shop address
- `phone`: WhatsApp number with country code, digits only, e.g. `919876543210`

**Never put a Supabase `service_role` / secret key in this website.**

## 4. Test on your laptop
You can open `index.html` directly to preview the design, but for best results run a local web server:
- Install Python if needed.
- Open Command Prompt in this folder.
- Run: `python -m http.server 8000`
- Open `http://localhost:8000`
- Admin page: `http://localhost:8000/admin.html`

Before connecting Supabase, the homepage shows sample demo products. Once Supabase is configured, it loads your live product list. The sample products are not your real inventory; delete or replace them by adding products in the admin panel.

## 5. Publish online (free hosting options)
Use Netlify or Cloudflare Pages:
1. Upload the extracted project folder to your hosting provider (or connect a GitHub repository).
2. Publish the folder as a static website. The entry page is `index.html`.
3. Add your custom domain in the hosting provider if you own one.
4. In Supabase Authentication → URL Configuration, set your published website URL as the Site URL.
5. Test the public catalogue and `/admin.html` on a phone and laptop.

The website will be public to view once hosted. Admin product changes are stored in Supabase and appear on the public catalogue.

## 6. How to manage products
1. Open `your-domain/admin.html`.
2. Sign in with the admin email and password you created.
3. Add a product name, category, price, description and image.
4. Use **EDIT** to change the details or price.
5. Use **DELETE** to remove a product.

Images are uploaded to the Supabase `product-images` bucket. Use JPG, PNG or WEBP, up to 5 MB.

## 7. Before going live
- Replace sample/demo products with actual Jeyam Furniture inventory and correct prices.
- Enter the real showroom address and WhatsApp number in `config.js`.
- Test admin login, product add/edit/delete and image upload.
- Use a strong unique admin password and enable two-factor authentication on the Supabase account.
- Add your own privacy/contact details if you later collect customer information.

## Important
I have created the project files, but I cannot publish it to the internet or create your Supabase/hosting accounts without your account setup and approval. Follow the steps above to make it live. Never share passwords or secret API keys in chat.
