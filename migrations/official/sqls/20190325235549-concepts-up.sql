create extension if not exists "uuid-ossp";

create type concept_status as enum ('new', 'started', 'aborted', 'finished');

CREATE FUNCTION set_updated_timestamp()
  RETURNS TRIGGER
  LANGUAGE plpgsql
AS $$
BEGIN 
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

create table concepts(
  id serial primary key,
  guid uuid not null default uuid_generate_v1(),
  title varchar(355),
  media varchar not null,
  description text,
  price float not null,
  artist_id integer references artists(id) not null,
  status concept_status default 'new',
  created_at timestamp not null default now(),
  updated_at timestamp not null default now(), 
  finished_at timestamp
);

create trigger concept_updated 
  before update on concepts
  for each row execute procedure set_updated_timestamp();
