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
  fecha: {
    type: String,
    required: true
  },
  estado: {
    type: String,
    enum: ['activo', 'inactivo'],
    default: 'activo'
  },
  ayudantes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Ayudante'}]
});

const Tarea= mongoose.model('Tarea', tareaSchema);

module.exports = Tarea;
