const conexion = require("./conexion");
const md5 = require("md5");
const format = require("mysql2").format;

exports.obtenerGrupos = async (req, res) => {
  try {
    const query = `SELECT g.*, COUNT(CASE WHEN ug.activo = TRUE THEN ug.numerodoc END)
      AS num_usuarios FROM grupos g LEFT JOIN usuarios_grupos ug ON g.id_grupos = ug.id_grupos 
      WHERE g.fk_tipo_grupo = 2 GROUP BY g.id_grupos;`;

    const [ rows ] = await conexion.execute(query);

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

    const [ rows ] = await conexion.execute(query);

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

    const [ rows ] = await conexion.execute(query);

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

    const [ rows ] = await conexion.execute(query);

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

    const [ rows ] = await conexion.execute(query);

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

    const [ rows ] = await conexion.execute(query);

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
    const query = format(`INSERT INTO ficha SET ?`, ficha);
    const [ rows ] = await conexion.execute(query);

    if (rows.affectedRows) res.json(ficha.id_ficha);
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
    const query =  format(`INSERT INTO grupos SET ?`, grupo);
    const [ rows ] = await conexion.execute(query);

    if (rows.affectedRows) res.json(rows.insertId);
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
    const query = format(`INSERT INTO mensaje SET ?`, mensaje);
    const [ rows ] = await conexion.execute(query);

    if (rows.affectedRows) res.json(rows.insertId);
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

    const queryUsuario = format(`INSERT INTO usuarios SET ?`, usuario);
    const [ rows ] = await conexion.execute(queryUsuario);

    if (rows.affectedRows) {
      const queryUF = `INSERT INTO usuarios_fichas (id_fichas, numerodoc, principal) VALUES (?, ?, ?)`;
      const [ rows ] = await conexion.execute(queryUF, [usuarioFicha, usuario.numerodoc, 1]);
      if (rows.affectedRows) res.json(["Se insertó correctamente el usuario", usuario.numerodoc]);
    } else res.json("No se inserto al usuario");
    
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Error al insertar el usuario" });
  }
};

exports.obtenerUnGrupo = async (req, res) => {
  try {
    const { id_grupo } = req.params;
    const query = `SELECT * FROM grupos WHERE fk_tipo_grupo = 2 AND id_grupos = ?`;
    const [ rows ] = await conexion.execute(query, [id_grupo]);

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
    const [ rows ] = await conexion.execute(query, [numerodoc]);

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
    const [ rows ] = await conexion.execute(query, [id_mensaje]);

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
    const [ rows ] = await conexion.execute(query, [id_ficha]);

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
    const query = format(`UPDATE grupos SET ? WHERE id_grupos = ?`, [grupo, id_grupo]);
    const [ rows ] = await conexion.execute(query);

    if (rows.affectedRows) res.json(id_grupo);
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
    const query = format(`UPDATE ficha SET ? WHERE id_ficha = ?`, [ficha, id_ficha]);
    const [ rows ] = await conexion.execute(query);

    if (rows.affectedRows) res.json(id_ficha);
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
    const query = format(`UPDATE mensaje SET ? WHERE id_mensaje = ?`, [mensaje, id_mensaje]);
    const [ rows ] = await conexion.execute(query);

    if (rows.affectedRows) res.json(id_mensaje);
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

    const query = format(`UPDATE usuarios_fichas f INNER JOIN usuarios u ON
    u.numerodoc = f.numerodoc SET ? WHERE u.numerodoc = ?`, [usuario, numerodoc]);
    const [ rows ] = await conexion.execute(query);

    if (rows.affectedRows) res.json(numerodoc);
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

    const [ rows ] = await conexion.execute(query, [id_grupo]);

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
    const [ rows ] = await conexion.execute(query, [id_ficha]);

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

    const [ rows ] = await conexion.execute(query, [id_mensaje]);

    if (rows.length > 0) {
      const mensaje = rows[0];
      if (!mensaje.foto_grupo && mensaje.fk_tipo_grupo == 1) {
        const query2 = `SELECT u.foto, u.primer_nom, u.segundo_nom, u.primer_apellido, u.segundo_apellido 
          FROM usuarios_grupos ug INNER JOIN usuarios u ON u.numerodoc = ug.numerodoc INNER 
          JOIN grupos g ON g.id_grupos = ug.id_grupos WHERE u.numerodoc <> ? AND g.id_grupos = ?;`;

        const [ rows ] = await conexion.execute(query2, [mensaje.numerodoc, mensaje.id_grupos]);

        if (rows.length > 0) {
          mensaje.foto_grupo = rows[0].foto;
          mensaje.nom_grupos = `${rows[0].primer_nom} ${rows[0].segundo_nom ?? ""} 
            ${rows[0].primer_apellido} ${rows[0].segundo_apellido ?? ""}`;
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
    const query = format(`UPDATE usuarios_grupos SET ? WHERE id_usuarios_grupos = ?`, [datos, id_ug]);
    const [ rows ] = await conexion.execute(query);

    if (rows.affectedRows) res.json("Se eliminó correctamente");
    else {
      res.json("La relación de usuario y grupo no se afectó");
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Error al eliminar el miembro del grupo" });
  }
};

exports.obtenerMiembro = async (req, res) => {
  try {
    const { numerodoc, id_grupo } = req.params;
    const query = `SELECT id_usuarios_grupos FROM usuarios_grupos WHERE numerodoc = ? AND id_grupos = ?`;
    const [ rows ] = await conexion.execute(query, [numerodoc, id_grupo]);

    if (rows.length > 0) res.json(rows[0]);
    else res.json(false);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Error comprobando al miembro" });
  }
};

exports.agregarMiembro = async (req, res) => {
  try {
    const miembro = req.body;
    const query = format(`INSERT INTO usuarios_grupos SET ?`, miembro);
    const [ rows ] = await conexion.execute(query);

    if (rows.affectedRows) res.json(rows.insertId);
    else res.json("No se agrego el miembro");
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Error al agregar el miembro del grupo" });
  }
};

exports.miembrosFaltantes = async (req, res) => {
  const { id_ficha, rol, id_grupo } = req.body;
  try {
    const query = format(`SELECT primer_nom, segundo_nom, primer_apellido, 
    segundo_apellido, u.numerodoc, foto, fk_id_rol FROM usuarios u 
    INNER JOIN usuarios_fichas uf ON u.numerodoc = uf.numerodoc 
    INNER JOIN grupos g ON g.id_ficha = uf.id_fichas 
    LEFT JOIN usuarios_grupos ug ON u.numerodoc = ug.numerodoc AND g.id_grupos = ug.id_grupos
    WHERE uf.id_fichas = ? AND fk_id_rol = ? AND g.id_grupos = ?
    AND (ug.activo = FALSE OR ug.numerodoc IS NULL);`, [id_ficha, rol, id_grupo]);

    const [ rows ] = await conexion.execute(query);

    if (rows.length > 0) res.json(rows);
    else res.status(204).json("No hay contenido para mostrar");
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Error al seleccionar miembros faltantes" });
  }
};

exports.actualizarMiembro = async (req, res) => {
  try {
    const datos = req.body;
    const { id_ug } = req.params;
    const query = format(`UPDATE usuarios_grupos SET ? WHERE id_usuarios_grupos = ?`, [datos, id_ug]);
    const [ rows ] = await conexion.execute(query);

    if (rows.affectedRows) res.json(rows.insertId);
    else res.json("No se actualizo");
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Error al actualizar miembro" });
  }
};