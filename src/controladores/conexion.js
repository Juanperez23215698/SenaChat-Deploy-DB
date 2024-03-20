const mysql = require("mysql2");


const DB_HOST = process.env.DB_HOST || "localhost";
const DB_USER = process.env.DB_USER || "root";
const DB_PASSWORD = process.env.DB_PASSWORD || "";
const DB_DATABASE = process.env.DB_DATABASE || "sena_chat";
const DB_PORT = process.env.DB_PORT || 3306;

const conexion = mysql.createConnection({
  host: DB_HOST,
  database: DB_DATABASE,
  user: DB_USER,
  password: DB_PASSWORD,
  port: DB_PORT,
});




conexion.connect((error) => {
  if (error) throw error;
  console.log("Conectado a base de datos");
});

module.exports = conexion;

