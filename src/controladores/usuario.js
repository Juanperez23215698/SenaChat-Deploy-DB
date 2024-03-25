const conexion = require("./conexion");
const md5 = require("md5");
const nodeMailer = require("nodemailer");

exports.inicioSesion = (req, res) => {
  const { tipodoc, numerodoc, contrasena } = req.body;
  const query = 
  `SELECT uf.id_fichas, uf.numerodoc, u.fk_id_rol FROM usuarios u
  INNER JOIN usuarios_fichas uf ON u.numerodoc = uf.numerodoc
  WHERE uf.numerodoc = ? AND fk_id_tipodoc = ? AND contrasena = ?`;

  conexion.query(query, [numerodoc, tipodoc, md5(contrasena)], (error, resultado) => {
    if (error) return console.error(error.message);
    if (resultado.length > 0) {
      const { id_fichas, numerodoc, fk_id_rol } = resultado[0];
      res.json([id_fichas, numerodoc, fk_id_rol]);
    } else res.json("No existe registro");
  });
};

exports.enviarEmail = (req, res) => {
  let config = nodeMailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    auth: {
      user: "senachat82@gmail.com",
      pass: "ecxa lfnp ohid xzfn",
    },
  });

  const opciones = {
    from: "SENA CHAT",
    subject: "Bienvenido a Sena Chat",
    to: "johanandreyd@gmail.com",
    text: "Emmmmm pues si, funciona",
  };

  config.sendMail(opciones, (error, result) => {
    if (error) return res.json({ ok: false, msg: error });
    return res.json({
      ok: true,
      msg: result,
    });
  });
};

exports.registrarUsuario = (req, res) => {
  const usuario = req.body;
  usuario.fk_id_rol = "2";
  delete usuario?.confirmar;
  usuario.contrasena = md5(usuario.contrasena);

  // Realizar la inserción en la tabla 'usuarios'
  const queryUsuario = "INSERT INTO usuarios SET ?";
  conexion.query(queryUsuario, usuario, (errorUsuario, resultadoU) => {
    if (errorUsuario) {
      return console.error(errorUsuario.message);
    }

    // Realizar la inserción en la tabla 'usuarios_fichas'
    const queryUsuarioFichas = "INSERT INTO usuarios_fichas (id_fichas, numerodoc, principal) VALUES (?, ?, ?)";
    conexion.query(queryUsuarioFichas, ['0000000', usuario.numerodoc, 1], (errorUsuarioFichas, resultadoUF) => {
      if (errorUsuarioFichas) {
        return console.error(errorUsuarioFichas.message);
      } 
      
      // Ambas inserciones fueron exitosas
      res.json(["Se inserto correctamente el usuario", usuario.numerodoc]);
    });
  });
};

exports.bienvenidaUsuario = (req, res) => {
  const numerodoc = req.params.documento;
  const ficha = req.body.buscar;

  const query = `UPDATE usuarios SET fk_id_ficha = ${ficha} WHERE numerodoc = ${numerodoc}`;
  conexion.query(query, (error, resultado) => {
    if (error) return console.error(error.message);
    console.log();
    res.json([ficha, numerodoc]);
  });
};

exports.obtenerDatosUsuario = (req, res) => {
  const numerodoc = req.params.numerodoc;
  const query = `SELECT * from USUARIOS u INNER JOIN usuarios_fichas f 
                    ON u.numerodoc = f.numerodoc WHERE u.numerodoc = ?`;
  conexion.query(query, numerodoc, (error, resultado) => {
    if (error) return console.error(error.message);
    res.json(resultado[0]);
  });
};

exports.configurarUsuario = (req, res) => {
  const { documento } = req.params;
  const nuevosDatos = req.body;
  nuevosDatos['u.numerodoc'] = nuevosDatos.numerodoc;
  delete nuevosDatos.numerodoc;

  const query = `UPDATE usuarios_fichas f INNER JOIN usuarios u ON
    u.numerodoc = f.numerodoc SET ? WHERE u.numerodoc = ?`;
  conexion.query(query, [nuevosDatos, documento], (error, resultado) => {
    if (error) return console.error(error.message);
    if(resultado.affectedRows > 0) res.json("Actualizado");
  });
};
