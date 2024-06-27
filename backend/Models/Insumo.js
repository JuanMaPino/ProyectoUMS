// Models/Insumo.js

const mongoose = require('mongoose');

const insumoSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true
  },
  fecha: {
    type: Date,
    required: true
  },
  cantidad: {
    type: Number,
    default: 0
  }, 
  estado: {
    type: String,
    enum: ['activo', 'inactivo'],
    default: 'activo'
  }
});

module.exports = mongoose.model('Insumo', insumoSchema);