const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const http = require("http").Server(app);
const webSocket = require("./src/rutas/socket-modulo");

webSocket(http);

const Rutas = {
  admin: require("./src/rutas/admin-rutas"),
  chat: require("./src/rutas/chat-rutas"),
  usuario: require("./src/rutas/usuario-rutas"),
};

const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Express API para Sena Chat",
    version: "1.0.0",
    description: "Esta es una API REST para Sena Chat",
  },
  servers: [
    {
      url: "http://localhost:3000",
      description: "Servidor local",
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: [
    path.join(__dirname, "./index.js"),
    path.join(__dirname, "./src/rutas/usuario-rutas.js"),
  ],
};

const swaggerSpec = swaggerJsDoc(options);

app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "*");
  next();
});

app.use(cors());
app.use(bodyParser.json());

app.use("/usuario", Rutas.usuario);
app.use("/chat", Rutas.chat);
app.use("/admin", Rutas.admin);

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));
app.use("imagenes", express.static(path.join(__dirname, 'imagenes')));

const puerto = process.env.PUERTO || 3000;
http.listen(puerto, () => {
  console.log("Usando el puerto: " + puerto);
});

app.get("/", (req, res) => {
  res.send("funciona API");
});
