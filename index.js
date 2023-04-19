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
      "Quit",
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

//Prompts if user wants to add a new role
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
      //Provides updated list of department names
      const deptNames = await getDeptArray();
      return deptNames;
    },
    name: "department_id",
  },
];

//Prompts if user wants to add a new employee
const newEmployeePrompt = [
  {
    type: "input",
    message: "Please enter employee's first name.",
    name: "firstName",
  },
  {
    type: "input",
    message: "Please enter employee's last name.",
    name: "lastName",
  },
  {
    type: "list",
    message: "Please select a role for this employee.",
    choices: async function () {
          //Provides updated list of roles
      const roleNames = await getRoleArray();
      return roleNames;
    },
    name: "role_id",
  },
  {
    type: "list",
    message: "Please select a manager for this employee.",
    choices: async function () {
        //Provides updated list of managers
      const mgrNames = await getManagerArray();
      return mgrNames;
    },
    name: "manager_id",
  },
];

//Prompts if user wants to update a role
const updateRolePrompt = [
  {
    type: "list",
    message: "Please select an employee.",
    choices: async function () {
      const employeeNames = await getEmployeeArray();
      return employeeNames;
    },
    name: "employee_name",
  },
  {
    type: "list",
    message: "Please select a new role for this employee.",
    choices: async function () {
      const roleNames = await getRoleArray();
      return roleNames;
    },
    name: "role_id",
  }
]

//Could not get this to work smoothly, but after each task, it would ask the user 
//if they wanted to keep using the app
const keepGoingPrompt = [
  {
    type: "list",
    message: "Would you like to do something else?",
    choices: ["Yes", "No"],
    name: "yesOrNo",
  },
];

// Query displaying departments table
const getDeptTable = () => {
  connection.query("SELECT * FROM DEPARTMENT", function (err, results, fields) {
    let deptTable = cTable.getTable(results);
    console.table(deptTable);
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

// Retrieves up-to-date array of role names for whenever user needs to add a role in a query
const getRoleArray = () => {
  return new Promise((resolve, reject) => {
    connection.query("SELECT title FROM role", function (err, results) {
      if (err) {
        reject(err);
      } else {
        const roleNames = results.map((result) => result.title);
        resolve(roleNames);
      }
    });
  });
};

//Converts selected role from query to the ID to then add to a table
const getRoleID = (role_id) => {
  return new Promise((resolve, reject) => {
    connection.query(
      `SELECT id FROM role WHERE title = '${role_id}'`,
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

// Retrieves up-to-date array of Manager names for whenever user needs to add a department in a query
const getManagerArray = () => {
  return new Promise((resolve, reject) => {
    connection.query(
      "SELECT first_name, last_name FROM employee WHERE manager_id IS NULL",
      function (err, results) {
        if (err) {
          reject(err);
        } else {
          const mgrNames = results.map(
            (result) => `${result.first_name} ${result.last_name}`
          );
          resolve(mgrNames);
        }
      }
    );
  });
};

//Converts selected manager from query to the ID to then add to a table
const getManagerID = (manager_id) => {
  return new Promise((resolve, reject) => {
    const names = manager_id.split(" ");
    mgrLastName = names[1];
    connection.query(
      `SELECT id FROM employee WHERE last_name='${mgrLastName}'`,
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

// Retrieves up-to-date array of employee names for whenever user needs to update an employee role in a query
const getEmployeeArray = () => {
  return new Promise((resolve, reject) => {
    connection.query(
      "SELECT first_name, last_name FROM employee",
      function (err, results) {
        if (err) {
          reject(err);
        } else {
          const employeeNames = results.map(
            (result) => `${result.first_name} ${result.last_name}`
          );
          resolve(employeeNames);
        }
      }
    );
  });
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

const addEmployee = (firstName, lastName, role_id, manager_id) => {
  connection.query(
    `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('${firstName}', '${lastName}', ${role_id}, ${manager_id});`,
    function (err, results) {
      if (err) throw err;
      console.log("New employee added successfully.");
    }
  );
};

//Replaces a selected employee's role
const replaceRole = async (employee_name, role_id) => {
  const splitNames = await employee_name.split(" ");
  const lastName = await splitNames[1];
  const roleID = await getRoleID(role_id);
  connection.query(
    `UPDATE employee SET role_id = ${roleID} WHERE last_name = '${lastName}'`,
    function (err, results) {
      if (err) throw err;
      console.log("Role has been successfully updated.")
    }
  );
};

//Couldn't get this to work smoothly
  // const keepGoing = async () => {
  //   const answers = await inquirer.prompt(keepGoingPrompt);
  //   if (answers.yesOrNo === "No" ) {
  //     console.log("Goodbye!");
  //   } init();
  // };

// TODO: Create a function to initialize app

// Function to initialize app and go through the prompts depending on what the user chooses
async function init() {
  const answers = await inquirer.prompt(mainMenu);
  if (answers.action === "View All Departments") {
    await getDeptTable();
    // await keepGoing();
  } else if (answers.action === "View All Roles") {
    await getRoleTable();
  } else if (answers.action === "View All Employees") {
    await getEmployeeTable();
  } else if (answers.action === "Add a Department") {
    const deptAnswers = await inquirer.prompt(newDeptPrompt);
    await addDept(deptAnswers.department);
  } else if (answers.action === "Add a Role") {
    const roleAnswers = await inquirer.prompt(newRolePrompt);
    await addRole(
      roleAnswers.title,
      roleAnswers.salary,
      await getDeptID(roleAnswers.department_id)
    );
  } else if (answers.action === "Add an Employee") {
    const empAnswers = await inquirer.prompt(newEmployeePrompt);
    await addEmployee(
      empAnswers.firstName,
      empAnswers.lastName,
      await getRoleID(empAnswers.role_id),
      await getManagerID(empAnswers.manager_id)
    );
  } else if (answers.action === "Update an Employee Role") {
    const updateRoleAnswers = await inquirer.prompt(updateRolePrompt);
    await replaceRole(
      updateRoleAnswers.employee_name,
      updateRoleAnswers.role_id
    );
  } else {
    console.log("Goodbye!")
  }
}

// Function call to initialize app
init();
