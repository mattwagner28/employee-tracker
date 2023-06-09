INSERT INTO department (id, name)
VALUES (001, "Sales"),
       (002, "Engineering"),
       (003, "Finance"),
       (004, "Legal");

INSERT INTO role (id, title, salary, department_id)
VALUES (011, "Sales Lead", 100000, 001),
       (021, "Lead Engineer", 150000, 002),
       (041, "Legal Team Lead", 250000, 004),
       (031, "Account Manager", 160000, 003),
       (012, "Salesperson", 80000, 001),
       (022, "Software Engineer", 120000, 002),
       (032, "Accountant", 125000, 003),
       (042, "Lawyer", 190000, 004);

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES (10011, "Michael", "Scott", 011, NULL),
       (10021, "Alex", "Brubaker", 021, NULL),
       (10041, "Howard", "Hamlin", 041, NULL),
       (10031, "Joan", "Harris", 031, NULL),
       (10012, "Jim", "Biscuit", 012, 10011),
       (10022, "Johnny", "Dipp", 022, 10021),
       (10032, "Angela", "Martin", 032, 10031),
       (10042, "Kim", "Wexler", 042, 10041);


