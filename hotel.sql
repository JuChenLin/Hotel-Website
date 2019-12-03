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
insert into room values (1, 'ho000001', 5, 0, 'a economic room with a twin bed without kitchen', 'economic room', 75);
insert into room values (2, 'ho000001', 5, 0, 'a economic room with a full bed without kitchen', 'standard room', 100);
insert into room values (3, 'ho000001', 15, 0, 'a standard room with a full-size bed', 'one full room', 120);
insert into room values (4, 'ho000001', 10, 0, 'a standard room with a queen-size bed', 'one queen bed', 135);
insert into room values (5, 'ho000001', 5, 0, 'a standard room with a king-size bed', 'one king bed', 150);
insert into room values (6, 'ho000001', 5, 0, 'a standard room with two twim-size bed', 'two twin room', 130);
insert into room values (7, 'ho000001', 15, 0, 'a superior room with two full-size bed', 'two full room', 200);
insert into room values (8, 'ho000001', 15, 0, 'a superior room with two queen-size bed', 'two queen room', 240);
insert into room values (9, 'ho000001', 5, 0, 'a superior room with two king-size bed', 'two king room', 280);
insert into room values (10, 'ho000001', 2, 0, 'a superior room with three queen-size bed', 'triple room', 340);
insert into room values (11, 'ho000001', 5, 0, 'a luxury room with a king-size bed and a sofa bed', 'signature suite', 350);
insert into room values (12, 'ho000001', 5, 0, 'a luxury room with one california king-size bed, a sofa bed, and a jacuzzi', 'premium suite', 500);
insert into room values (13, 'ho000001', 1, 0, 'the room equiped with the most luxury living experience', 'presidential suite', 3000);
insert into room values (14, 'ho000001', 2, 0, 'a bigger space room allow a whole family up to ten people to spend their good time in a cozy space', 'family room', 800);

-- bed table (bed_type, capacity)
insert into bed values ('twin bed', 1);
insert into bed values ('full bed', 2);
insert into bed values ('queen bed', 2);
insert into bed values ('king bed', 2);
insert into bed values ('ca king bed', 2);
insert into bed values ('sofa bed', 1);


-- room_bed table (room_id, hotel_id, number_of_beds, bed_type)
-- eco
insert into room_bed values (1, 'ho000001', 1,'twin bed');
-- std
insert into room_bed values (2, 'ho000001', 1,'full bed');
-- one full
insert into room_bed values (3, 'ho000001', 1,'full bed');
-- one queen
insert into room_bed values (4, 'ho000001', 1,'queen bed');
-- one king
insert into room_bed values (5, 'ho000001', 1,'king bed');
-- two twin
insert into room_bed values (6, 'ho000001', 2,'twin bed');
-- two full
insert into room_bed values (7, 'ho000001', 2,'full bed');
-- two queen
insert into room_bed values (8, 'ho000001', 2,'queen bed');
-- two king
insert into room_bed values (9, 'ho000001', 2,'king bed');
-- triple
insert into room_bed values (10, 'ho000001', 3,'queen bed');
-- signature
insert into room_bed values (11, 'ho000001', 1,'king bed');
insert into room_bed values (11, 'ho000001', 1,'sofa bed');
-- premium
insert into room_bed values (12, 'ho000001', 1,'ca king bed');
insert into room_bed values (12, 'ho000001', 2,'sofa bed');
-- presidential
insert into room_bed values (13, 'ho000001', 1,'ca king bed');
insert into room_bed values (13, 'ho000001', 2,'queen bed');
insert into room_bed values (13, 'ho000001', 1,'sofa bed');
-- family
insert into room_bed values (14, 'ho000001', 1,'king bed');
insert into room_bed values (14, 'ho000001', 2,'queen bed');
insert into room_bed values (14, 'ho000001', 2,'twin bed');
insert into room_bed values (14, 'ho000001', 2,'sofa bed');

-- amenity table (amenity_id, amenity)
insert into amenities values (1, 'free wifi');
insert into amenities values (2, 'free parking');
insert into amenities values (3, 'refrigerator');
insert into amenities values (4, 'laundry service');
insert into amenities values (5, 'fitness center');
insert into amenities values (6, 'bar');
insert into amenities values (7, '24hr frontdesk');
insert into amenities values (8, 'air conditioning');
insert into amenities values (9, 'daily housekeeping');
insert into amenities values (10, 'breakfast available');


-- ｈotel_amenities  table (hotel_id, amenity_id)
insert into hotel_amenities values('ho000001', 1);
insert into hotel_amenities values('ho000001', 2);
insert into hotel_amenities values('ho000001', 3);
insert into hotel_amenities values('ho000001', 4);
insert into hotel_amenities values('ho000001', 5);
insert into hotel_amenities values('ho000001', 6);
insert into hotel_amenities values('ho000001', 7);
insert into hotel_amenities values('ho000001', 8);




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





    



