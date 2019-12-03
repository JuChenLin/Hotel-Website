-- part 1. create table
drop database if exists hotel;
create database hotel;
use hotel;

create table hotel(
    hotel_id                varchar(10) not null, 
    hotel_name              varchar(50) not null,
    hotel_instruction       varchar(300) null,
    address_street_number   varchar(100) not null,
    address_city            varchar(15) not null,
    address_state_province  varchar(15) null,
    address_country         varchar(30) not null,
    zipcode                 varchar(15) not null, 
    star_rating             float null,
    contact_name            varchar(20) not null,
    contact_phone           varchar(20) not null,
    contact_email           varchar(30) not null,
    primary key (hotel_id)
);

create table amenities (
  amenity_id  int auto_increment,
  amenity varchar(25) not null,
  primary key(amenity_id)
); 

create table hotel_amenities(
    hotel_id varchar(10) not null, 
    amenity_id  integer
);

create table room_type (
    room_id int auto_increment,
    room_feature varchar(250),
    room_name varchar(60),
    primary key (room_id)
);

create table hotel_room (
    hotel_id varchar(10) not null,
    room_id int not null,
    rooms_avalability boolean default true,
    total_num int not null,
    room_price int not null, 
    primary key(hotel_id, room_id)
);

create table room_not_available_date (
    hotel_id varchar(10) not null, 
    room_id int not null,
    not_available_date date not null,
    not_available_num int not null,
    primary key(hotel_id, room_id, not_available_date)
);

create table bed(
    bed_type varchar(20) not null,
    capacity int not null,
    primary key (bed_type)
);

create table room_bed(
    room_id int auto_increment,
    hotel_id varchar(10) not null,
    number_of_beds int not null,
    bed_type varchar(20) not null,
    primary key(room_id, hotel_id, bed_type)  
);

create table photo(
    photo_id int auto_increment,
    photo_address varchar(100) not null,
    primary key(photo_id)
);

create table room_photo(
    room_id int not null,
    photo_id int not null
);

create table hotel_photo(
    hotel_id varchar(10) not null,
    photo_id int not null
);

create table bed_photo(
    bed_type varchar(20) not null,
    photo_id int not null
);





-- part 2. foriegn key reference
alter table hotel_amenities add constraint ha_h_key foreign key(hotel_id) references hotel(hotel_id);
alter table hotel_amenities add constraint ha_a_key foreign key(amenity_id) references amenities(amenity_id);
alter table hotel_room add constraint hr_h_key foreign key(hotel_id) references hotel(hotel_id);
alter table hotel_room add constraint hr_r_key foreign key(room_id) references room_type(room_id);
alter table room_not_available_date add constraint rna_h_key foreign key(hotel_id) references hotel(hotel_id);
alter table room_not_available_date add constraint rna_r_key foreign key(room_id) references room_type(room_id);
alter table room_bed add constraint rb_h_key foreign key(hotel_id) references hotel(hotel_id);
alter table room_bed add constraint rb_r_key foreign key(room_id) references room_type(room_id);
alter table room_bed add constraint rb_b_key foreign key(bed_type) references bed(bed_type);

alter table room_photo add constraint rp_r_key foreign key(room_id) references room_type(room_id);
alter table room_photo add constraint rp_pr_key foreign key(photo_id) references photo(photo_id);

alter table hotel_photo add constraint rp_h_key foreign key(hotel_id) references hotel(hotel_id);
alter table hotel_photo add constraint rp_ph_key foreign key(photo_id) references photo(photo_id);

alter table bed_photo add constraint rp_b_key foreign key(bed_type) references bed(bed_type);
alter table bed_photo add constraint rp_pb_key foreign key(photo_id) references photo(photo_id);


-- part 3. data insertion

-- hotel table
insert into hotel 
values ('ho000001','hilton garden inn hollywood','3-star hotel with outdoor pool, near dolby theater','','2005 n highland avenue','los angeles', 'ca', 'united states of america', '90068', '3', 'jasmine cole', '855-239-9477', 'manager@hilton.com');

-- room table (room_id, hotel_id, room_total_num, room_num_not_available, room_feature, room_type, room_price)


-- bed table (bed_type, capacity)



-- room_bed table (room_id, hotel_id, number_of_beds, bed_type)


-- amenity table (amenity_id, amenity)


-- ｈotel_amenities  table (hotel_id, amenity_id)




-- part 4. procedures






-- delete table
-- drop table reservation;
-- drop table room_bed;
-- drop table room;
-- drop table bed;
-- drop table hotel_amenities;
-- drop table amenities;
-- drop table review;
-- drop table offer_deal;
-- drop table deal;
-- drop table hotel;
-- drop table room_price;
-- drop table creditcard;
-- drop table customer;





    



