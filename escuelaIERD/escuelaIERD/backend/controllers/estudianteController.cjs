const pool = require('../config/database.cjs');

// El campo logros se guarda como JSON (texto) en la BD, pero el frontend
// lo maneja como un arreglo (["asistencia", "tecnica", ...])
const parseLogros = (row) => {
  if (!row) return row;
  let logros = [];
  if (row.logros) {
    try {
      logros = JSON.parse(row.logros);
    } catch (e) {
      logros = [];
    }
  }
  return { ...row, logros };
};

const getEstudiantes = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM estudiantes ORDER BY nombre');
    res.json(rows.map(parseLogros));
  } catch (error) {
    console.error('Error en getEstudiantes:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
};

const getEstudianteById = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM estudiantes WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Estudiante no encontrado' });
    }
    res.json(parseLogros(rows[0]));
  } catch (error) {
    console.error('Error en getEstudianteById:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
};

const createEstudiante = async (req, res) => {
  try {
    const { nombre, documento, grupo, acudiente, estado, foto, logros } = req.body;

    // Validación temprana: si falta algo obligatorio, respondemos claro
    // en vez de dejar que la consulta reviente en la base de datos.
    if (!nombre || !documento || !grupo) {
      return res.status(400).json({ error: 'Nombre, documento y grupo son obligatorios' });
    }

    const logrosJson = logros ? JSON.stringify(logros) : null;

    const [result] = await pool.query(
      'INSERT INTO estudiantes (nombre, documento, grupo, acudiente, estado, foto, logros) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [nombre, documento, grupo, acudiente || null, estado || 'Activo', foto || null, logrosJson]
    );
    const [newEstudiante] = await pool.query('SELECT * FROM estudiantes WHERE id = ?', [result.insertId]);
    res.status(201).json(parseLogros(newEstudiante[0]));
  } catch (error) {
    console.error('Error en createEstudiante:', error);

    // Documento duplicado (ej. ya existe por auto-registro de un padre)
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'Ya existe un estudiante registrado con ese documento' });
    }

    // Falta una columna en la BD: normalmente significa migraciones pendientes
    if (error.code === 'ER_BAD_FIELD_ERROR') {
      return res.status(500).json({
        error: 'Faltan migraciones por aplicar en la base de datos. Corre "npx knex migrate:latest" en la carpeta backend.'
      });
    }

    // Valor de "grupo" no permitido para el ENUM actual de la BD
    if (error.code === 'WARN_DATA_TRUNCATED' || error.code === 'ER_TRUNCATED_WRONG_VALUE_FOR_FIELD') {
      return res.status(400).json({ error: 'El grupo enviado no es válido para la base de datos actual' });
    }

    // Algún campo excede el tamaño permitido en la BD
    if (error.code === 'ER_DATA_TOO_LONG') {
      return res.status(400).json({ error: 'Alguno de los campos enviados es demasiado largo' });
    }

    res.status(500).json({ error: 'Error del servidor' });
  }
};

const updateEstudiante = async (req, res) => {
  try {
    const { nombre, documento, grupo, acudiente, estado, foto, logros } = req.body;
    const logrosJson = logros !== undefined ? JSON.stringify(logros) : null;
    await pool.query(
      'UPDATE estudiantes SET nombre = ?, documento = ?, grupo = ?, acudiente = ?, estado = ?, foto = ?, logros = ? WHERE id = ?',
      [nombre, documento, grupo, acudiente || null, estado || 'Activo', foto || null, logrosJson, req.params.id]
    );
    const [updated] = await pool.query('SELECT * FROM estudiantes WHERE id = ?', [req.params.id]);
    res.json(parseLogros(updated[0]));
  } catch (error) {
    console.error('Error en updateEstudiante:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
};

const deleteEstudiante = async (req, res) => {
  try {
    await pool.query('DELETE FROM estudiantes WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (error) {
    console.error('Error en deleteEstudiante:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
};

module.exports = { getEstudiantes, getEstudianteById, createEstudiante, updateEstudiante, deleteEstudiante };