const mongoose = require('mongoose');
const { Schema } = mongoose;

const donadorSchema = new Schema({
  identificacion: {
    type: Number,
    required: true,
    unique: true
  },
  nombre: {
    type: String,
    required: true
  },
  tipoDonador: {
    type: String,
    required: true,
    enum:['Empresa','Natural']
  },
  tipoDocumen: {
    type: String,
    required: true,
    enum: ['C.C', 'NIT']
  },  
  Documento: {
    type: String,
    required: true
  },
  telefono: {
    type: Number
  },
  direccion: {
    type: String,
    required: true
  },
  correoElectronico: {
    type: String,
    required: true,
    unique: true
  },
  estado: {
    type: String,
    enum: ['activo', 'inactivo'],
    default: 'activo'
  }
});

const Donador = mongoose.model('Donador', donadorSchema);

module.exports = Donador;
