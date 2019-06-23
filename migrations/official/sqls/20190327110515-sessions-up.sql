create table sessions(
  id serial primary key,
  user_id integer not null,
  user_type varchar not null,
  expires timestamp not null,
  created_at timestamp not null default now(),
  payload json
);