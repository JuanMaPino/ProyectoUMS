const Actividad = require('../Models/Actividad');

exports.obtenerTodasLasActividades = async (req, res) => {
  try {
    const actividades = await Actividad.find();
    res.json(actividades);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.crearActividad = async (req, res) => {
  try {
    const nuevaActividad = new Actividad(req.body);
    await nuevaActividad.save();
    res.status(201).json(nuevaActividad);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.obtenerActividadPorId = async (req, res) => {
  try {
    const actividad = await Actividad.findById(req.params.id);
    if (!actividad) {
      return res.status(404).json({ error: 'Actividad no encontrada' });
    }
    res.json(actividad);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.actualizarActividad = async (req, res) => {
  try {
    const actividad = await Actividad.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!actividad) {
      return res.status(404).json({ error: 'Actividad no encontrada' });
    }
    res.json(actividad);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.eliminarActividad = async (req, res) => {
  try {
    const actividad = await Actividad.findByIdAndDelete(req.params.id);
    if (!actividad) {
      return res.status(404).json({ error: 'Actividad no encontrada' });
    }
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.cambiarEstadoActividad = async (req, res) => {
  try {
    const actividad = await Actividad.findById(req.params.id);
    if (!actividad) {
      return res.status(404).json({ error: 'Actividad no encontrada' });
    }
    actividad.estado = actividad.estado === 'activo' ? 'inactivo' : 'activo';
    await actividad.save();
    res.json(actividad);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.obtenerActividadPorNombre = async (req, res) => {
  try {
    const actividad = await Actividad.findOne({ nombre: req.params.nombre });
    if (!actividad) {
      return res.status(404).json({ error: 'Actividad no encontrada' });
    }
    res.json(actividad);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
