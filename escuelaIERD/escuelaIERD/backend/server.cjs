const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', require('./routes/authRoutes.cjs'));
app.use('/api/estudiantes', require('./routes/estudianteRoutes.cjs'));
app.use('/api/profesores', require('./routes/profesorRoutes.cjs'));
app.use('/api/pagos', require('./routes/pagoRoutes.cjs'));
app.use('/api/asistencias', require('./routes/asistenciaRoutes.cjs'));
app.use('/api/notas', require('./routes/notaRoutes.cjs'));

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Servidor funcionando correctamente' });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});