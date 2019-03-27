create table orders(
  id serial primary key,
  active boolean not null,
  concept_id integer references concepts(id),
  patron_id integer references patrons(id),
  anonymous boolean not null default false,
  deposit_paid float not null,
  remainder_paid float,
  use_patron_address boolean not null,
  address varchar,
  city varchar,
  state state,
  zip varchar(30),
  phone varchar(20)
);