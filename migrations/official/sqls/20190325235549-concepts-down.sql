drop trigger if exists concept_updated on concepts;
drop table concepts;
drop function if exists set_updated_timestamp();
drop type concept_status;
drop extension if exists "uuid-ossp";
