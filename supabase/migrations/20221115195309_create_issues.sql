--------------------------------------------------------------------------------
-- Products

create table public.issues (
  id bigint generated by default as identity primary key,
  customer_id bigint,
  charge_id bigint,
  scheduled_at timestamp without time zone,
  bundle_id varchar,
  data jsonb,
  created_at timestamp with time zone not null default now(),
  resolved_at timestamp with time zone
);
