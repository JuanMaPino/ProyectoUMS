// Models/Beneficiario.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const beneficiarioSchema = new Schema({
  tipoDocumento: {
    type: String,
    enum: ['C.C', 'T.I'],
    required: true
  },
  identificacion: {
    type: Number,
    required: true,
    unique: true,
    min: [10000000, 'el documento debe tener minimo 8 digitos'],
    max: [9999999999, 'el documento debe ser maximo de 10 digitos']
  },
  nombre: {
    type: String,
    required: true,
    match: [/^[a-zA-Z\s]+$/, 'El nombre solo debe contener letras']
  },
  telefono: {
    type: Number,
    required: true,
    min: [999999999, 'El telefono debe tener 10 digitos'],
    max: [9999999999, 'El telefono no debe exceder los 10 digitos']
  },
  correoElectronico: {
    type: String,
    unique: true,
    match: [/.+\@.+\..+/, 'Ingrese un correo electronico valido']
  },
  direccion: {
    type: String,
    required: true,
    minlength: [5, 'La dirección debe tener al menos 5 caracteres'],
    match: [/^[a-zA-Z0-9\s,.#-]+$/, 'La dirección solo puede contener letras, números, espacios y los caracteres , . - #']
  },
  cantidadFamiliares: {
    type: Number,
    required: true,
    min: [1, 'La cantidad de familiares debe ser al menos 1'],
    max: [10, 'La cantidad de familiares no puede exceder de 10']
  },
  estado: {
    type: String,
    enum: ['activo', 'inactivo'],
    default: 'activo'
  }
});

const Beneficiario = mongoose.model('Beneficiario', beneficiarioSchema);

module.exports = Beneficiario;
