const mongoose = require('mongoose');

const actividadSchema = new mongoose.Schema({
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
  beneficiarios: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'Beneficiario' }
  ],
  estado: {
    type: String,
    enum: ['activo', 'inactivo'],
    default: 'activo'
  }
});

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
  actividades: [actividadSchema],  // Nesting actividadSchema directly within proyectoSchema
  direccion: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Proyecto', proyectoSchema);
