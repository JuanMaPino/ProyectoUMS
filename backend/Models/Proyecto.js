// Models/Proyecto.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const proyectoSchema = new Schema({
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
  tipo:
    { type: mongoose.Schema.Types.ObjectId, ref: 'Actividad'}
    ,
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

const Proyecto = mongoose.model('Proyecto', proyectoSchema);

module.exports = Proyecto;
