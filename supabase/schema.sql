-- AI Fluency Academy — Full schema
-- Run this in the Supabase SQL Editor to bootstrap the database

-- Enable required extensions
create extension if not exists "uuid-ossp";

-- ============================================================
-- PROFILES (extends Supabase auth.users)
-- ============================================================
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  display_name text not null default 'Apprenant',
  avatar_url text,
  role text not null default 'user' check (role in ('user', 'editor', 'admin')),
  xp integer not null default 0,
  streak_days integer not null default 0,
  current_level integer not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

create policy "Admins can view all profiles"
  on public.profiles for select using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- ============================================================
-- COURSES
-- ============================================================
create table public.courses (
  id text primary key,
  title text not null,
  description text not null,
  long_description text not null default '',
  level text not null check (level in ('beginner', 'intermediate', 'advanced')),
  duration text not null default '0h',
  icon text not null default '📖',
  color text not null default 'from-blue-500 to-cyan-500',
  tags text[] not null default '{}',
  "order" integer not null default 0,
  is_free boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.courses enable row level security;

create policy "Courses are publicly readable"
  on public.courses for select using (true);

create policy "Admins can manage courses"
  on public.courses for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'editor'))
  );

-- ============================================================
-- MODULES
-- ============================================================
create table public.modules (
  id text primary key,
  course_id text not null references public.courses(id) on delete cascade,
  title text not null,
  "order" integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.modules enable row level security;

create policy "Modules are publicly readable"
  on public.modules for select using (true);

create policy "Admins can manage modules"
  on public.modules for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'editor'))
  );

-- ============================================================
-- LESSONS
-- ============================================================
create table public.lessons (
  id text primary key,
  module_id text not null references public.modules(id) on delete cascade,
  title text not null,
  content_md text not null default '',
  duration text not null default '10 min',
  "order" integer not null default 0,
  media_urls text[] not null default '{}',
  is_free boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.lessons enable row level security;

create policy "Free lessons are publicly readable"
  on public.lessons for select using (
    is_free = true
    or exists (select 1 from public.subscriptions where user_id = auth.uid() and status = 'active')
  );

create policy "Admins can manage lessons"
  on public.lessons for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'editor'))
  );

-- Full-text search index on lessons
alter table public.lessons add column fts tsvector
  generated always as (
    setweight(to_tsvector('french', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('french', coalesce(content_md, '')), 'B')
  ) stored;

create index lessons_fts_idx on public.lessons using gin(fts);

-- ============================================================
-- QUIZ QUESTIONS
-- ============================================================
create table public.quiz_questions (
  id text primary key,
  lesson_id text not null references public.lessons(id) on delete cascade,
  question text not null,
  options text[] not null,
  correct_index integer not null,
  explanation text not null default '',
  "order" integer not null default 0
);

alter table public.quiz_questions enable row level security;

create policy "Quiz questions readable with lesson"
  on public.quiz_questions for select using (true);

create policy "Admins can manage quiz questions"
  on public.quiz_questions for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'editor'))
  );

-- ============================================================
-- USER LESSON PROGRESS
-- ============================================================
create table public.user_lesson_progress (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  lesson_id text not null references public.lessons(id) on delete cascade,
  completed boolean not null default false,
  completed_at timestamptz,
  quiz_score integer,
  quiz_total integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id, lesson_id)
);

alter table public.user_lesson_progress enable row level security;

create policy "Users can view own progress"
  on public.user_lesson_progress for select using (auth.uid() = user_id);

create policy "Users can insert own progress"
  on public.user_lesson_progress for insert with check (auth.uid() = user_id);

create policy "Users can update own progress"
  on public.user_lesson_progress for update using (auth.uid() = user_id);

-- ============================================================
-- USER COURSE PROGRESS
-- ============================================================
create table public.user_course_progress (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  course_id text not null references public.courses(id) on delete cascade,
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  last_lesson_id text references public.lessons(id),
  unique(user_id, course_id)
);

alter table public.user_course_progress enable row level security;

create policy "Users can view own course progress"
  on public.user_course_progress for select using (auth.uid() = user_id);

create policy "Users can manage own course progress"
  on public.user_course_progress for all using (auth.uid() = user_id);

-- ============================================================
-- BADGES
-- ============================================================
create table public.badges (
  id text primary key,
  slug text unique not null,
  title text not null,
  description text not null default '',
  icon text not null default '🏅',
  category text not null check (category in ('course', 'streak', 'quiz', 'special')),
  requirement_type text not null,
  requirement_value integer not null default 1
);

alter table public.badges enable row level security;

create policy "Badges are publicly readable"
  on public.badges for select using (true);

-- ============================================================
-- USER BADGES
-- ============================================================
create table public.user_badges (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  badge_id text not null references public.badges(id) on delete cascade,
  awarded_at timestamptz not null default now(),
  unique(user_id, badge_id)
);

alter table public.user_badges enable row level security;

create policy "Users can view own badges"
  on public.user_badges for select using (auth.uid() = user_id);

-- ============================================================
-- SUBSCRIPTIONS (Stripe)
-- ============================================================
create table public.subscriptions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade unique,
  status text not null default 'active' check (status in ('active', 'canceled', 'past_due', 'trialing')),
  plan text not null default 'free' check (plan in ('free', 'pro', 'team')),
  stripe_customer_id text,
  stripe_subscription_id text,
  current_period_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.subscriptions enable row level security;

create policy "Users can view own subscription"
  on public.subscriptions for select using (auth.uid() = user_id);

-- ============================================================
-- ADMIN AUDIT LOG
-- ============================================================
create table public.admin_actions (
  id uuid primary key default uuid_generate_v4(),
  admin_id uuid not null references public.profiles(id),
  action text not null,
  target_type text not null,
  target_id text not null,
  details jsonb not null default '{}',
  created_at timestamptz not null default now()
);

alter table public.admin_actions enable row level security;

create policy "Admins can view audit log"
  on public.admin_actions for select using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "Admins can insert audit log"
  on public.admin_actions for insert with check (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- ============================================================
-- FUNCTIONS
-- ============================================================

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, display_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'display_name', 'Apprenant'));

  insert into public.subscriptions (user_id, plan, status)
  values (new.id, 'free', 'active');

  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Updated_at trigger
create or replace function public.update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger profiles_updated_at before update on public.profiles
  for each row execute procedure public.update_updated_at();

create trigger courses_updated_at before update on public.courses
  for each row execute procedure public.update_updated_at();

create trigger lessons_updated_at before update on public.lessons
  for each row execute procedure public.update_updated_at();

create trigger subscriptions_updated_at before update on public.subscriptions
  for each row execute procedure public.update_updated_at();

create trigger user_lesson_progress_updated_at before update on public.user_lesson_progress
  for each row execute procedure public.update_updated_at();
