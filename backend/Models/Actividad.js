const mongoose = require('mongoose');
const { Schema } = mongoose;

const actividadSchema = new Schema({
  nombre: {
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
  tareas: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'Tarea' }
  ],
  insumos: [
    { 
      insumo: { type: mongoose.Schema.Types.ObjectId, ref: 'Insumo' },
      cantidad: { type: Number, required: true }
    }
  ],
  estado: {
    type: String,
    enum: ['activo', 'inactivo'],
    default: 'activo'
  }
});

const Actividad = mongoose.model('Actividad', actividadSchema);

module.exports = Actividad;
