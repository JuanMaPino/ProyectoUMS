const Tarea = require('../Models/Tarea');

// Obtener todas las tareas
exports.obtenerTodasLasTareas = async (req, res) => {
  try {
    const tareas = await Tarea.find();  // Eliminado .populate('ayudantes')
    res.json(tareas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Crear una nueva tarea
exports.crearTarea = async (req, res) => {
  try {
    const nuevaTarea = new Tarea(req.body);  // Asegúrate de que ayudantes no está en el req.body
    await nuevaTarea.save();
    res.status(201).json(nuevaTarea);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Obtener tarea por ID
exports.obtenerTareaPorId = async (req, res) => {
  try {
    const tarea = await Tarea.findById(req.params.id);  // Eliminado .populate('ayudantes')
    if (!tarea) {
      return res.status(404).json({ error: 'Tarea no encontrada' });
    }
    res.json(tarea);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar tarea por ID
exports.actualizarTarea = async (req, res) => {
  try {
    const tarea = await Tarea.findByIdAndUpdate(req.params.id, req.body, { new: true });  // Eliminado .populate('ayudantes')
    if (!tarea) {
      return res.status(404).json({ error: 'Tarea no encontrada' });
    }
    res.json(tarea);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Eliminar tarea por ID
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

// Cambiar estado de la tarea (activo/inactivo)
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
