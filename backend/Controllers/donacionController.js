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
    const { donacion, cantidad } = req.body;

    const nuevaDonacion = new Donacion(req.body);
    await nuevaDonacion.save();
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
    const { donacion, cantidad } = req.body;

    // Validar que donacion y cantidad sean arrays y tengan la misma longitud
    if (!Array.isArray(donacion) || !Array.isArray(cantidad)) {
      return res.status(400).json({ error: 'Donación y cantidad deben ser arrays.' });
    }
    if (donacion.length !== cantidad.length) {
      return res.status(400).json({ error: 'La longitud de donación y cantidad deben ser iguales.' });
    }

    const donacionActualizada = await Donacion.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!donacionActualizada) {
      return res.status(404).json({ error: 'Donación no encontrada' });
    }
    res.json(donacionActualizada);
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
      donacion.estado = 'anulada'; // Cambia el estado a 'anulada'
      await donacion.save();
      res.status(200).json(donacion);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};
