const express = require('express');
const router = express.Router();
const adminController = require('../controladores/admin');

router.get("/grupos", adminController.obtenerGrupos);
router.get("/usuarios", adminController.obtenerUsuarios);
router.get("/mensajes", adminController.obtenerMensajes);
router.get("/fichas", adminController.obtenerFichas);
router.get("/programas", adminController.obtenerProgramas);
router.get("/num-fichas", adminController.obtenerFichasId);
router.post("/agregar-ficha", adminController.insertarFicha);
router.post("/agregar-grupo", adminController.insertarGrupo);
router.post("/agregar-mensaje", adminController.insertarMensaje);
router.post("/agregar-usuario", adminController.insertarUsuario);

module.exports = router;