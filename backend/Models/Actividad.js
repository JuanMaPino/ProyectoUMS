const mongoose = require('mongoose');
const { Schema } = mongoose;

const actividadSchema = new Schema({

  nombre: {
    type: String,
    required: true,
  },
  fecha: {
    type: String,
    required: true,

  },
  tipo: {
    type: String,
    required: true,
    enum: ['Recreativa', 'Caritativa']
  },
  
  descripcion: {
    type: String,
    required: true,

  },

  tarea:[
    { type: mongoose.Schema.Types.ObjectId, ref: 'Tarea'}
  ]
  ,
  insumo:[
    { type: mongoose.Schema.Types.ObjectId, ref: 'Insumo'}
  ]
    ,
  estado: {
    type: String,
    enum: ['activo', 'inactivo'],
    default: 'activo'
  }
});

const Actividad = mongoose.model('Actividad', actividadSchema);

module.exports = Actividad;