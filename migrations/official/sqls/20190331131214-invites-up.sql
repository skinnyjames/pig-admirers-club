create table invites(
  id serial primary key,
  artist_id integer references artists(id),
  guid varchar not null default uuid_generate_v1(),
  expires timestamp not null,
  created_at timestamp not null default now()
);