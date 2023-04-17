const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');

// create the connection to database
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'SQLSally28!',
    database: 'employees_db'
  });

// Query displaying departments table
const getDeptTable = () => {
    connection.query(
    'SELECT * FROM DEPARTMENT',
    function(err, results, fields) {
        // console.log(results); // results contains rows returned by server
        // console.log(fields); // fields contains extra meta data about results, if available
        const deptTable = cTable.getTable(results);
        console.log('DEPARTMENTS');
        console.log(deptTable);
    }
)
};

const questions = [
    {
        type: 'list', 
        message: 'What would you like to do?',
        choices: ['View All Departments', 'View All Roles', 'View All Employees', 'Add a Department',
    'Add a Role', 'Add an Employee', 'Update an Employee Role'],
        name: 'action',
        // validate: function () {
        //     if (answer = 'View All Departments') {
        //         getDeptTable();
        //     } return console.log('error');
        // }
    },
];

// TODO: Create a function to initialize app
function init() {
    inquirer
    .prompt(questions)
    .then((answers) => {
        // console.log(answers);
        if (answers.action = 'View All Departments') {
            getDeptTable()
            init();
        } 
    })

};

// Function call to initialize app
init();