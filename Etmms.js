const inquirer = require("inquirer");
const DB = require("./db");
require("dotenv").config();
const { printTable } = require("console-table-printer");

function startProg() {
  console.log('Hello, and welcome to the Enterprise Team Member Management System. To proceed, please choose one of the following options');
  mainMenu();
}

function mainMenu() {
  inquirer
    .prompt({
      type: "list",
      name: "menu",
      message: "System Menu",
      choices: [
        "Team Member Profiles",
        "Team Member Positions",
        "Company Departments",
        "Exit",
      ],
    })
    .then(function (answer) {
      switch (answer.menu) {
        case "Team Member Profiles":
          employeePrompt();
          break;
        case "Team Member Positions":
          rolePrompt();
          break;
        case "Company Departments":
          deptPrompt();
          break;
        default:
          theEnd();
      }
    });
}

function employeePrompt() {
  inquirer
    .prompt({
      type: "list",
      name: "emplMenu",
      message: "How would you like to proceed?",
      choices: [
        "View All Team Member Profiles",
        "Add New Team Member",
        "Update Team Member Position",
        "Update Team Member Manager",
        "View Team Members by Department",
        "Remove Team Member",
        "Exit To System Menu",
      ],
    })
    .then(function (answer) {
      switch (answer.emplMenu) {
        case "View All Team Member Profiles":
          allEmployees();
          break;
        case "Add New Team Member":
          newEmployee();
          break;
        case "Update Team Member Position":
          updateEmployee();
          break;
        case "Update Team Member Manager":
          updateManager();
          break;
        case "View Team Members by Department":
          emplByDept();
          break;
        case "Remove Team Member":
          removeEmployee();
          break;

        default:
          mainMenu();
      }
    });
}

const allEmployees = () => {
  console.log("Below is a list of all Team Member profiles");
  DB.getEmployee().then((employee) => {
    printTable(employee);
    mainMenu();
  });
};

const newEmployee = async () => {
  const roles = await DB.viewRoles();
  const roleList = roles.map(({ id, title }) => ({
    name: title,
    value: id,
  }));

  const man = await DB.viewEmployees();
  const manList = man.map(({ id, first_name, last_name }) => ({
    name: `${first_name} ${last_name}`,
    value: id,
  }));
  manList.unshift({ name: "None", value: null });
  inquirer
    .prompt([
      {
        type: "input",
        name: "firstName",
        message: "Please enter the Team Member's first name",
      },
      {
        type: "input",
        name: "lastName",
        message: "Please enter the Team Member's last name",
      },
      {
        type: "list",
        name: "roleId",
        message: "Please select the Team Member's position",
        choices: roleList,
      },
      {
        type: "list",
        name: "manId",
        message: "Please enter the Team Member's manager",
        choices: manList,
      },
    ])
    .then((answers) => {
      DB.addEmployee(
        answers.firstName,
        answers.lastName,
        answers.roleId,
        answers.manId
      ).then((res) => {
        allEmployees();
      });
    });
};

const updateManager = async () => {
  const emp = await DB.viewEmployees();
  const empList = emp.map(({ id, first_name, last_name }) => ({
    name: `${first_name} ${last_name}`,
    value: id,
  }));
  const man = await DB.viewEmployees();
  const manList = man.map(({ id, first_name, last_name }) => ({
    name: `${first_name} ${last_name}`,
    value: id,
  }));
  manList.unshift({ name: "None", value: null });
  inquirer
    .prompt([
      {
        type: "list",
        name: "emplId",
        message: "Select the Team Member you would like to update",
        choices: empList,
      },
      {
        type: "list",
        name: "newMan",
        message: "Select the Team Member's new Manager",
        choices: manList,
      },
    ])
    .then((answers) => {
      DB.updateEmployeeManager(answers.newMan, answers.emplId).then((res) => {
        allEmployees();
      });
    });
};

const updateEmployee = async () => {
  const emp = await DB.viewEmployees();
  const empList = emp.map(({ id, first_name, last_name }) => ({
    name: `${first_name} ${last_name}`,
    value: id,
  }));
  const roles = await DB.viewRoles();
  const roleList = roles.map(({ id, title }) => ({
    name: title,
    value: id,
  }));
  inquirer
    .prompt([
      {
        type: "list",
        name: "updateEmp",
        message: "Select the Team Member you would like to update",
        choices: empList,
      },
      {
        type: "list",
        name: "newRole",
        message: "Select the Team Member's new Position",
        choices: roleList,
      },
    ])
    .then((answers) => {
      DB.updateEmployeeRole(answers.newRole, answers.updateEmp).then((res) => {
        allEmployees();
      });
    });
};

const emplByDept = async () => {
  const department = await DB.viewDepts();
  const deptList = department.map(({ id, dept_name }) => ({
    name: dept_name,
    value: id,
  }));
  inquirer
    .prompt([
      {
        type: "list",
        name: "deptId",
        message: "Please select the Company Department you would like to view",
        choices: deptList,
      },
    ])
    .then((answer) => {
      DB.viewEmployeesByDept(answer.deptId).then((department) => {
        printTable(department);
        mainMenu();
      });
    });
};

