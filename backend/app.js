require('dotenv').config();
const express = require('express');
const connectDB = require('./Config/database');
const morgan = require('morgan');
const cors = require('cors');
const auth = require('./Routes/authRoutes');
const beneficiarioRoutes = require('./Routes/beneficiarioRoutes');
const ayudanteRoutes = require('./Routes/ayudanteRoutes');
const tareaRoutes = require('./Routes/tareaRoutes');
const donadorRoutes = require('./Routes/donadorRoutes');
const donacionRoutes = require('./Routes/donacionRoutes');
const proyectoRoutes = require('./Routes/proyectoRoutes');
const insumoRoutes = require('./Routes/insumoRoutes');
const rolRoutes = require('./Routes/rolRoutes')
const permisosRoutes = require('./Routes/permisosRoutes')


const app = express();
const PORT = process.env.PORT || 3002;
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

// app.use(cors({
//   origin: 'http://localhost:8081',
//   credentials: true
// }));

app.use(morgan('dev'));
app.use(express.json());

app.use('/auth', auth);
app.use('/beneficiarios', beneficiarioRoutes);
app.use('/ayudantes', ayudanteRoutes);
app.use('/tareas', tareaRoutes);
app.use('/donadores', donadorRoutes);
app.use('/donaciones', donacionRoutes);
app.use('/proyectos', proyectoRoutes);
app.use('/insumos', insumoRoutes)
app.use('/roles', rolRoutes)
app.use('/permisos', permisosRoutes)


connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
  });
}).catch(error => {
  console.error('Error de conexión a la base de datos:', error);
});