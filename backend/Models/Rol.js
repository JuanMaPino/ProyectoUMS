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
  permisos: [{
    type: String, // Cambiado a un array de strings
    enum: ['donadores', 'donaciones', 'beneficiarios', 'ayudantes', 'tareas', 'proyectos', 'insumos', 'actividades'],
  }],
  estado: {
    type: String,
    enum: ['activo', 'inactivo'],
    default: 'activo',
  }
});

const Rol = mongoose.model('Rol', rolSchema);

module.exports = Rol;
