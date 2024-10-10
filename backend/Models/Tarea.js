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
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ayudante'
  },
  estado: {
    type: String,
    enum: ['activo', 'inactivo'],
    default: 'activo'
  }, 
  proceso: {
    type: String,
    enum: ['Creado','En proceso','Finalizado','Cancelado'],
    default: 'Creado'
  }
});

const Tarea = mongoose.model('Tarea', tareaSchema);

module.exports = Tarea;