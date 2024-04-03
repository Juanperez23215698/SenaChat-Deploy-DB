const conexion = require("./conexion");
const md5 = require("md5");

exports.obtenerGrupos = async (req, res) => {
  try {
    const query = `SELECT g.*, COUNT(ug.numerodoc) AS num_usuarios FROM grupos g
      LEFT JOIN usuarios_grupos ug ON g.id_grupos = ug.id_grupos 
      WHERE g.fk_tipo_grupo = 2 AND ug.activo = TRUE GROUP BY g.id_grupos;`;

    const [rows] = await conexion.execute(query);

    if (rows.length > 0) res.json(rows);
    else {
      res.json("No hay grupos aun");
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Error al obtener grupos" });
  }
};

exports.obtenerUsuarios = async (req, res) => {
  try {
    const query = `SELECT correo, primer_nom, segundo_nom, primer_apellido, segundo_apellido, u.numerodoc, 
      nombre_usuario, fk_id_tipodoc, id_fichas, foto, fk_id_rol, descripcion FROM usuarios u
      INNER JOIN usuarios_fichas uf ON u.numerodoc = uf.numerodoc WHERE uf.principal = 1;`;

    const [rows] = await conexion.execute(query);

    if (rows.length > 0) res.json(rows);
    else {
      res.json("No hay usuarios aun");
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Error al obtener usuarios" });
  }
};

exports.obtenerMensajes = async (req, res) => {
  try {
    const query = `SELECT m.*, ug.id_grupos AS destino, tm.Nom_tipo AS tipo_mensaje 
      FROM mensaje m INNER JOIN tipo_mensaje tm ON m.id_tipo = tm.id_tipo
      LEFT JOIN usuarios_grupos ug ON m.fk_destino = ug.id_usuarios_grupos LEFT JOIN usuarios u 
      ON m.fk_destino = u.numerodoc OR ug.id_usuarios_grupos IS NULL ORDER BY m.id_mensaje DESC;`;

    const [rows] = await conexion.execute(query);

    if (rows.length > 0) res.json(rows);
    else {
      res.json("No hay mensajes aun");
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Error al obtener mensajes" });
  }
};

exports.obtenerFichas = async (req, res) => {
  try {
    const query = `SELECT f.*, COUNT(DISTINCT g.id_grupos) AS cantidad_grupos, p.nombre_programa FROM ficha f 
      LEFT JOIN grupos g ON f.id_ficha = g.id_ficha AND g.fk_tipo_grupo = 2 INNER JOIN programa_formacion p 
      ON f.fk_programa = p.id_programa WHERE f.id_ficha <> '0000000' GROUP BY f.id_ficha;`;

    const [rows] = await conexion.execute(query);

    if (rows.length > 0) res.json(rows);
    else {
      res.json("No hay fichas aun");
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Error al obtener fichas" });
  }
};

exports.obtenerProgramas = async (req, res) => {
  try {
    const query = ` SELECT * FROM programa_formacion;`;

    const [rows] = await conexion.execute(query);

    if (rows.length > 0) res.json(rows);
    else {
      res.json("No hay programas aun");
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Error al obtener programas" });
  }
};

exports.obtenerFichasId = async (req, res) => {
  try {
    const query = `SELECT id_ficha FROM ficha WHERE id_ficha <> '0000000';`;

    const [rows] = await conexion.execute(query);

    if (rows.length > 0) res.json(rows);
    else {
      res.json("No hay fichas aun");
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Error al obtener fichas" });
  }
};

exports.insertarFicha = async (req, res) => {
  try {
    const ficha = req.body;
    const query = `INSERT INTO ficha SET ?`;
    const [resultado] = await conexion.execute(query, ficha);

    if (resultado[0] && resultado[0].affectedRows) res.json(ficha.id_ficha);
    else {
      res.status(500).json({ error: "Error al insertar la ficha" });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Error al insertar la ficha" });
  }
};

exports.insertarGrupo = async (req, res) => {
  try {
    const grupo = req.body;
    const query = `INSERT INTO grupos SET ?`;
    const resultado = await conexion.execute(query, grupo);

    if (resultado[0] && resultado[0].affectedRows)
      res.json(resultado[0].insertId);
    else {
      res.status(500).json({ error: "Error al insertar el grupo" });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Error al insertar el grupo" });
  }
};

exports.insertarMensaje = async (req, res) => {
  try {
    const mensaje = req.body;
    const query = `INSERT INTO mensaje SET ?`;
    const resultado = await conexion.execute(query, mensaje);

    if (resultado[0] && resultado[0].affectedRows)
      res.json(resultado[0].insertId);
    else {
      res.status(500).json({ error: "Error al insertar el mensaje" });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Error al insertar el mensaje" });
  }
};

exports.insertarUsuario = async (req, res) => {
  try {
    const usuario = req.body;
    usuario.contrasena = md5(usuario.contrasena);
    const usuarioFicha = usuario.id_fichas;
    delete usuario.id_fichas;

    const queryUsuario = `INSERT INTO usuarios SET ?`;
    const resultadoUsuario = await conexion.execute(queryUsuario, usuario);

    const queryUF = `INSERT INTO usuarios_fichas (id_fichas, numerodoc, principal) VALUES (?, ?, ?)`;
    await conexion.execute(queryUF, [usuarioFicha, usuario.numerodoc, 1]);

    res.json(["Se insertó correctamente el usuario", usuario.numerodoc]);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Error al insertar el usuario" });
  }
};

exports.obtenerUnGrupo = async (req, res) => {
  try {
    const { id_grupo } = req.params;
    const query = `SELECT * FROM grupos WHERE fk_tipo_grupo = 2 AND id_grupos = ?`;
    const [rows] = await conexion.execute(query, id_grupo);

    if (rows.length > 0) res.json(rows[0]);
    else {
      res.json("No hay grupos aun");
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Error al obtener el grupo" });
  }
};

exports.obtenerUnUsuario = async (req, res) => {
  try {
    const { numerodoc } = req.params;
    const query = `SELECT correo, primer_nom, segundo_nom, primer_apellido, segundo_apellido, u.numerodoc, 
      fk_id_tipodoc, id_fichas, foto, fk_id_rol, u.nombre_usuario FROM usuarios u INNER JOIN usuarios_fichas uf
      ON u.numerodoc = uf.numerodoc WHERE u.numerodoc = ?;`;
    const [rows] = await conexion.execute(query, numerodoc);

    if (rows.length > 0) res.json(rows[0]);
    else {
      res.json("No hay usuarios aun");
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Error al obtener el usuario" });
  }
};

exports.obtenerUnMensaje = async (req, res) => {
  try {
    const { id_mensaje } = req.params;
    const query = `SELECT contenido_mensaje FROM mensaje WHERE id_mensaje = ?`;
    const [rows] = await conexion.execute(query, id_mensaje);

    if (rows.length > 0) res.json(rows[0]);
    else {
      res.json("No hay mensajes aun");
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Error al obtener el mensaje" });
  }
};

exports.obtenerUnaFicha = async (req, res) => {
  try {
    const { id_ficha } = req.params;
    const query = `SELECT * FROM ficha WHERE id_ficha <> "0000000" AND id_ficha = ?`;
    const [rows] = await conexion.execute(query, [id_ficha]);

    if (rows.length > 0) res.json(rows[0]);
    else {
      res.json("No hay fichas aun");
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Error al obtener la ficha" });
  }
};

exports.actualizarGrupo = async (req, res) => {
  try {
    const grupo = req.body;
    const { id_grupo } = req.params;
    const query = `UPDATE grupos SET ? WHERE id_grupos = ?`;
    const [resultado] = await conexion.execute(query, [grupo, id_grupo]);

    if (resultado.affectedRows) res.json(id_grupo);
    else {
      res.json("Grupo no actualizado");
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Error al actualizar el grupo" });
  }
};

exports.actualizarFicha = async (req, res) => {
  try {
    const { id_ficha } = req.params;
    const ficha = req.body;
    const query = `UPDATE ficha SET ? WHERE id_ficha = ?`;
    const [resultado] = await conexion.execute(query, [ficha, id_ficha]);

    if (resultado.affectedRows) res.json(id_ficha);
    else {
      res.json("Ficha no actualizada");
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Error al actualizar la ficha" });
  }
};

exports.actualizarMensaje = async (req, res) => {
  try {
    const { id_mensaje } = req.params;
    const mensaje = req.body;
    const query = `UPDATE mensaje SET ? WHERE id_mensaje = ?`;
    const [resultado] = await conexion.execute(query, [mensaje, id_mensaje]);

    if (resultado.affectedRows) res.json(id_mensaje);
    else {
      res.json("Mensaje no actualizado");
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Error al actualizar el mensaje" });
  }
};

exports.actualizarUsuario = async (req, res) => {
  try {
    const { numerodoc } = req.params;
    const usuario = req.body;
    usuario["u.numerodoc"] = usuario.numerodoc;
    delete usuario.numerodoc;

    const query = `UPDATE usuarios_fichas f INNER JOIN usuarios u ON
      u.numerodoc = f.numerodoc SET ? WHERE u.numerodoc = ?`;
    const [resultado] = await conexion.execute(query, [usuario, numerodoc]);

    if (resultado.affectedRows > 0) res.json(numerodoc);
    else {
      res.json("Usuario no actualizado");
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Error al actualizar el usuario" });
  }
};

exports.obtenerMiembros = async (req, res) => {
  try {
    const { id_grupo } = req.params;
    const query = `SELECT primer_nom, segundo_nom, primer_apellido, segundo_apellido, u.fk_id_rol,
          ug.numerodoc, foto, descripcion, ug.fecha_union, (SELECT COUNT(*) FROM mensaje m 
          WHERE m.fk_destino = ug.id_usuarios_grupos) AS num_mensajes, ug.id_usuarios_grupos
          FROM usuarios_grupos ug INNER JOIN usuarios u ON u.numerodoc = ug.numerodoc 
          WHERE ug.id_grupos = ? AND ug.activo = TRUE ORDER BY u.fk_id_rol`;

    const [rows] = await conexion.execute(query, id_grupo);

    if (rows.length > 0) res.json(rows);
    else {
      res.json("No hay miembros aun");
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Error al obtener los miembros del grupo" });
  }
};

exports.obtenerGruposDeFicha = async (req, res) => {
  try {
    const { id_ficha } = req.params;
    const query = `SELECT * FROM grupos WHERE fk_tipo_grupo = 2 AND id_ficha = ?`;
    const [rows] = await conexion.execute(query, id_ficha);

    if (rows.length > 0) res.json(rows);
    else {
      res.json("No hay grupos aun");
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Error al obtener los grupos de la ficha" });
  }
};

exports.obtenerDatosMensaje = async (req, res) => {
  try {
    const { id_mensaje } = req.params;
    const query = `SELECT u.primer_nom, u.primer_apellido, u.foto, g.nom_grupos, g.id_ficha, g.foto_grupo,
    u.numerodoc, u.segundo_apellido, u.segundo_nom, u.fk_id_tipodoc, g.fk_tipo_grupo, g.id_grupos 
    FROM mensaje m INNER JOIN usuarios_grupos ug ON m.fk_destino = ug.id_usuarios_grupos 
    INNER JOIN usuarios u ON ug.numerodoc = u.numerodoc INNER JOIN grupos g 
    ON ug.id_grupos = g.id_grupos WHERE id_mensaje = ?;`;

    const [rows] = await conexion.execute(query, id_mensaje);

    if (rows.length > 0) {
      const mensaje = rows[0];
      if (!mensaje.foto_grupo && mensaje.fk_tipo_grupo == 1) {
        const query2 = `SELECT u.foto, u.primer_nom, u.segundo_nom, u.primer_apellido, u.segundo_apellido 
          FROM usuarios_grupos ug INNER JOIN usuarios u ON u.numerodoc = ug.numerodoc INNER 
          JOIN grupos g ON g.id_grupos = ug.id_grupos WHERE u.numerodoc <> ? AND g.id_grupos = ?;`;

        const [rows2] = await conexion.execute(query2, [mensaje.numerodoc, mensaje.id_grupos]);

        if (rows2.length > 0) {
          mensaje.foto_grupo = rows2[0].foto;
          mensaje.nom_grupos = `${rows2[0].primer_nom} ${rows2[0].segundo_nom ?? ""} 
            ${rows2[0].primer_apellido} ${rows2[0].segundo_apellido ?? ""}`;
        }
      }
      res.json(mensaje);
    } else {
      res.json("El mensaje proporcionado NO existe");
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Error al obtener los datos del mensaje" });
  }
};

exports.eliminarMiembro = async (req, res) => {
  try {
    const datos = req.body;
    const { id_ug } = req.params;
    const query = `UPDATE usuarios_grupos SET ? WHERE id_usuarios_grupos = ?`;
    const [resultado] = await conexion.execute(query, [datos, id_ug]);

    if (resultado.affectedRows) res.json("Se eliminó correctamente");
    else {
      res.json("La relación de usuario y grupo no se afectó");
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Error al eliminar el miembro del grupo" });
  }
};