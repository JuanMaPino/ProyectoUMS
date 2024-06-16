const mongoose = require('mongoose');

const donacionSchema = new mongoose.Schema({
  documento:{
    type:Number,
    required:true
  },
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
  donador: {
    type: String,
    required: true
  }
});

const Donacion= mongoose.model('Donacion', donacionSchema);

module.exports = Donacion;
