/* Replace with your SQL commands */
create table artists( 
  id serial primary key,
  first_name varchar(255) not null,
  last_name varchar(255) not null,
  email varchar not null unique,
  password_hash varchar not null,
  password_salt varchar not null,
  bio text,
  image_url varchar(255),
  owner boolean not null
);

/* case insensitive email */
create unique index artists_lower_email_idx on artists (lower(email));
