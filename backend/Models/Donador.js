const mongoose = require('mongoose');
const { Schema } = mongoose;

const donadorSchema = new Schema({
  identificacion: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  contacto: {
    type: String,
    trim: true
  },
  tipoDonador: {
    type: String,
    required: true,
    enum: ['Empresa', 'Natural']
  },
  tipoDocumen: {
    type: String,
    required: true,
    enum: ['C.C', 'C.E', 'NIT']
  },
  telefono: {
    type: String,
    trim: true
  },
  direccion: {
    type: String,
    required: true,
    trim: true
  },
  correoElectronico: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  estado: {
    type: String,
    enum: ['activo', 'inactivo'],
    default: 'activo'
  }
});

const Donador = mongoose.model('Donador', donadorSchema);
module.exports = Donador;
