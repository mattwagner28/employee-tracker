const inquirer = require("inquirer");
const mysql = require("mysql2");
const cTable = require("console.table");

// create the connection to database
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "SQLSally28!",
  database: "employees_db",
});

//Question prompt giving main menu options when user initializes app
const mainMenu = [
  {
    type: "list",
    message: "What would you like to do?",
    choices: [
      "View All Departments",
      "View All Roles",
      "View All Employees",
      "Add a Department",
      "Add a Role",
      "Add an Employee",
      "Update an Employee Role",
    ],
    name: "action",
    // validate: function () {
    //     if (answer = 'View All Departments') {
    //         getDeptTable();
    //     } return console.log('error');
    // }
  },
];

//Prompt if user chooses to add a department
const newDeptPrompt = [
  {
    type: "input",
    message: "Please enter the name of the new department.",
    name: "department",
  },
];

const newRolePrompt = [
  {
    type: "input",
    message: "Please enter the name of the new role.",
    name: "title",
  },
  {
    type: "input",
    message: "Please enter the salary of the new role.",
    name: "salary",
  },
  {
    type: "list",
    message: "Please select a department for the new role.",
    choices: async function () {
      const deptNames = await getDeptArray();
      return deptNames;
    },
    name: "department_id",
  },
];

// Query displaying departments table
const getDeptTable = () => {
  connection.query("SELECT * FROM DEPARTMENT", function (err, results, fields) {
    // console.log(results); // results contains rows returned by server
    // console.log(fields); // fields contains extra meta data about results, if available
    let deptTable = cTable.getTable(results);
    // console.log('DEPARTMENTS');
    console.log(deptTable);
  });
};

// Retrieves up-to-date array of department names for whenever user needs to add a department in a query
const getDeptArray = () => {
  return new Promise((resolve, reject) => {
    connection.query("SELECT * FROM DEPARTMENT", function (err, results) {
      if (err) {
        reject(err);
      } else {
        const deptNames = results;
        resolve(deptNames);
        return results;
      }
    });
  });
};

//Converts selected department from query to the ID to then add to a table
const getDeptID = (department_id) => {
    return new Promise((resolve, reject) => {
      connection.query(
        `SELECT id FROM department WHERE name = '${department_id}';`,
        function (err, results, fields) {
          if (err) {
            reject(err);
          } else {
            const id = parseInt(results[0].id);
            resolve(id);
          }
        }
      );
    });
  };

// Query displaying role table
const getRoleTable = () => {
  connection.query("SELECT * FROM ROLE", function (err, results, fields) {
    // console.log(results); // results contains rows returned by server
    // console.log(fields); // fields contains extra meta data about results, if available
    let roleTable = cTable.getTable(results);
    // console.log('ROLES');
    console.log(roleTable);
  });
};

// Query displaying role table
const getEmployeeTable = () => {
  connection.query("SELECT * FROM EMPLOYEE", function (err, results, fields) {
    // console.log(results); // results contains rows returned by server
    // console.log(fields); // fields contains extra meta data about results, if available
    let employeeTable = cTable.getTable(results);
    // console.log('EMPLOYEES');
    console.log(employeeTable);
  });
};

const addDept = (department) => {
  connection.query(
    `INSERT INTO department (name) VALUES ('${department}');`,
    function (err, results) {
      if (err) throw err;
      console.log("Department added successfully.");
    }
  );
};

const addRole = (role, salary, department_id) => {
  connection.query(
    `INSERT INTO role (title, salary, department_id) VALUES ('${role}', ${salary}, ${department_id});`,
    function (err, results) {
      if (err) throw err;
      console.log("New role added successfully.");
    }
  );
};

// TODO: Create a function to initialize app
// Function to initialize app
async function init() {
  const answers = await inquirer.prompt(mainMenu);
  if (answers.action === "View All Departments") {
    await getDeptTable();
  } else if (answers.action === "View All Roles") {
    await getRoleTable();
  } else if (answers.action === "View All Employees") {
    await getEmployeeTable();
  } else if (answers.action === "Add a Department") {
    const deptAnswers = await inquirer.prompt(newDeptPrompt);
    await addDept(deptAnswers.department);
  } else if (answers.action === "Add a Role") {
    const roleAnswers = await inquirer.prompt(newRolePrompt);
    await addRole(roleAnswers.title, roleAnswers.salary, await getDeptID(roleAnswers.department_id));
  }
}

// Function call to initialize app
init();
