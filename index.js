const mysql = require('mysql2')
const inquirer = require('inquirer'); 
const cTable = require('console.table'); 

// connection to database
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'VanLouis15!',
  database: 'business'
});

// shows connectiuon err or displays connection id at userPrompt start up
connection.connect(err => {
  if (err) throw err;
  console.log('connected as id ' + connection.threadId);
  welcome();
});

// After connection is established display welcome image with project name 
welcome = () => {
  console.log("***********************************")
  console.log("*                                 *")
  console.log("*        EMPLOYEE TRACKER         *")
  console.log("*        FOR YOUR BUSINESS        *")
  console.log("*                                 *")
  console.log("***********************************")
  userPrompt();
};

// function which prompts the user for what action they should take (inquirer package)
const userPrompt = () => {
  inquirer.prompt ([
    {
      type: 'list',
      name: 'choices', 
      message: 'What information would you like to view, add or update?',
      choices: ['View all departments', 
                'View all roles', 
                'View all employees', 
                'Add a department', 
                'Add a role', 
                'Add an employee', 
                'Update an employee role',
                'Exit']
    }
  ])
    // option direction after user selects an option from the choices list
    .then((answers) => {
      const { choices } = answers; 

      if (choices === "View all departments") {
        showDepartments();
      }

      if (choices === "View all roles") {
        showRoles();
      }

      if (choices === "View all employees") {
        showEmployees();
      }

      if (choices === "Add a department") {
        addDepartment();
      }

      if (choices === "Add a role") {
        addRole();
      }

      if (choices === "Add an employee") {
        addEmployee();
      }

      if (choices === "Update an employee role") {
        updateEmployee();
      }

      if (choices === "Exit") {
        connection.end()
    };
  });
};

showDepartments = () => {
  console.log('Showing all departments...\n');
  connection.query(
    `SELECT department.id AS id, department.name AS department FROM department`,

  function(err, rows) {
    console.table(rows); // results contains rows returned by server
    userPrompt();
  })
};

showRoles = () => {
  console.log('Showing all roles...\n');
  connection.query(
    `SELECT role.id, role.title, department.name AS department
      FROM role
      INNER JOIN department ON role.department_id = department.id`,

      function(err, rows) {
        console.table(rows);
        userPrompt();
  })
};

showEmployees = () => {
  console.log('Showing all employees...\n');
  connection.query(
    `SELECT employee.id, 
          employee.first_name, 
          employee.last_name, 
          role.title, 
          department.name AS department,
          role.salary, 
          CONCAT (manager.first_name, " ", manager.last_name) AS manager
    FROM employee
          LEFT JOIN role ON employee.role_id = role.id
          LEFT JOIN department ON role.department_id = department.id
          LEFT JOIN employee manager ON employee.manager_id = manager.id`,

  function(err, rows) {
    console.table(rows);
    userPrompt();
  })
};