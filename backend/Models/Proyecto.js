// Models/Proyecto.js
const mongoose = require('mongoose');

const proyectoSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true
  },
  fechaInicio: {
    type: Date,
    required: true
  },
  fechaFin: {
    type: Date,
    required: true
  },
  tipo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Actividad',
    required: true // Si quieres que este campo sea obligatorio
  },
  descripcion: {
    type: String,
    required: true
  },
  direccion: {
    type: String,
    required: true
  },
  estado: {
    type: String,
    enum: ['activo', 'inactivo'],
    default: 'activo'
  }
});

module.exports = mongoose.model('Proyecto', proyectoSchema);
