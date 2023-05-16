const inquirer = require('inquirer');
const mysql2 = require('mysql2');

const db = mysql2.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'rootroot',
        database: 'employee_db'
    },
    console.log(`Connected to the employee_db database.`)
);

const questions = [
    {
        type: 'list',
        name: 'options',
        message: 'What would you like to do?',
        choices: ['View All Employees', 'View All Roles', 'View All Departments', 'Add a Department', 'Add a Role', 'Add an Employee', 'Update an Employee Role']
    }
];

const viewEmployees = () => {
    const sql = `SELECT employee.id, employee.first_name, employee.last_name, role.title AS role, 
                 CONCAT(manager.first_name, " ", manager.last_name) AS manager 
                 FROM employee 
                 LEFT JOIN role ON employee.role_id = role.id 
                 LEFT JOIN employee manager ON manager.id = employee.manager_id`;
    db.promise().query(sql)
        .then(([rows]) => {
            console.table(rows);
            showOptions();
        });
};

// Implement other functions like viewAllRoles, viewAllDepartments, addDepartment, addRole, addEmployee, updateEmployee


const viewRoles = () => {
  const sql = `SELECT role.id, role.title, role.salary, department.name AS department
               FROM role
               LEFT JOIN department ON role.department_id = department.id`;
  db.promise().query(sql)
      .then(([rows]) => {
          console.table(rows);
          showOptions();
      });
};

const viewDepartments = () => {
  const sql = `SELECT * FROM department`;
  db.promise().query(sql)
      .then(([rows]) => {
          console.table(rows);
          showOptions();
      });
};

const addDepartment = () => {
  inquirer.prompt({
      type: 'input',
      name: 'name',
      message: 'What is the name of the department?',
  })
  .then((data) => {
      const sql = `INSERT INTO department (name) VALUES (?)`;
      db.promise().query(sql, data.name)
          .then(() => {
              console.log('Department added successfully');
              showOptions();
          });
  });
};

const addRole = () => {
  // First get the list of departments to show as choices
  db.promise().query(`SELECT * FROM department`)
      .then(([rows]) => {
          const departments = rows.map(row => ({ name: row.name, value: row.id }));
          inquirer.prompt([
              {
                  type: 'input',
                  name: 'title',
                  message: 'What is the title of the role?',
              },
              {
                  type: 'input',
                  name: 'salary',
                  message: 'What is the salary of the role?',
              },
              {
                  type: 'list',
                  name: 'department_id',
                  message: 'Which department does the role belong to?',
                  choices: departments,
              },
          ])
          .then((data) => {
              const sql = `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`;
              db.promise().query(sql, [data.title, data.salary, data.department_id])
                  .then(() => {
                      console.log('Role added successfully');
                      showOptions();
                  });
          });
      });
};

const addEmployee = () => {
  // First get the list of roles and managers to show as choices
  Promise.all([
      db.promise().query(`SELECT * FROM role`),
      db.promise().query(`SELECT id, CONCAT(first_name, ' ', last_name) AS name FROM employee`),
  ])
  .then(([[roles], [employees]]) => {
      const roleChoices = roles.map(role => ({ name: role.title, value: role.id }));
      const managerChoices = employees.map(employee => ({ name: employee.name, value: employee.id }));
      managerChoices.unshift({ name: "None", value: null }); // Allow no manager
      inquirer.prompt([
          {
              type: 'input',
              name: 'first_name',
              message: 'What is the first name of the employee?',
          },
          {
              type: 'input',
              name: 'last_name',
              message: 'What is the last name of the employee?',
          },
          {
              type: 'list',
              name: 'role_id',
              message: 'What is the role of the employee?',
              choices: roleChoices,
          },
          {
              type: 'list',
              name: 'manager_id',
              message: 'Who is the manager of the employee?',
              choices: managerChoices,
          },
      ])
      .then((data) => {
          const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`;
          db.promise().query(sql, [data.first_name, data.last_name, data.role_id, data.manager_id])
              .then(() => {
                  console.log('Employee added successfully');
                  showOptions();
              });
      });
  });
};

const updateEmployeeRole = () => {
  // First get the list of employees and roles to show as choices
  Promise.all([
      db.promise().query(`SELECT * FROM role`),
      db.promise().query(`SELECT id, CONCAT(first_name, ' ', last_name) AS name FROM employee`),
  ])
  .then(([[roles], [employees]]) => {
      const employeeChoices = employees.map(employee => ({ name: employee.name, value: employee.id }));
      const roleChoices = roles.map(role => ({ name: role.title, value: role.id }));
      inquirer.prompt([
          {
              type: 'list',
              name: 'id',
              message: 'Which employee do you want to update?',
              choices: employeeChoices,
          },
          {
              type: 'list',
              name: 'role_id',
              message: 'What is the new role of the employee?',
              choices: roleChoices,
          },
      ])
      .then((data) => {
          const sql = `UPDATE employee SET role_id = ? WHERE id = ?`;
          db.promise().query(sql, [data.role_id, data.id])
              .then(() => {
                  console.log('Employee updated successfully');
                  showOptions();
              });
      });
  });
};

function showOptions() {
  inquirer.prompt(questions).then((data) => {
    switch (data.options) {
      case "View All Employees":
        viewEmployees();
        break;
      case "View All Departments":
        viewDepartments();
        break;
      case "View All Roles":
        viewRoles();
        break;
      case "Add a Department":
        addDepartment();
        break;
      case "Add a Role":
        addRole();
        break;
      case "Add an Employee":
        addEmployee();
        break;
      case "Update an Employee Role":
        updateEmployeeRole();
        break;
      // Add cases for other options
    }
  });
}


function init() {
    showOptions();
}

init();
