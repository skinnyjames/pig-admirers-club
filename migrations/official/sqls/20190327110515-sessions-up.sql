create table sessions(
  id serial primary key,
  expires timestamp not null,
  created_at timestamp not null default now(),
  payload json
);