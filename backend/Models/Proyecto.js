// Models/Proyecto.js
const mongoose = require('mongoose');

const proyectoSchema = new mongoose.Schema({
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
  },
  tipo: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Actividad'
  }],
  direccion: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Proyecto', proyectoSchema);
