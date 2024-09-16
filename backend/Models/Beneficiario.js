// Models/Beneficiario.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const beneficiarioSchema = new Schema({
  tipoDocumento: {
    type: String,
    enum: ['C.C', 'C.E', 'T.I'],
    required: true
  },
  identificacion: {
    type: Number,
    required: true,
    unique: true,
  },
  nombre: {
    type: String,
    required: true,
  },
  telefono: {
    type: Number, 
    required: true,
  },
  correoElectronico: {
    type: String,
    unique: true,
  },
  direccion: {
    type: String,
    required: true,
  },
  familiares: [{
    
    documento: {
        type: Number,
        required: true
    },
    nombre: {
        type: String,
        required: true
    },
    condicionEspecial: {
      type: String,
  },
    parentesco: {
      type: String,
      required: true
}
}]

  ,
    estado: {
    type: String,
    enum: ['activo', 'inactivo'],
    default: 'activo'
  }
});

const Beneficiario = mongoose.model('Beneficiario', beneficiarioSchema);

module.exports = Beneficiario;