const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  usuario: {type: String, required: true, unique: true, trim: true},
  email: {type: String, required: true, unique: true, trim: true},
  contraseña: {type: String, required: true, trim: true},
  tipo: {type: String, required: true, trim: true},
  active: {type: Boolean, default: true}
})

const Usuario = mongoose.model('Usuario', userSchema);

module.exports = Usuario;