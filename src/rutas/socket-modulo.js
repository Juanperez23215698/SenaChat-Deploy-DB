const socketFunctions = require("../controladores/socket-funciones");

const exportarSocket = (http) => {
  const io = require("socket.io")(http, {
    cors: {
      origin: true,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    socket.on("disponible", (room) => socketFunctions.joinRoom(socket, room));
    socket.on("notificar", (datos) => socketFunctions.emitNotificacion(socket, datos));
  });

  io.of("/online").on("connection", (socket) => {
    socket.on("unirSala", (room) => socketFunctions.joinRoom(socket, room));
    socket.on("salirSala", (room) => socketFunctions.leaveRoom(socket, room));
    socket.on("enviarMensaje", (datos) =>
      socketFunctions.emitMessage(socket, datos)
    );
  });

  io.of("/").adapter.on("create-room", (room) => {
    // console.log(`room ${room} was created`);
  });

  io.of("/").adapter.on("join-room", (room, id) => {
    // console.log(`socket ${id} has joined room ${room}`);
  });

  io.of("/").adapter.on("leave-room", (room, id) => {
    // console.log(`Socket ${id} has left room ${room}`);
  });

  return io;
};

module.exports = exportarSocket;
