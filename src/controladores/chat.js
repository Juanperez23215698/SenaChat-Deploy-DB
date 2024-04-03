const conexion = require("./conexion");
const format = require("mysql2").format;

const selectGrupos = `ug.id_usuarios_grupos, 
g.id_grupos,
g.descripcion_grupos,
g.id_ficha,
g.fk_tipo_grupo,
ug.sin_leer,
COALESCE(subquery.fecha_reciente, '') as fecha_reciente,`;

const subconsultaGrupos = `( SELECT ug.id_grupos, COALESCE(MAX(m.fecha_hora), '') as fecha_reciente
FROM usuarios_grupos ug LEFT JOIN mensaje m 
ON m.fk_destino = ug.id_usuarios_grupos GROUP BY ug.id_grupos)`;

const subconsultaPrivados = `( SELECT ug.id_grupos, u.foto as foto_grupo, u.numerodoc as doc, u.nombre_usuario AS nom_grupos, 
COALESCE(MAX(m.fecha_hora), '') as fecha_reciente FROM usuarios_grupos ug INNER JOIN usuarios u 
ON u.numerodoc = ug.numerodoc LEFT JOIN mensaje m ON m.fk_destino = ug.id_usuarios_grupos 
WHERE u.numerodoc <> ? GROUP BY ug.id_grupos, u.foto, u.numerodoc, u.nombre_usuario)`;

exports.obtenerGrupos = async (req, res) => {
  try {
    const numerodoc = req.params.usuario;
    const query = `SELECT ${selectGrupos} g.nom_grupos, g.foto_grupo FROM grupos g
                    LEFT JOIN ${subconsultaGrupos} subquery ON g.id_grupos = subquery.id_grupos
                    LEFT JOIN usuarios_grupos ug ON g.id_grupos = ug.id_grupos
                    WHERE numerodoc = ? AND fk_tipo_grupo <> 1 AND ug.activo = TRUE
                    ORDER BY fecha_reciente DESC`;

    const [rows] = await conexion.execute(query, [numerodoc]);

    if (rows.length > 0) res.json(rows);
    else {
      res.json("No hay grupos aun");
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Error al obtener los grupos" });
  }
};

exports.obtenerMiembros = async (req, res) => {
  try {
    const grupo = req.params.grupo;
    const query = `SELECT primer_nom, segundo_nom, primer_apellido, segundo_apellido, ug.numerodoc, 
            u.fk_id_rol, foto, descripcion FROM usuarios_grupos ug INNER JOIN usuarios u 
            ON u.numerodoc = ug.numerodoc WHERE ug.id_grupos = ? AND ug.activo = TRUE ORDER BY u.fk_id_rol`;

    const [rows] = await conexion.execute(query, [grupo]);

    if (rows.length > 0) res.json(rows);
    else {
      res.json("No hay miembros aun");
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Error al obtener los miembros del grupo" });
  }
};

exports.obtenerInformacion = async (req, res) => {
  try {
    const grupo = req.params.grupo;
    const query = `SELECT nom_grupos, descripcion_grupos FROM grupos WHERE id_grupos = ?`;

    const [rows] = await conexion.execute(query, [grupo]);

    if (rows.length > 0) res.json(rows);
    else {
      res.json("No hay información sobre el grupo");
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Error al obtener la información del grupo" });
  }
};

exports.obtenerMensajes = async (req, res) => {
  try {
    const grupo = req.params.grupo;
    const query = `SELECT id_mensaje, primer_nom, primer_apellido, fecha_hora, contenido_mensaje, id_tipo, u.numerodoc 
            FROM usuarios_grupos ug
            INNER JOIN grupos g ON ug.id_grupos = g.id_grupos 
            INNER JOIN usuarios u ON u.numerodoc = ug.numerodoc
            INNER JOIN mensaje m ON m.fk_destino = ug.id_usuarios_grupos
            WHERE ug.id_grupos = ? ORDER BY id_mensaje`;

    const [rows] = await conexion.execute(query, [grupo]);

    if (rows.length > 0) res.json(rows);
    else {
      res.json(false);
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Error al obtener los mensajes del grupo" });
  }
};

exports.obtenerDestino = async (req, res) => {
  try {
    const { usuario, grupo } = req.params;
    const query = `SELECT id_usuarios_grupos FROM usuarios_grupos WHERE id_grupos = ? AND numerodoc = ?`;

    const [rows] = await conexion.execute(query, [grupo, usuario]);

    if (rows.length > 0) res.json(rows[0].id_usuarios_grupos);
    else {
      res.json("Falla en consulta");
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Error al obtener el destino del mensaje" });
  }
};

exports.insertarMensaje = async (req, res) => {
  try {
    const mensaje = req.body;
    const query = format(`INSERT INTO mensaje SET ?`, mensaje);
    const [rows] = await conexion.execute(query);
    
    if (rows.affectedRows) res.json(rows.insertId);
    else res.json('No se inserto el mensaje');
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Error al insertar el mensaje" });
  }
};

exports.obtenerPrivados = async (req, res) => {
  try {
    const numerodoc = req.params.documento;
    const query = `SELECT ${selectGrupos} subquery.foto_grupo, subquery.nom_grupos, subquery.doc 
                    FROM grupos g LEFT JOIN ${subconsultaPrivados} subquery ON g.id_grupos = subquery.id_grupos
                    LEFT JOIN usuarios_grupos ug ON g.id_grupos = ug.id_grupos
                    WHERE numerodoc = ? AND fk_tipo_grupo <> 2 ORDER BY fecha_reciente DESC`;

    const [rows] = await conexion.execute(query, [numerodoc, numerodoc]);

    if (rows.length > 0) res.json(rows);
    else {
      res.json("No hay grupos privados aun");
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Error al obtener los grupos privados" });
  }
};

exports.actualizarSinLeer = async (req, res) => {
  try {
    const { u: numerodoc, g: id_grupos } = req.body;
    const query = `UPDATE usuarios_grupos
                    SET sin_leer = COALESCE(sin_leer, 0) + 1
                    WHERE numerodoc <> ? AND id_grupos = ?`;

    const [result] = await conexion.execute(query, [numerodoc, id_grupos]);

    if (result.affectedRows != 0) res.json(result.affectedRows);
    else {
      res.json("Caso en que no notifica");
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Error al actualizar los mensajes sin leer" });
  }
};

exports.reiniciarSinLeer = async (req, res) => {
  try {
    const { u: numerodoc, g: id_grupos } = req.body;
    const query = `UPDATE usuarios_grupos SET sin_leer = NULL
                    WHERE numerodoc = ? AND id_grupos = ?`;

    const [result] = await conexion.execute(query, [numerodoc, id_grupos]);

    if (result.affectedRows != 0) res.json(result.affectedRows);
    else {
      res.json("Caso en que no notifica");
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Error al reiniciar los mensajes sin leer" });
  }
};

exports.subirImagen = (req, res) => {
  const file = req.file;
  if (!file) res.json("No hay archivos");
  res.json(file.filename);
};