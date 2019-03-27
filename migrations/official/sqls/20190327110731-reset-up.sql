create type reset_type as enum('patron', 'artist');

create table reset(
  id serial primary key,
  type reset_type not null,
  expires timestamp not null,
  created_at timestamp not null default now()
);