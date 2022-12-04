var mysql = require("mysql");
var isLocal = false;
var con;
if (isLocal) {
  con = mysql.createConnection({
    host: "localhost",
    user: "root",
    port: "3306",
    password: "",
    database: "khethisab",
    multipleStatements: true,
    charset: "utf8mb4",
  });
} else {
  con = mysql.createConnection({
    host: "50.62.209.15",
    port: "3306",
    user: "nirav",
    password: "nirav.kumar90914",
    database: "ph11691450941_",
    multipleStatements: true,
    charset: "utf8mb4",
  });

  // con = mysql.createConnection({
  //   host: '216.10.252.35',
  //   port: '3306',
  //   user: 'keshauqj_keshauqj',
  //   password: 'UmangC~12!',
  //   database: 'keshauqj_khethisab',
  //   multipleStatements: true,
  //   charset: 'utf8mb4',
  // });
}

module.exports = con;
