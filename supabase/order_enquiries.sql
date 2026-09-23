-- Calme public order enquiry table. Run once in the Supabase SQL editor.
create table if not exists public.order_enquiries (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null check (char_length(trim(customer_name)) between 1 and 120),
  phone text not null check (phone ~ '^[0-9+() -]{10,16}$'),
  delivery_address text not null check (char_length(trim(delivery_address)) between 1 and 300),
  city text not null check (char_length(trim(city)) between 1 and 120),
  pincode text not null check (pincode ~ '^[0-9]{6}$'),
  quantity integer not null check (quantity between 1 and 5),
  confirmation_preference text not null check (confirmation_preference in ('Call me to confirm', 'WhatsApp me to confirm')),
  note text check (note is null or char_length(note) <= 500),
  privacy_consent boolean not null default false check (privacy_consent),
  status text not null default 'new' check (status in ('new', 'contacted', 'confirmed', 'cancelled')),
  created_at timestamptz not null default now()
);

alter table public.order_enquiries enable row level security;

-- The public website may insert a new enquiry only. Customers cannot list,
-- read, change or delete any customer rows with the publishable key.
revoke all on table public.order_enquiries from anon, authenticated;
grant insert (customer_name, phone, delivery_address, city, pincode,
  quantity, confirmation_preference, note, privacy_consent)
  on table public.order_enquiries to anon;

drop policy if exists "Public can submit new Calme enquiries" on public.order_enquiries;
create policy "Public can submit new Calme enquiries"
  on public.order_enquiries
  for insert
  to anon
  with check (status = 'new' and privacy_consent is true);

create index if not exists order_enquiries_created_at_idx
  on public.order_enquiries (created_at desc);
create index if not exists order_enquiries_status_idx
  on public.order_enquiries (status);
