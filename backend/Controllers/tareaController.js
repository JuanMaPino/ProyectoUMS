const Tarea = require('../Models/Tarea');

exports.obtenerTodasLasTareas = async (req, res) => {
  try {
    const tareas = await Tarea.find().populate('ayudantes', 'nombre rol');
    res.json(tareas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.crearTarea = async (req, res) => {
  try {
    const nuevaTarea = new Tarea(req.body);
    await nuevaTarea.save();
    res.status(201).json(nuevaTarea);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.obtenerTareaPorId = async (req, res) => {
  try {
    const tarea = await Tarea.findById(req.params.id).populate('ayudantes', 'nombre rol');
    if (!tarea) {
      return res.status(404).json({ error: 'Tarea no encontrada' });
    }
    res.json(tarea);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.actualizarTarea = async (req, res) => {
  try {
    const tarea = await Tarea.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('ayudantes', 'nombre rol');
    if (!tarea) {
      return res.status(404).json({ error: 'Tarea no encontrada' });
    }
    res.json(tarea);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.eliminarTarea = async (req, res) => {
  try {
    const tarea = await Tarea.findByIdAndDelete(req.params.id);
    if (!tarea) {
      return res.status(404).json({ error: 'Tarea no encontrada' });
    }
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.cambiarEstadoTarea = async (req, res) => {
  try {
    const tarea = await Tarea.findById(req.params.id);
    if (!tarea) {
      return res.status(404).json({ error: 'Tarea no encontrada' });
    }
    tarea.estado = tarea.estado === 'activo' ? 'inactivo' : 'activo';
    await tarea.save();
    res.json(tarea);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
