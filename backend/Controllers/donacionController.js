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
    const nuevaDonacion = await Donacion.create(req.body);
    res.status(201).json(nuevaDonacion);
  } catch (error) {
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

exports.eliminarDonacion = async (req, res) => {
  try {
    const donacion = await Donacion.findByIdAndDelete(req.params.id);
    if (!donacion) {
      return res.status(404).json({ error: 'Donacion no encontrada' });
    }
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
