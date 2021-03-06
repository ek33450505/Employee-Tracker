const mysql = require('mysql2')
const inquirer = require('inquirer'); 
const cTable = require('console.table'); 
const { query } = require('express');

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
        updateEmployeeRole();
      }

      if (choices === "Exit") {
        connection.end();
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

addDepartment = () => {
  inquirer.prompt([
    {
      type: 'input',
      name: 'addDepartment',
      message: 'What department name would you like to add?',
      validate: addDepartment => {
        if(addDepartment) {
          return true;
        } else {
          console.log('Invalid input, please try again!');
          return false;
        }
      }
    }
  ])
    .then(answer => {
      const sql = `INSERT INTO department (name)
                    VALUES (?)`;
      connection.query(sql, answer.addDepartment, (err, result) => {
        if (err) throw err;
        console.log('Added ' + answer.addDepartment + " to departments!");

        showDepartments();
      });
    });
};

addRole = () => {
  inquirer
      .prompt([
          {
              name: "title",
              type: "input",
              message: "What is the employees title for this role?"
          },
          {
              name: "salary",
              type: "input",
              message: "What is the salary for this role?"
          },
          {
              name: "departmentId",
              type: "input",
              message: "What is the department ID for this role?"
          }
      ])
      .then(function (answer) {
          const query = "INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)";

          connection.query(query, [answer.title, Number(answer.salary), Number(answer.departmentId)], function(err, res) {
              if (err) throw err;
              console.log('Added ' + answer.title + " to departments!");
              showRoles();
          });
      })
};

addEmployee = () => {
  inquirer
      .prompt([
          {
            name: 'firstName',
            type: 'input',
            message: 'What is your employees first name?'
          },
          {
            name: 'lastName',
            type: 'input',
            message: 'What is your employees last name?'
          },
          {
           name: 'roleId',
            type: 'input',
            message: 'What is your employees role id?'
          },
          {
            name: 'managerId',
            type: 'input',
            message: 'What is your employees manager id?'
          }
      ])
      .then(function (answer) {
        const query = "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)";

        connection.query(query, [answer.firstName, answer.lastName, Number(answer.roleId), Number(answer.managerId)], function(err, res) {
            if (err) throw err;
            console.log("Employee added to database!");
            showEmployees();
        });
    })
}

updateEmployeeRole = () => {
  inquirer
    .prompt([
      {
        name: 'roleId',
        type: 'input',
        message: 'What is the current role id number of the employee you wish to updated?'
      },
      {
        name: 'title',
        type: 'input',
        message: 'What is your employees new role title?'
      },
      {
        name: 'salary',
        type: 'input',
        message: 'What is you employees updated role salary?'
      },
      {
      name: 'departmentId',
      type: 'input',
      message: 'What is the updated department id number for this role?'
      }
    ])
      .then(function(answer) {
        const query = "UPDATE role SET title = ?, salary = ?, department_id = ? WHERE id = ?";

        connection.query(query, [answer.title, Number(answer.salary), Number(answer.departmentId), Number(answer.roleId)], function(err, res) {
          if (err) throw err;
          console.log('Your employees role has been updated!');
          showRoles();
        });
      });
}

