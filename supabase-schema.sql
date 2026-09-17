-- Supabase setup for candidate registration.
-- Database table: applicants
-- Storage bucket: candidate-photos

create table if not exists public.applicants (
  id text primary key,
  full_name text not null,
  email text not null,
  gender text not null,
  nationality text not null,
  birth_date date,
  age integer not null,
  passport_number text not null,
  photo_url text not null,
  status text not null check (status in ('pending', 'approved', 'rejected')),
  submitted_at date not null,
  notes text,
  otp text not null unique,
  phone text,
  created_at timestamptz not null default now()
);

alter table public.applicants enable row level security;

-- The current app uses its own local admin gate, not Supabase Auth.
-- These policies allow the browser client to read and insert records with the anon key.
create policy "Public can read applicants"
  on public.applicants for select
  to anon, authenticated
  using (true);

create policy "Public can insert applicants"
  on public.applicants for insert
  to anon, authenticated
  with check (true);

insert into storage.buckets (id, name, public)
values ('candidate-photos', 'candidate-photos', true)
on conflict (id) do nothing;

create policy "Public can read candidate photos"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'candidate-photos');

create policy "Public can upload candidate photos"
  on storage.objects for insert
  to anon, authenticated
  with check (bucket_id = 'candidate-photos');

create policy "Public can update candidate photos"
  on storage.objects for update
  to anon, authenticated
  using (bucket_id = 'candidate-photos')
  with check (bucket_id = 'candidate-photos');

create policy "Public can delete candidate photos"
  on storage.objects for delete
  to anon, authenticated
  using (bucket_id = 'candidate-photos');
