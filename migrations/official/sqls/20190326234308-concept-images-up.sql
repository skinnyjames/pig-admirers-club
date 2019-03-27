create table concept_images(
  id serial primary key,
  concept_id integer references concepts(id),
  image_name varchar
);