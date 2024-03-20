exports.handleChatMessage = (socket, message) => {
  console.log(`Nuevo mensaje: ${message}`);
  // Lógica para manejar el mensaje, enviar a otros usuarios, etc.
};

exports.handleUserJoin = (socket, username) => {
  console.log(`${username} se ha unido.`);
  // Lógica para manejar la entrada de un nuevo usuario
};

exports.handleUserDisconnect = (socket) => {
  console.log("Usuario desconectado.");
  socket.emit("test2");
  // Lógica para manejar la desconexión de un usuario
};

exports.joinRoom = (socket, room) => {
  socket.join(room);
  // socket.broadcast.to(room).emit('test2', 'ke si');
  // socket.emit(''); OPCIONAL EMITIR EVENTO
};

exports.leaveRoom = (socket, room) => {
  socket.leave(room);
  // socket.emit('test2'); OPCIONAL EMITIR EVENTO
  // socket.to(room).emit('test2', 'Me fui de la sala desde otra pestaña');
};

exports.emitMessage = (socket, datosEnvio) => {
  socket.to(datosEnvio.room).emit("recibeMensaje", datosEnvio);
};

exports.emitNotificacion = (socket, datos) => {
  socket.to(Number(datos.room)).emit("notificarMensaje", datos);
};
