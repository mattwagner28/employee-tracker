const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');

const questions = [
    {

    },
]

// TODO: Create a function to initialize app
function init() {
    inquirer
    .prompt(questions)
    .then((answers) => {
        console.log(answers);
        const readmeContent = generateMarkdown(answers);
        writeToFile('README.md', readmeContent);
    });
}

// Function call to initialize app
init();