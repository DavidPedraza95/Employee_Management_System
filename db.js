const connection = require("./connection");

class DB {
  constructor(connection) {
    this.connection = connection;
  }
  viewDepts() {
    return this.connection.query("SELECT * FROM departments;");
  }
  getDepts() {
    return this.connection.query(
      'SELECT departments.id AS "ID", departments.dept_name AS "Department" FROM departments'
    );
  }
  addDept(name) {
    return this.connection.query("INSERT INTO departments SET ?", {
      dept_name: name,
    });
  }
  deleteDept(delDept) {
    return this.connection.query("DELETE FROM departments WHERE id = ?", [
      delDept,
    ]);
  }
  viewRoles() {
    return this.connection.query("SELECT * FROM roles;");
  }
  getRole() {
    return this.connection.query(
      'SELECT roles.id AS "ID", roles.title AS "Title", roles.salary AS "Salary", roles.dept_id AS "Department ID" FROM roles;'
    );
  }
  addRole(title, salary, deptId) {
    return this.connection.query("INSERT INTO roles SET ?", {
      title: title,
      salary: salary,
      dept_id: deptId,
    });
  }
  deleteRole(delRole) {
    return this.connection.query("DELETE FROM roles WHERE id = ?", [delRole]);
  }
  viewEmployees() {
    return this.connection.query("SELECT * FROM employee;");
  }
  getEmployee() {
    return this.connection.query(
      'SELECT employee.id AS "ID", employee.first_name AS "First Name", employee.last_name AS "Last Name", roles.title AS "Title", departments.dept_name AS "Department", roles.salary AS "Salary", CONCAT(manager.first_name, " ", manager.last_name) AS "Manager" FROM employee LEFT JOIN roles on employee.role_id = roles.id LEFT JOIN departments on roles.dept_id = departments.id LEFT JOIN employee manager on manager.id = employee.man_id;'
    );
  }
  addEmployee(firstName, lastName, roleId, manId) {
    return this.connection.query("INSERT INTO employee SET ?", {
      first_name: firstName,
      last_name: lastName,
      role_id: roleId,
      man_id: manId,
    });
  }
  deleteEmployee(delEmployee) {
    return this.connection.query("DELETE FROM employee WHERE id = ?", [
      delEmployee,
    ]);
  }
  updateEmployeeRole(newRole, updateEmp) {
    return this.connection.query(
      "UPDATE employee SET role_id = ? WHERE id = ?",
      [newRole, updateEmp]
    );
  }
  updateEmployeeManager(newMan, emplId) {
    return this.connection.query(
      "UPDATE employee SET man_id = ? WHERE id = ?",
      [newMan, emplId]
    );
  }
  viewEmployeesByDept(deptId) {
    return this.connection.query(
      "SELECT departments.id AS 'ID', departments.dept_name AS 'Department', roles.title AS 'Title', employee.first_name AS 'First Name', employee.last_name AS 'Last Name' FROM employee LEFT JOIN roles on employee.role_id = roles.id LEFT JOIN departments on roles.dept_id = departments.id WHERE departments.id = ?",
      [deptId]
    );
  }
}

module.exports = new DB(connection);