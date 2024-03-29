const mysql = require("mysql2");

const conexion = mysql.createConnection({
  host: process.env.HOST || "localhost",
  database: process.env.DB || "sena_chat",
  user: process.env.USER || "root",
  password: process.env.PASSWORD || "",
  port: process.env.PORT || 3306,
});

conexion.connect((error) => {
  if (error) throw error;
  console.log("Conectado a base de datos");
});

module.exports = conexion;
