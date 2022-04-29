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

connection.connect(err => {
  if (err) throw err;
  console.log('connected as id ' + connection.threadId);
  userPrompt();
});

// function which prompts the user for what action they should take
const userPrompt = () => {
  inquirer.prompt ([
    {
      type: 'list',
      name: 'options', 
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
  const sql = `SELECT * department`; 

  connection.promise().query(sql, (err, rows) => {
    if (err) throw err;
    console.table(rows);
    userPrompt();
  });
};
 
showRoles = () => {
 
  const sql = `SELECT * role`;
  
  connection.promise().query(sql, (err, rows) => {
    if (err) throw err; 
    console.table(rows); 
    userPrompt();
  })
};

showEmployees = () => {
  const sql = `SELECT * employee`

  connection.promise().query(sql, (err, rows) => {
    if (err) throw err; 
    console.table(rows);
    userPrompt();
  });
};
