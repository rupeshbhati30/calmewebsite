# Calme order enquiries — Supabase

The site is connected to the Supabase project **calme website** (`ykznvgemmrqlglcidkei`) in Mumbai (`ap-south-1`). The project estimate confirmed at creation was **$0/month**.

## Form and database

The order form in `index.html` sends consented submissions from `script.js` to `public.order_enquiries`. The table stores name, phone, delivery address, city, PIN code, quantity, confirmation preference, optional note, consent, order status and submission time. The schema migration is preserved in [`supabase/order_enquiries.sql`](supabase/order_enquiries.sql).

`supabase-config.js` contains the project URL and a publishable key. Publishable keys are intended for browser use; never place a Supabase secret or service-role key in this file.

## Access controls

RLS is enabled. The public `anon` role can insert only the customer-provided form columns, subject to the consent and new-status policy. It cannot set the order status or generated identifiers, or read, update or delete enquiries. The database was verified to have the table and the required column grants; Supabase’s security advisor returned no findings at setup time.

Review new enquiries from the Supabase dashboard using an authorized project account. Set and follow an appropriate retention/deletion period, and add anti-spam controls before promoting the website publicly. No sample customer submission was added during setup.
