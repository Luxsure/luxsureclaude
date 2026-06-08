-- ============================================================
-- Luxsure Guide — Supabase schema
-- Run this once in your Supabase SQL Editor to create the
-- addresses table used by the Android app.
-- ============================================================

-- Enable UUID generation (already enabled on most Supabase projects)
create extension if not exists "pgcrypto";

-- ============================================================
-- addresses
-- ============================================================
create table if not exists addresses (
    id                  text        primary key default gen_random_uuid()::text,
    title               text        not null,
    slug                text        not null unique,
    status              text        not null default 'published'
                            check (status in ('draft', 'review', 'published', 'archived')),
    category_slug       text        not null,
    destination_slug    text        not null,
    short_description   text        not null default '',
    editorial_note      text        not null default '',
    featured_image      text        not null default '',
    gallery             text[]      not null default '{}',
    address             text        not null default '',
    phone               text,
    email               text,
    website_url         text,
    reservation_url     text,
    instagram_url       text,
    opening_hours       text,
    price_level         text        not null default 'premium'
                            check (price_level in ('premium', 'luxury', 'exceptional')),
    editor_rating       float8      not null default 5.0
                            check (editor_rating >= 1 and editor_rating <= 5),
    best_for            text[]      not null default '{}',
    signature_experience text       not null default '',
    atmosphere          text        not null default '',
    tags                text[]      not null default '{}',
    featured            boolean     not null default false,
    lat                 float8,
    lng                 float8,
    created_at          timestamptz not null default now(),
    updated_at          timestamptz not null default now()
);

-- Index frequently filtered columns
create index if not exists idx_addresses_status          on addresses (status);
create index if not exists idx_addresses_category_slug   on addresses (category_slug);
create index if not exists idx_addresses_destination_slug on addresses (destination_slug);
create index if not exists idx_addresses_featured        on addresses (featured);

-- Auto-update updated_at on every row modification
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
    new.updated_at = now();
    return new;
end;
$$;

create trigger trg_addresses_updated_at
before update on addresses
for each row execute procedure set_updated_at();

-- ============================================================
-- Row Level Security — read-only public access for published rows
-- ============================================================
alter table addresses enable row level security;

-- Anyone (including anonymous app users) can read published addresses
create policy "public read published"
    on addresses for select
    using (status = 'published');

-- Authenticated users (editors) can manage all rows
create policy "authenticated full access"
    on addresses for all
    to authenticated
    using (true)
    with check (true);

-- ============================================================
-- Sample data — matches category / destination slugs in SeedData.kt
-- Remove or replace with your real content before going live.
-- ============================================================
insert into addresses (
    id, title, slug, status,
    category_slug, destination_slug,
    short_description, editorial_note,
    featured_image, gallery, address,
    phone, website_url, reservation_url, instagram_url,
    price_level, editor_rating,
    best_for, signature_experience, atmosphere,
    tags, featured,
    lat, lng
) values
(
    'addr_001',
    'Le Bristol Paris',
    'le-bristol-paris',
    'published',
    'palaces', 'paris',
    'Un palace intemporel sur le Faubourg Saint-Honoré, gardien de l''élégance parisienne depuis 1925.',
    'Le Bristol demeure la référence absolue du palace parisien — service irréprochable, jardins secrets et restaurant Épicure trois étoiles.',
    'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=800&q=80',
    ARRAY[
        'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1587985064135-0366536eab42?auto=format&fit=crop&w=800&q=80'
    ],
    '112 Rue du Faubourg Saint-Honoré, 75008 Paris',
    '+33 1 53 43 43 00',
    'https://www.oetkercollection.com/hotels/le-bristol-paris/',
    'https://www.oetkercollection.com/hotels/le-bristol-paris/dining/',
    'https://www.instagram.com/lebristolparis/',
    'exceptional', 5.0,
    ARRAY['Romantique', 'Art & Culture', 'Gastronomie'],
    'Suite Royal avec vue sur jardins privés et dîner chez Épicure.',
    'Élégance feutrée, service discret, clientèle internationale d''exception.',
    ARRAY['palace', 'paris', 'gastronomie', 'étoilé', 'faubourg'],
    true,
    48.8719, 2.3130
),
(
    'addr_002',
    'Guy Savoy',
    'guy-savoy',
    'published',
    'gastronomy', 'paris',
    'La table suprême de la haute gastronomie française, nichée dans les salons de la Monnaie de Paris.',
    'Trois étoiles Michelin depuis 2002. Guy Savoy incarne mieux que quiconque la gastronomie française vivante : créativité, rigueur, générosité.',
    'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=80',
    ARRAY[
        'https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?auto=format&fit=crop&w=800&q=80'
    ],
    '11 Quai de Conti, 75006 Paris',
    '+33 1 43 80 40 61',
    'https://www.guysavoy.com/',
    'https://www.guysavoy.com/en/reservation/',
    'https://www.instagram.com/guysavoy_restaurant/',
    'exceptional', 5.0,
    ARRAY['Gastronomie', 'Occasion spéciale', 'Art & Culture'],
    'Menu Couleurs, Textures & Saveurs face à la Seine.',
    'Grandeur sobre, art contemporain, Seine illuminée.',
    ARRAY['étoilé', 'michelin', 'paris', 'gastronomie', 'seine'],
    true,
    48.8570, 2.3407
),
(
    'addr_003',
    'The Peninsula Tokyo',
    'the-peninsula-tokyo',
    'published',
    'palaces', 'tokyo',
    'Majestueux face au Palais Impérial, le Peninsula Tokyo est l''incarnation du luxe nippo-occidental.',
    'Vue imprenable sur le Palais Impérial, service Peninsula légendaire et spa de 1 400 m². Une adresse sans égale à Tokyo.',
    'https://images.unsplash.com/photo-1540959733332-eab4deceeaf7?auto=format&fit=crop&w=800&q=80',
    ARRAY[
        'https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=800&q=80'
    ],
    '1-8-1 Yurakucho, Chiyoda, Tokyo 100-0006',
    '+81 3 6270 2888',
    'https://www.peninsula.com/tokyo',
    'https://www.peninsula.com/tokyo/hotel-rooms-suites',
    'https://www.instagram.com/thepeninsulahotels/',
    'exceptional', 5.0,
    ARRAY['Romantique', 'Bien-être', 'Art & Culture'],
    'Suite Grand Deluxe avec vue sur le Palais Impérial au lever du soleil.',
    'Harmonie zen, raffinement absolu, discrétion totale.',
    ARRAY['palace', 'tokyo', 'spa', 'palais-imperial', 'japon'],
    true,
    35.6741, 139.7602
);
