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
    min: [10000000, 'El documento debe tener mínimo 8 dígitos'],
    max: [9999999999, 'El documento debe ser máximo de 10 dígitos']
  },
  nombre: {
    type: String,
    required: true,
    match: [/^[a-zA-Z\s]+$/, 'El nombre solo debe contener letras']
  },
  telefono: {
    type: Number,
    required: true,
    min: [999999999, 'El teléfono debe tener 10 dígitos'],
    max: [9999999999, 'El teléfono no debe exceder los 10 dígitos']
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
    match: [/.+\@.+\..+/, 'Ingrese un correo electrónico válido']
  },
  institucion: {
    type: String,
    required: true
  },
  estado: {
    type: String,
    enum: ['activo', 'inactivo'],
    default: 'activo'
  },
  // Nuevo campo para almacenar las tareas asignadas
  tareasAsignadas: [{
    tarea: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Tarea'  // Referencia al modelo Tarea
    },
    horas: {
      type: Number,
      required: true,
      // min: [1, 'Debe asignar al menos 1 hora']
    },
    nombreTarea: {
      type: String, 
      require: true
    },
    proceso: { 
      type: String, 
      ref: 'Creada'
    }
  }]
});

const Ayudante = mongoose.model('Ayudante', ayudanteSchema);

module.exports = Ayudante;