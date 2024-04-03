const mysql = require("mysql2");

const conexion = mysql.createPool({
  host: process.env.HOST || "localhost",
  database: process.env.DB || "sena_chat",
  user: process.env.USER || "root",
  password: process.env.PASSWORD || "root",
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = conexion.promise();
