-- Luxsure Guide — Places table
-- Run in Supabase SQL Editor after schema.sql

create extension if not exists "uuid-ossp";
create extension if not exists unaccent;

create table public.places (
  id          uuid primary key default uuid_generate_v4(),
  slug        text unique not null,
  name        text not null,
  category    text not null,
  subcategory text,
  address     text,
  city        text,
  country     text default 'France',
  zip         text,
  lat         numeric(10, 7),
  lng         numeric(10, 7),
  phone       text,
  website     text,
  email       text,
  instagram   text,
  price_range int check (price_range between 1 and 4),
  description text,
  is_published boolean not null default true,
  source_file text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

alter table public.places enable row level security;

create policy "Places are publicly readable"
  on public.places for select using (is_published = true);

create policy "Admins can manage places"
  on public.places for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create index places_category_idx on public.places(category);
create index places_city_idx     on public.places(city);
create index places_country_idx  on public.places(country);
create index places_published_idx on public.places(is_published);

-- Full-text search (French + unaccent)
alter table public.places add column fts tsvector
  generated always as (
    setweight(to_tsvector('french', unaccent(coalesce(name, ''))), 'A') ||
    setweight(to_tsvector('french', unaccent(coalesce(city, ''))), 'B') ||
    setweight(to_tsvector('french', unaccent(coalesce(subcategory, ''))), 'C') ||
    setweight(to_tsvector('french', unaccent(coalesce(description, ''))), 'D')
  ) stored;

create index places_fts_idx on public.places using gin(fts);

create trigger places_updated_at before update on public.places
  for each row execute procedure public.update_updated_at();
