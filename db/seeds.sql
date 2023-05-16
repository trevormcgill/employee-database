USE employee_db;

INSERT INTO department (name) VALUES
    ('Sales'),
    ('Engineering'),
    ('Finance'),
    ('Legal');

INSERT INTO role (title, salary, department_id) VALUES
    ('Sales Lead', 100000, (SELECT id FROM department WHERE name = 'Sales')),
    ('Salesperson', 80000, (SELECT id FROM department WHERE name = 'Sales')),
    ('Lead Engineer', 150000, (SELECT id FROM department WHERE name = 'Engineering')),
    ('Software Engineer', 120000, (SELECT id FROM department WHERE name = 'Engineering')),
    ('Accountant', 70000, (SELECT id FROM department WHERE name = 'Finance')),
    ('Legal Team Lead', 250000, (SELECT id FROM department WHERE name = 'Legal')),
    ('Lawyer', 190000, (SELECT id FROM department WHERE name = 'Legal'));

INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES
    ('John', 'Doe', 1, NULL),
    ('Jane', 'Smith', 2, 1),
    ('Mary', 'Johnson', 3, NULL),
    ('James', 'Brown', 4, 3),
    ('Emily', 'Davis', 5, NULL),
    ('Michael', 'Miller', 6, NULL),
    ('Elizabeth', 'Garcia', 7, 6);
