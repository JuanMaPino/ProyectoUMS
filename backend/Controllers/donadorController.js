const Donador = require('../Models/Donador');
const Donacion = require('../Models/Donacion');

exports.obtenerTodosLosDonadores = async (req, res) => {
  try {
    const donadores = await Donador.find();
    res.json(donadores);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.crearDonador = async (req, res) => {
  try {
    const nuevoDonador = new Donador(req.body);
    await nuevoDonador.save();
    res.status(201).json(nuevoDonador);
  } catch (error) {
    if (error.code === 11000) {
  
      if (error.keyValue && error.keyValue.identificacion) {
        return res.status(400).json({ error: 'Este documento ya está registrado.' });
      }
      if (error.keyValue && error.keyValue.correoElectronico) {
        return res.status(400).json({ error: 'Este correo electrónico ya está registrado.' });
      }
    }
    res.status(400).json({ error: error.message });
  }
};

exports.obtenerDonadorPorId = async (req, res) => {
  try {
    const donador = await Donador.findById(req.params.id);
    if (!donador) {
      return res.status(404).json({ error: 'Donador no encontrado' });
    }
    res.json(donador);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.actualizarDonador = async (req, res) => {
  try {
    const donador = await Donador.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!donador) {
      return res.status(404).json({ error: 'donador no encontrado' });
    }
    res.json(donador);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
exports.eliminarDonador = async (req, res) => {
  try {
    console.log(`Intentando eliminar donador con ID: ${req.params.id}`);
    // Verificar si el donador tiene donaciones
    const donacionesAsociadas = await Donacion.find({ donador: req.params.id });
    if (donacionesAsociadas.length > 0) {
      return res.status(400).json({ error: 'No se puede eliminar el donador porque tiene donaciones registradas.' });
    }else{
      return res.status(204).json({succes:"success"});
    }

    const donador = await Donador.findByIdAndDelete(req.params.id);
    if (!donador) {
      return res.status(404).json({ error: 'Donador no encontrado' });
    }
  } catch (error) {
    console.error(`Error al eliminar donador: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};

exports.cambiarEstadoDonador = async (req, res) => {
  try {
    const donador = await Donador.findById(req.params.id);
    if (!donador) {
      return res.status(404).json({ error: 'Donador no encontrado' });
    }
    donador.estado = donador.estado === 'activo' ? 'inactivo' : 'activo';
    await donador.save();
    res.json(donador);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.obtenerDonadorPorIdentificacion = async (req, res) => {
  try {
    const beneficiario = await Beneficiario.findOne({ identificacion: req.params.identificacion });
    if (!beneficiario) {
      return res.status(404).json({ error: 'donador no encontrado' });
    }
    res.json(beneficiario);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};