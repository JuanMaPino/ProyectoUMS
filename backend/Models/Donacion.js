const mongoose = require('mongoose');

const donacionSchema = new mongoose.Schema({
  fecha: {
    type: String,
    required: true
  },
  tipo: {
    type: String,
    required: true,
    enum:['Monetaria','Material']
  },
  donacion: {
    type: String,
    required: true
  },
  cantidad: {
    type: Number,
    required: true
  },
  donador: { type: mongoose.Schema.Types.ObjectId, ref: 'Donador'}
});

const Donacion= mongoose.model('Donacion', donacionSchema);

module.exports = Donacion;
