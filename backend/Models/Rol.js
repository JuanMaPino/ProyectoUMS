const mongoose = require('mongoose');
const { Schema } = mongoose;

const rolSchema = new Schema({
  nombre: {
    type: String,
    required: true,
  },
  descripcion: {
    type: String,
  },
  permisos: [
  { type: mongoose.Schema.Types.ObjectId, ref: 'Permisos'}
  ],
  estado: {
    type: String,
    enum: ['activo', 'inactivo'],
    default: 'activo',
  }
});

const Rol = mongoose.model('Rol', rolSchema);

module.exports = Rol;
