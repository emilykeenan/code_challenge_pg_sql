-- Database name
sigma/treats
-- Document your create tables SQL here
CREATE TABLE treats (
	id SERIAL PRIMARY KEY,
	name VARCHAR(40) UNIQUE NOT NULL,
	description TEXT NOT NULL,
	pic TEXT NOT NULL
);
