require('dotenv').config();
const express = require('express');
const connectDB = require('./Config/database');
const morgan = require('morgan');
const beneficiarioRoutes = require('./Routes/beneficiarioRoutes');
const ayudanteRoutes = require('./Routes/ayudanteRoutes');
const tareaRoutes = require('./Routes/tareaRoutes'); 
const donadorRoutes = require('./Routes/donadorRoutes');
const donacionRoutes = require('./Routes/donacionRoutes');
const proyectoRoutes = require('./Routes/proyectoRoutes');  

const app = express();
const PORT = process.env.PORT || 3002;
app.use(require('cors')());
app.use(morgan('dev'));
app.use(express.json());

app.use('/beneficiarios', beneficiarioRoutes);
app.use('/ayudantes', ayudanteRoutes);
app.use('/tareas', tareaRoutes);  
app.use('/donadores', donadorRoutes);
app.use('/donaciones', donacionRoutes);
app.use('/proyectos', proyectoRoutes);  

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
  });
}).catch(error => {
  console.error('Error de conexión a la base de datos:', error);
});