const Donacion = require('../Models/Donacion');


exports.obtenerTodasLasDonaciones = async (req, res) => {
  try {
    const donaciones = await Donacion.find();
    res.json(donaciones);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.crearDonacion = async (req, res) => {
  try {
    const nuevaDonacion = new Donacion(req.body);
    await nuevaDonacion.save();
    res.status(201).json(nuevaDonacion);
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

exports.obtenerDonacionPorId = async (req, res) => {
  try {
    const donacion = await Donacion.findById(req.params.id);
    if (!donacion) {
      return res.status(404).json({ error: 'Donacion no encontrado' });
    }
    res.json(donacion);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.actualizarDonacion = async (req, res) => {
  try {
    const donacion = await Donacion.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!donacion) {
      return res.status(404).json({ error: 'Donacion no encontrado' });
    }
    res.json(donacion);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.anularDonacion = async (req, res) => {
  try {
    const donacion = await Donacion.findById(req.params.id);
    if (!donacion) {
      return res.status(404).json({ error: 'Donación no encontrada' });
    }
    if (donacion.estado === 'anulada') {
      return res.status(400).json({ error: 'La donación ya está anulada' });
    }
    donacion.estado = 'anulada';
    await donacion.save();
    res.status(200).json(donacion);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
