const mongoose = require('mongoose');
const { Schema } = mongoose;

const ayudanteSchema = new Schema({
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
  rol: {
    type: String,
    required: true,
    enum: ['alfabetizador', 'voluntario']
  },
  direccion: {
    type: String,
    required: true,
    minlength: [5, 'La dirección debe tener al menos 5 caracteres'],
    match: [/^[a-zA-Z0-9\s,.#-]+$/, 'La dirección solo puede contener letras, números, espacios y los caracteres , . - #']
  },
  correoElectronico: {
    type: String,
    unique: true,
    match: [/.+\@.+\..+/, 'Ingrese un correo electronico valido']
  },
  institucion: {
    type: String,
    required: true
  },
  estado: {
    type: String,
    enum: ['activo', 'inactivo'],
    default: 'activo'
  }
});

const Ayudante = mongoose.model('Ayudante', ayudanteSchema);

module.exports = Ayudante;
