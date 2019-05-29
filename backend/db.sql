-- use hotti;


drop table stats;
drop table history;
drop table matches;
drop table quotes;
drop table userQuestions;
drop table users;

create table users (
	id MEDIUMINT NOT NULL AUTO_INCREMENT,
	username varchar(64),
	email varchar(64),
	password varchar(64),
	name varchar(64),
	registered varchar(64),
	PRIMARY KEY (id)
);

create table userQuestions (
	id MEDIUMINT NOT NULL AUTO_INCREMENT,
	question varchar(64),
	answer1 varchar(64),
	answer2 varchar(64),
	answer3 varchar(64),
	answer4 varchar(64),
	correctAnswer varchar(64),
	name varchar(64),
	user_id MEDIUMINT,
	submitted varchar(64),
	PRIMARY KEY (id),
	FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

create table stats (
	user_id MEDIUMINT,
	games_played MEDIUMINT,
	wins MEDIUMINT,
	losses MEDIUMINT,
	year_and_month varchar(64),
	FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

create table matches (
	id MEDIUMINT NOT NULL AUTO_INCREMENT,
	player1_id MEDIUMINT,
	player2_id MEDIUMINT,
	winner varchar(64),
	date varchar(64),
	player1_score MEDIUMINT,
	player2_score MEDIUMINT,
	PRIMARY KEY (id),
	FOREIGN KEY (player1_id) REFERENCES users(id) ON DELETE CASCADE,
	FOREIGN KEY (player2_id) REFERENCES users(id) ON DELETE CASCADE
);

create table quotes (
	id MEDIUMINT NOT NULL AUTO_INCREMENT,
	quote varchar(64),
	author varchar(64),
	added varchar(64),
	PRIMARY KEY (id)
);


insert into quotes (quote, author, added) values
("To be somebody, you have to eat somebody...", "Seneca", "2019-03-02");

insert into quotes (quote, author, added) values
("I gave you my heart but you gave me no breakfast...", "Alexandra Ms. Hotti", "2019-03-02");

insert into quotes (quote, author, added) values
("I knew I should not have gone out of bed this morning...", "Squidward", "2019-03-02");
