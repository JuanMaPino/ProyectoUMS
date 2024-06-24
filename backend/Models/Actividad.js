const mongoose = require('mongoose');
const { Schema } = mongoose;

const actividadSchema = new Schema({
  id_actividad: {
    type: Number,
    required: true
  },
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

  tarea: {
    type: String,
    required: true,
    
  },
  insumo: {
    type: String,
    required: true,
   
  },
  estado: {
    type: String,
    enum: ['activo', 'inactivo'],
    default: 'activo'
  }
});

const Actividad = mongoose.model('Actividad', actividadSchema);

module.exports = Actividad;