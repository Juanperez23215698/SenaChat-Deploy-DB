const conexion = require("./conexion");
const md5 = require("md5");
const nodeMailer = require("nodemailer");

exports.inicioSesion = async (req, res) => {
  try {
    const { tipodoc, numerodoc, contrasena } = req.body;
    const query = `SELECT uf.id_fichas, uf.numerodoc, u.fk_id_rol FROM usuarios u
      INNER JOIN usuarios_fichas uf ON u.numerodoc = uf.numerodoc
      WHERE uf.numerodoc = ? AND fk_id_tipodoc = ? AND contrasena = ?`;

    const [rows] = await conexion.execute(query, [numerodoc, tipodoc, md5(contrasena)]);

    if (rows.length > 0) {
      const { id_fichas, numerodoc, fk_id_rol } = rows[0];
      res.json([id_fichas, numerodoc, fk_id_rol]);
    } else {
      res.json("No existe registro");
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Error al iniciar sesión" });
  }
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

exports.registrarUsuario = async (req, res) => {
  try {
    const usuario = req.body;
    usuario.fk_id_rol = "2";
    delete usuario?.confirmar;
    usuario.contrasena = md5(usuario.contrasena);

    const queryUsuario = `INSERT INTO usuarios SET ?`;
    const resultadoUsuario = await conexion.execute(queryUsuario, usuario);

    const queryUsuarioFichas = `INSERT INTO usuarios_fichas (id_fichas, numerodoc, principal) VALUES (?, ?, ?)`;
    const resultadoUsuarioFichas = await conexion.execute(queryUsuarioFichas, ["0000000", usuario.numerodoc, 1]);

    res.json(["Se insertó correctamente el usuario", usuario.numerodoc]);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Error al registrar usuario" });
  }
};

exports.bienvenidaUsuario = async (req, res) => {
  try {
    const numerodoc = req.params.documento;
    const ficha = req.body.buscar;

    const query = `UPDATE usuarios SET fk_id_ficha = ? WHERE numerodoc = ?`;
    await conexion.execute(query, [ficha, numerodoc]);

    res.json([ficha, numerodoc]);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Error al dar la bienvenida al usuario" });
  }
};

exports.obtenerDatosUsuario = async (req, res) => {
  try {
    const numerodoc = req.params.numerodoc;
    const query = `SELECT * FROM usuarios u INNER JOIN usuarios_fichas f 
      ON u.numerodoc = f.numerodoc WHERE u.numerodoc = ?`;
    const [rows] = await conexion.execute(query, numerodoc);

    if (rows.length > 0) res.json(rows[0]);
    else {
      res.json("Usuario no encontrado");
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Error al obtener datos del usuario" });
  }
};

exports.configurarUsuario = async (req, res) => {
  try {
    const { documento } = req.params;
    const nuevosDatos = req.body;
    
    nuevosDatos["u.numerodoc"] = nuevosDatos.numerodoc;
    delete nuevosDatos.numerodoc;

    const query = `UPDATE usuarios_fichas f INNER JOIN usuarios u ON
      u.numerodoc = f.numerodoc SET ? WHERE u.numerodoc = ?`;
    const [resultado] = await conexion.execute(query, [nuevosDatos, documento]);

    if (resultado.affectedRows > 0) res.json("Actualizado");
    else {
      res.json("Usuario no encontrado");
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Error al configurar usuario" });
  }
};