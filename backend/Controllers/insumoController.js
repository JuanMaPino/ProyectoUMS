const Insumo = require('../Models/Insumo');

exports.getAllInsumos = async (req, res) => {
  try {
    const insumos = await Insumo.find();
    res.json(insumos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createInsumo = async (req, res) => {
  try {
    const nuevoInsumo = new Insumo(req.body);
    await nuevoInsumo.save();
    res.status(201).json(nuevoInsumo);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getInsumoById = async (req, res) => {
  try {
    const insumo = await Insumo.findById(req.params.id);
    if (!insumo) {
      return res.status(404).json({ error: 'Insumo no encontrado' });
    }
    res.json(insumo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateInsumo = async (req, res) => {
  try {
    const insumo = await Insumo.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!insumo) {
      return res.status(404).json({ error: 'Insumo no encontrado' });
    }
    res.json(insumo);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteInsumo = async (req, res) => {
  try {
    const insumo = await Insumo.findByIdAndDelete(req.params.id);
    if (!insumo) {
      return res.status(404).json({ error: 'Insumo no encontrado' });
    }
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.disableInsumo = async (req, res) => {
  try {
    const insumo = await Insumo.findById(req.params.id);
    if (!insumo) {
      return res.status(404).json({ error: 'Insumo no encontrado' });
    }
    insumo.estado = 'inactivo';
    await insumo.save();
    res.json(insumo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};