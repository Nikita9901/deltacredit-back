drop table if exists tokens;
drop table if exists passport_details;
drop table if exists transactions;
drop table if exists user_review;
drop table if exists borrow_request;
drop table if exists money_offer;
drop table if exists users;
create table users
(
    id               integer primary key auto_increment,
    name             varchar(255),
    surname          varchar(255),
    email            varchar(255),
    image            varchar(255),
    phone_number     varchar(20),
    username         varchar(255),
    password_hash    varchar(255),
    activation_link  VARCHAR(255),
    isActivated      boolean DEFAULT false,
    wallet           float   default 0,
    income_statement VARCHAR(255)
);

create table tokens
(
    user_id             integer,
    refresh_token       varchar(255),
    ip_user             varchar(40),
    browser_fingerprint varchar(255),
    foreign key (user_id) references users (id)
);
create table money_offer
(
    id          integer primary key auto_increment,
    user_id     integer,
    amount      float,
    percent     float,
    period_date    integer,
    description varchar(255),
    foreign key (user_id) references users (id)
);

create table passport_details
(
    user_id                integer,
    name                   varchar(255),
    surname                varchar(255),
    country                varchar(255),
    city                   varchar(255),
    address                varchar(255),
    passport_serial_number varchar(255),
    passport_id_number     varchar(255),
    passport_issued_by     varchar(255),
    image_with_passport    varchar(255),
    verificated_passport   boolean,
    foreign key (user_id) references users (id)
);

create table borrow_request
(
    id             integer primary key auto_increment,
    user_id        integer,
    money_offer_id integer,
    amount         float default 0,
    percent        float default 0,
    approval_date  date,
    foreign key (user_id) references users (id),
    foreign key (money_offer_id) references money_offer (id)
);

create table transactions
(
    id                    integer primary key auto_increment,
    balance_change_amount float,
    borrow_request_id     integer,
    user_id               integer,
    date                  date,
    foreign key (borrow_request_id) references borrow_request (id),
    foreign key (user_id) references users (id)
);

create table user_review
(
    id                integer primary key auto_increment,
    reviewer_id       integer,
    user_id           integer,
    borrow_request_id integer,
    score             float,
    foreign key (user_id) references users (id),
    foreign key (reviewer_id) references users (id),
    foreign key (borrow_request_id) references borrow_request (id)
);


