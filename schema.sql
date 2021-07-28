DROP DATABASE IF EXISTS Etmms_db;

CREATE DATABASE Etmms_db;

USE Etmms_db;

CREATE TABLE departments (
  id INT NOT NULL AUTO_INCREMENT,
  dept_name VARCHAR(30) NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE roles (
    id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(30) UNIQUE NOT NULL,
    salary DECIMAL(10,2) NOT NULL,
    dept_id INT NOT NULL,
    FOREIGN KEY (dept_id) REFERENCES departments (id) ON DELETE CASCADE,
    PRIMARY KEY (id)
);

CREATE TABLE employee (
    id INT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT NOT NULL,
    INDEX role_ind (role_id),
    FOREIGN KEY (role_id) REFERENCES roles (id) ON DELETE CASCADE,
    man_id INT,
    FOREIGN KEY (man_id) REFERENCES employee (id) ON DELETE SET NULL,
    PRIMARY KEY (id)
);

INSERT INTO departments (dept_name) VALUES ("Management"), ("Talent Aquisition"), ("Operations"), ("Finance ");

INSERT INTO roles (title, salary, dept_id) VALUES ("Head of Finance", 100000, 1), ("Project Coordinator", 70000, 2), ("Operations Specialist", 50000, 3), ("Financial Analyst", 80000, 4);

INSERT INTO employee (first_name, last_name, role_id, man_id) VALUES ("David", "Pedraza", 1, NULL), ("Felix", "Goldson", 2, 1), ("Isaac", "Goldson", 3, 1), ("Jenna", "Burns", 4, 1);
