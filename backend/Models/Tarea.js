const mongoose = require('mongoose');

const tareaSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true
  },
  accion: {
    type: String,
    required: true
  },
  cantidadHoras: {
    type: Number,
    required: true
  },
  ayudante: {
    type: mongoose.Schema.Types.ObjectId, // Referencia al modelo Ayudante
    ref: 'Ayudante'
  },
  Proceso: {
    type: String,
    enum: ['Creado', 'En proceso','Finalizado','Cancelado'],
    default: 'activo'
  },
  
});
//proceso tareas 

const Tarea = mongoose.model('Tarea', tareaSchema);

module.exports = Tarea;
