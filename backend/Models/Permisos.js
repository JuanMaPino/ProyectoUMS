const mongoose = require('mongoose');
const { Schema } = mongoose;

const permisoSchema = new Schema({
    nombre: {
    type: String,
    required: true
    }
})
module.exports = mongoose.model('Permisos', permisoSchema);