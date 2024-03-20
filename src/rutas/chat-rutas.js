const express = require("express");
const router = express.Router();
const chatController = require("../controladores/chat");
const multerUpload = require('../controladores/multer');

router.get("/grupos/:ficha/:usuario", chatController.obtenerGrupos);
router.get("/miembros/:grupo", chatController.obtenerMiembros);
router.get("/informacion/:grupo", chatController.obtenerInformacion);
router.get("/mensajes/:grupo", chatController.obtenerMensajes);
router.get("/destino/:grupo/:usuario", chatController.obtenerDestino);
router.post("/mensaje", chatController.insertarMensaje);
router.post("/subir-imagen", multerUpload.single('file'), chatController.subirImagen);
router.get("/privados/:ficha/:documento", chatController.obtenerPrivados);
router.put("/aumentar/notificaciones", chatController.actualizarSinLeer);
router.put("/anular/notificaciones", chatController.reiniciarSinLeer);

module.exports = router;