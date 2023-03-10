
create table passport_data(
    id_user integer,
    name varchar(255),
    surname varchar(255),
    country varchar(255),
    city varchar(255),
    address varchar(255),
    passport_serial_number varchar(255),
    passport_id_number varchar(255),
    passport_issued_by varchar(255),
    image_with_passport varchar(255),
    verificated_passport boolean,
    foreign key (id_user) references users (id)
);

create table t1(
    id integer
);
drop table t1;

create table tokens(
    user_id integer,
    refresh_token varchar(255),
    ip_user varchar(255),
    browser_fingerprint varchar(255),
    foreign key (user_id) references users (id)
);

create table users(
    id serial primary key,
    name varchar(255),
    surname varchar(255),
    email varchar(255),
    image varchar(255),
    phone_number varchar(20),
    username varchar(255),
    password_hash varchar(255),
    activation_link VARCHAR(255),
    verificated_email boolean,
    wallet float,
    income_statement VARCHAR(255)
);
-- create table login_data(
--     id_user integer,
--     username varchar(255),
--     password varchar(255),
--     foreign key (id_user) references users (id)
-- );