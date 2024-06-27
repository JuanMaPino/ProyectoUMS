const mongoose = require('mongoose');

const donacionSchema = new mongoose.Schema({
  fecha: {
    type: String,
    required: true,
    trim: true
  },
  tipo: {
    type: String,
    required: true,
    enum:['Monetaria','Material']
  },
  donaciones: [{ 
    nombre: { type: String, required: true, trim:true },
    cantidad: { type: String, required: true,trim:true }
  }],
  estado: {
    type: String,
    enum: ['activa', 'anulada'],
    default: 'activa'
  },
  donador: { type: mongoose.Schema.Types.ObjectId, ref: 'Donador'}
});

const Donacion= mongoose.model('Donacion', donacionSchema);

module.exports = Donacion;