const removeEmployee = async () => {
  const emp = await DB.viewEmployees();
  const empList = emp.map(({ id, first_name, last_name }) => ({
    name: `${first_name} ${last_name}`,
    value: id,
  }));
  inquirer
    .prompt([
      {
        type: "list",
        name: "removeEmp",
        message: "Select the Team Member you would like to remove",
        choices: empList,
      },
    ])
    .then((answer) => {
      DB.deleteEmployee(answer.removeEmp).then((res) => {
        allEmployees();
      });
    });
};

function rolePrompt() {
  inquirer
    .prompt({
      type: "list",
      name: "roleMenu",
      message: "How would you like to proceed?",
      choices: [
        "View All Team Member Positions",
        "Add New Team Member Position",
        "Remove Team Member Position",
        "Exit to System Menu",
      ],
    })
    .then(function (answer) {
      switch (answer.roleMenu) {
        case "View All Team Member Positions":
          allRoles();
          break;
        case "Add New Team Member Position":
          newRole();
          break;
        case "Remove Team Member Position":
          verifyRemove();
          break;
        default:
          mainMenu();
      }
    });
}

const allRoles = () => {
  console.log("Here is a list of all Team Member positions");
  DB.getRole().then((role) => {
    printTable(role);
    mainMenu();
  });
};

const newRole = async () => {
  const department = await DB.viewDepts();
  const deptList = department.map(({ id, dept_name }) => ({
    name: dept_name,
    value: id,
  }));
  inquirer
    .prompt([
      {
        type: "input",
        name: "position",
        message: "What will be the title for this position?",
      },
      {
        type: "input",
        name: "salary",
        message: "What will be the desired salary for this position?",
      },
      {
        type: "list",
        name: "dept",
        message: "What department will this position be allocated to?",
        choices: deptList,
      },
    ])
    .then((answers) => {
      DB.addRole(answers.position, answers.salary, answers.dept).then((res) => {
        allRoles();
      });
    });
};

const verifyRemove = () => {
  inquirer
    .prompt({
      type: "list",
      name: "roleVerify",
      message:
        "Removing a position will also delete all Team Members assigned to it. Would you like to proceed?",
      choices: ["Yes", "No"],
    })
    .then(function (answer) {
      switch (answer.roleVerify) {
        case "Yes":
          removeRole();
          break;
        default:
          mainMenu();
      }
    });
};

const removeRole = async () => {
  const roles = await DB.viewRoles();
  const roleList = roles.map(({ id, title }) => ({
    name: title,
    value: id,
  }));
  inquirer
    .prompt([
      {
        type: "list",
        name: "delRole",
        message: "Which Team Member Position would you like to remove?",
        choices: roleList,
      },
    ])
    .then((answer) => {
      DB.deleteRole(answer.delRole).then((res) => {
        allRoles();
      });
    });
};

function deptPrompt() {
  inquirer
    .prompt({
      type: "list",
      name: "deptMenu",
      message: "How would you like to proceed?",
      choices: [
        "View All Company Departments",
        "Add New Company Department",
        "Remove Company Department",
        "Exit to System Menu",
      ],
    })
    .then(function (answer) {
      switch (answer.deptMenu) {
        case "View All Company Departments":
          allDepts();
          break;
        case "Add New Company Department":
          newDept();
          break;
        case "Remove Company Department":
          verifyDeptRemove();
          break;
        default:
          mainMenu();
      }
    });
}

const allDepts = () => {
  console.log("Below is a list of all departments within the Company");
  DB.getDepts().then((dept) => {
    printTable(dept);
    mainMenu();
  });
};

const newDept = () => {
  inquirer
    .prompt({
      type: "input",
      name: "newDept",
      message: "What will be the designated name of the new Company Department?",
    })
    .then((answer) => {
      DB.addDept(answer.newDept).then((res) => {
        allDepts();
      });
    });
};

const verifyDeptRemove = () => {
  inquirer
    .prompt({
      type: "list",
      name: "deptVerify",
      message:
        "Removing a Company Department will also delete all Team Member Profiles and Team Member Positions assigned to it.  Would you like to proceed?",
      choices: ["Yes", "No"],
    })
    .then(function (answer) {
      switch (answer.deptVerify) {
        case "Yes":
          removeDept();
          break;
        default:
          mainMenu();
      }
    });
};

const removeDept = async () => {
  const department = await DB.viewDepts();
  const deptList = department.map(({ id, dept_name }) => ({
    name: dept_name,
    value: id,
  }));
  inquirer
    .prompt([
      {
        type: "list",
        name: "delDept",
        message: "Which Company Department would you like to remove?",
        choices: deptList,
      },
    ])
    .then((answer) => {
      DB.deleteDept(answer.delDept).then((res) => {
        allDepts();
      });
    });
};

function theEnd() {
  console.log("Thank you for using the Enterprise Team Member Management System.");
  process.exit();
}

startProg();