-- Run this entire script in Supabase > SQL Editor.
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null default 'Other',
  price numeric(12,2) not null default 0 check (price >= 0),
  description text default '',
  image_url text,
  image_path text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.products enable row level security;

-- Everyone can view active catalogue products.
drop policy if exists "Public can view active products" on public.products;
create policy "Public can view active products"
on public.products for select
using (active = true or auth.role() = 'authenticated');

-- Only signed-in admins can add, edit or delete.
drop policy if exists "Admins can insert products" on public.products;
create policy "Admins can insert products"
on public.products for insert to authenticated
with check (true);

drop policy if exists "Admins can update products" on public.products;
create policy "Admins can update products"
on public.products for update to authenticated
using (true) with check (true);

drop policy if exists "Admins can delete products" on public.products;
create policy "Admins can delete products"
on public.products for delete to authenticated
using (true);

-- Create a PUBLIC storage bucket for catalogue photos.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('product-images', 'product-images', true, 5242880, array['image/jpeg','image/png','image/webp'])
on conflict (id) do update set public = true, file_size_limit = 5242880;

drop policy if exists "Public can view product images" on storage.objects;
create policy "Public can view product images"
on storage.objects for select
using (bucket_id = 'product-images');

drop policy if exists "Admins can upload product images" on storage.objects;
create policy "Admins can upload product images"
on storage.objects for insert to authenticated
with check (bucket_id = 'product-images');

drop policy if exists "Admins can update product images" on storage.objects;
create policy "Admins can update product images"
on storage.objects for update to authenticated
using (bucket_id = 'product-images') with check (bucket_id = 'product-images');

drop policy if exists "Admins can delete product images" on storage.objects;
create policy "Admins can delete product images"
on storage.objects for delete to authenticated
using (bucket_id = 'product-images');