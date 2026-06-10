-- ============================================================
-- SHIP CREW AGENCY — Supabase schema
-- Run this once in the Supabase SQL editor (Project → SQL Editor).
-- Idempotent where possible. Writes go through the service role
-- (admin API routes) which bypasses RLS; public reads are limited
-- by the policies below.
-- ============================================================

-- Shared updated_at trigger ----------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ============================================================
-- BLOG POSTS (bilingual: language = 'en' | 'zh')
-- ============================================================
create table if not exists public.blog_posts (
  id               bigserial primary key,
  language         text not null default 'en',     -- 'en' | 'zh'
  title            text not null,
  slug             text not null,
  excerpt          text,
  content          text,                            -- HTML body
  featured_image   text,
  category         text default 'Insights',
  tag              text,
  is_premium       boolean default false,
  views            integer default 0,
  read_time        text default '5 min read',
  status           text default 'draft',            -- draft | published | scheduled
  author_name      text default 'Ship Crew Agency',
  author_role      text default 'Maritime Editorial Team',
  meta_title       text,
  meta_description text,
  layout           text default 'with-sidebar',     -- with-sidebar | full-page
  custom_css       text,
  custom_schema    text,
  show_on_blog     boolean default true,
  scheduled_at     timestamptz,
  created_at       timestamptz default now(),
  updated_at       timestamptz default now(),
  published_at     timestamptz,
  unique (language, slug)
);

create index if not exists idx_blog_posts_slug on public.blog_posts (slug);
create index if not exists idx_blog_posts_status on public.blog_posts (status);
create index if not exists idx_blog_posts_language on public.blog_posts (language);
create index if not exists idx_blog_posts_created_at on public.blog_posts (created_at desc);

drop trigger if exists trg_blog_posts_updated_at on public.blog_posts;
create trigger trg_blog_posts_updated_at
  before update on public.blog_posts
  for each row execute function public.set_updated_at();

alter table public.blog_posts enable row level security;
drop policy if exists "blog_posts_public_read" on public.blog_posts;
create policy "blog_posts_public_read"
  on public.blog_posts for select
  using (status = 'published');

-- ============================================================
-- VAULT CREDENTIALS (encrypted, admin-only)
-- ============================================================
create table if not exists public.vault_credentials (
  id                 bigserial primary key,
  site_name          text not null,
  site_url           text,
  username           text,
  password_encrypted text not null,    -- AES-256-GCM, base64(iv||authTag||ciphertext)
  notes              text,
  created_at         timestamptz default now(),
  updated_at         timestamptz default now()
);

create index if not exists idx_vault_site_name on public.vault_credentials (site_name);
create index if not exists idx_vault_created_at on public.vault_credentials (created_at desc);

drop trigger if exists trg_vault_updated_at on public.vault_credentials;
create trigger trg_vault_updated_at
  before update on public.vault_credentials
  for each row execute function public.set_updated_at();

alter table public.vault_credentials enable row level security;
-- No policies = default deny. Only the service role (admin API) touches this.

-- ============================================================
-- CONTACT REQUESTS (public form submissions)
-- ============================================================
create table if not exists public.contact_requests (
  id              bigserial primary key,
  name            text,
  company         text,
  email           text,
  phone           text,
  vessel_type     text,
  service_type    text,
  ranks_required  text,
  message         text,
  language        text default 'en',
  status          text default 'new',   -- new | read | archived
  created_at      timestamptz default now()
);

create index if not exists idx_contact_requests_created_at on public.contact_requests (created_at desc);
create index if not exists idx_contact_requests_status on public.contact_requests (status);

alter table public.contact_requests enable row level security;
-- No public read. Inserts handled by the service role via /api/contact.

-- ============================================================
-- SITE SETTINGS (key-value store for editable site content)
-- ============================================================
create table if not exists public.site_settings (
  key         text primary key,
  value       text,
  type        text not null default 'text',   -- text | textarea | url | email | image | number
  group_name  text not null default 'general',
  label       text,
  updated_at  timestamptz default now()
);

alter table public.site_settings enable row level security;
drop policy if exists "site_settings_public_read" on public.site_settings;
create policy "site_settings_public_read"
  on public.site_settings for select using (true);

-- ============================================================
-- MENU ITEMS (header + footer navigation, per language)
-- ============================================================
create table if not exists public.menu_items (
  id          bigserial primary key,
  language    text not null default 'en',
  location    text not null,                 -- header | footer_services | footer_categories | footer_company | footer_bottom
  label       text not null,
  url         text not null,
  target      text not null default '_self',
  parent_id   bigint references public.menu_items(id) on delete cascade,
  sort_order  int not null default 0,
  enabled     boolean not null default true,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

create index if not exists idx_menu_items_location on public.menu_items (location);
drop trigger if exists trg_menu_items_updated_at on public.menu_items;
create trigger trg_menu_items_updated_at
  before update on public.menu_items
  for each row execute function public.set_updated_at();

alter table public.menu_items enable row level security;
drop policy if exists "menu_items_public_read" on public.menu_items;
create policy "menu_items_public_read"
  on public.menu_items for select using (enabled = true);

-- ============================================================
-- SOCIAL LINKS
-- ============================================================
create table if not exists public.social_links (
  id          bigserial primary key,
  label       text not null,
  href        text not null,
  icon        text not null default 'globe',   -- key into the icon set
  sort_order  int not null default 0,
  enabled     boolean not null default true,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

alter table public.social_links enable row level security;
drop policy if exists "social_links_public_read" on public.social_links;
create policy "social_links_public_read"
  on public.social_links for select using (enabled = true);

-- ============================================================
-- SITE SCRIPTS (header / body script injection — GA, pixels, etc.)
-- ============================================================
create table if not exists public.site_scripts (
  id          bigserial primary key,
  name        text not null,
  code        text not null,
  position    text not null default 'head',   -- head | body_start | body_end
  enabled     boolean not null default true,
  sort_order  int not null default 0,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

drop trigger if exists trg_site_scripts_updated_at on public.site_scripts;
create trigger trg_site_scripts_updated_at
  before update on public.site_scripts
  for each row execute function public.set_updated_at();

alter table public.site_scripts enable row level security;
drop policy if exists "site_scripts_public_read" on public.site_scripts;
create policy "site_scripts_public_read"
  on public.site_scripts for select using (enabled = true);

-- ============================================================
-- NEWSLETTER SUBSCRIBERS (public signup form)
-- ============================================================
create table if not exists public.newsletter_subscribers (
  id          bigserial primary key,
  email       text not null unique,
  language    text default 'en',
  status      text default 'subscribed',   -- subscribed | unsubscribed
  created_at  timestamptz default now()
);

create index if not exists idx_newsletter_created_at on public.newsletter_subscribers (created_at desc);

alter table public.newsletter_subscribers enable row level security;
-- No public read. Inserts handled by the service role via /api/newsletter.

-- ============================================================
-- STORAGE
-- Create a PUBLIC bucket named "images" via the Supabase dashboard
-- (Storage → New bucket → name: images → Public). Used by /api/admin/upload.
-- ============================================================
