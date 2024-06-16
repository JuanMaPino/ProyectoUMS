// Models/Proyecto.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const proyectoSchema = new Schema({
  codigo: {
    type: String,
    required: true,
    unique: true
  },
  nombre: {
    type: String,
    required: true
  },
  descripcion: {
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
  estado: {
    type: String,
    enum: ['activo', 'inactivo'],
    default: 'activo'
  }
});

const Proyecto = mongoose.model('Proyecto', proyectoSchema);

module.exports = Proyecto;
