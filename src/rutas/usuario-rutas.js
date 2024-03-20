const express = require("express");
const router = express.Router();
const usuarioController = require("../controladores/usuario");

/**
 * @swagger
 * /usuario/login:
 *   post:
 *     summary: Iniciar sesión
 *     description: Iniciar sesión con tipo de documento, número de documento y contraseña
 *     tags: [Formulario]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tipodoc:
 *                 type: integer
 *               numerodoc:
 *                 type: string
 *               contrasena:
 *                 type: string
 *           example:
 *             tipodoc: 1
 *             numerodoc: "1131104356"
 *             contrasena: "123"
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: integer
 *               description: ID de la ficha, número de documento y ID del rol
 *       404:
 *         description: No existe registro
 */
router.post("/login", usuarioController.inicioSesion);
router.post("/autenticar", usuarioController.enviarEmail);
router.post("/registrar", usuarioController.registrarUsuario);
router.put("/bienvenida", usuarioController.bienvenidaUsuario);
router.get("/:numerodoc", usuarioController.obtenerDatosUsuario);
router.put("/configurar/:documento", usuarioController.configurarUsuario);

module.exports = router;