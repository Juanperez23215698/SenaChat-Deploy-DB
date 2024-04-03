const conexion = require("./conexion");
const md5 = require('md5');

exports.obtenerGrupos = (req, res) => {
  const query = 
  `SELECT g.*, COUNT(ug.numerodoc) AS num_usuarios FROM grupos g
  LEFT JOIN usuarios_grupos ug ON g.id_grupos = ug.id_grupos 
  WHERE g.fk_tipo_grupo = 2 GROUP BY g.id_grupos;`;

  conexion.query(query, (error, resultado) => {
    if (error) console.error(error.message);
    if (resultado.length > 0) res.json(resultado);
    else res.json("No hay grupos aun");
  });
};

exports.obtenerUsuarios = async (req, res) => {
  try {
    const query = `SELECT correo, primer_nom, segundo_nom, primer_apellido, segundo_apellido, u.numerodoc, 
      nombre_usuario, fk_id_tipodoc, id_fichas, foto, fk_id_rol, descripcion FROM usuarios u
      INNER JOIN usuarios_fichas uf ON u.numerodoc = uf.numerodoc WHERE uf.principal = 1;`;

    const [rows] = await conexion.execute(query);

    if (rows.length > 0) res.json(rows);
    else res.json("No hay usuarios aun");
    
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Error al obtener usuarios" });
  }
};

exports.obtenerMensajes = (req, res) => {
  const query = 
  `SELECT m.id_mensaje, m.fecha_hora, m.contenido_mensaje, ug.id_grupos AS destino,
  tm.Nom_tipo AS tipo_mensaje FROM mensaje m INNER JOIN tipo_mensaje tm ON m.id_tipo = tm.id_tipo
  LEFT JOIN usuarios_grupos ug ON m.fk_destino = ug.id_usuarios_grupos LEFT JOIN usuarios u 
  ON m.fk_destino = u.numerodoc OR ug.id_usuarios_grupos IS NULL ORDER BY m.id_mensaje DESC;`;

  conexion.query(query, (error, resultado) => {
    if (error) console.error(error.message);
    if (resultado.length > 0) res.json(resultado);
    else res.json("No hay mensajes aun");
  });
};

exports.obtenerFichas = (req, res) => {
  const query = 
  `SELECT f.*, COUNT(DISTINCT g.id_grupos) AS cantidad_grupos 
  FROM ficha f LEFT JOIN grupos g ON f.id_ficha = g.id_ficha 
  AND g.fk_tipo_grupo = 2 WHERE f.id_ficha <> '0000000' GROUP BY f.id_ficha;`;

  conexion.query(query, (error, resultado) => {
    if (error) console.error(error.message);
    if (resultado.length > 0) res.json(resultado);
    else res.json("No hay fichas aun");
  });
};

exports.obtenerProgramas = (req, res) => {
  const query = 
  ` SELECT * FROM programa_formacion; `;

  conexion.query(query, (error, resultado) => {
    if (error) console.error(error.message);
    if (resultado.length > 0) res.json(resultado);
    else res.json("No hay programas aun");
  });
};

exports.obtenerFichasId = (req, res) => {
  const query = 
  ` select id_ficha FROM ficha WHERE id_ficha <> '0000000'; `;

  conexion.query(query, (error, resultado) => {
    if (error) console.error(error.message);
    if (resultado.length > 0) res.json(resultado);
    else res.json("No hay fichas aun");
  });
};

exports.insertarFicha = (req, res) => {
  const ficha = req.body;
  const query = "INSERT INTO ficha SET ?;";
  conexion.query(query, ficha, (error, resultado) => {
    if (error) return console.error(error.message);
    if (resultado.affectedRows) res.json(ficha.id_ficha);
  });
};

exports.insertarGrupo = (req, res) => {
  const grupo = req.body;
  const query = "INSERT INTO grupos SET ?";
  conexion.query(query, grupo, (error, resultado) => {
    if (error) return console.error(error.message);
    res.json(resultado.insertId);
  });
};

exports.insertarMensaje = (req, res) => {
  const mensaje = req.body;
  const query = "INSERT INTO mensaje SET ?";
  conexion.query(query, mensaje, (error, resultado) => {
    if (error) return console.error(error.message);
    res.json(resultado.insertId);
  });
};

exports.insertarUsuario = (req, res) => {
  const usuario = req.body;
  usuario.contrasena = md5(usuario.contrasena);
  const usuarioFicha = usuario.id_fichas;
  delete usuario.id_fichas;
  const query = "INSERT INTO usuarios SET ?";
  conexion.query(query, usuario, (errorUsuario, resultadoU) => {
    if (errorUsuario) return console.error(errorUsuario.message);
    const queryUF = "INSERT INTO usuarios_fichas (id_fichas, numerodoc, principal) VALUES (?, ?, ?)";
    conexion.query(queryUF, [usuarioFicha, usuario.numerodoc, 1], (errorUsuarioFichas, resultadoUF) => {
      if (errorUsuarioFichas) return console.error(errorUsuarioFichas.message);
      res.json(["Se inserto correctamente el usuario", usuario.numerodoc]);
    });
  });
};
