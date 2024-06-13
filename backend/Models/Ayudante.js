const mongoose = require('mongoose');
const { Schema } = mongoose;

const ayudanteSchema = new Schema({
  identificacion: {
    type: Number,
    required: true,
    unique: true
  },
  nombre: {
    type: String,
    required: true
  },
  telefono: {
    type: Number,
    required: true
  },
  rol: {
    type: String,
    required: true,
    enum: ['alfabetizador', 'voluntario']
  },
  direccion: {
    type: String,
    required: true
  },
  correoElectronico: {
    type: String,
    unique: true
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
