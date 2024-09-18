const Tarea = require('../Models/Tarea');

// Obtener todas las tareas
exports.obtenerTodasLasTareas = async (req, res) => {
  try {
    const tareas = await Tarea.find().populate('ayudante', 'nombre rol'); // Aquí añadimos populate para los ayudantes
    res.json(tareas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Crear una nueva tarea
exports.crearTarea = async (req, res) => {
  try {
    const nuevaTarea = new Tarea(req.body);  // Asegúrate de que ayudante está en el req.body si es necesario
    await nuevaTarea.save();
    const tareaPoblada = await Tarea.findById(nuevaTarea._id).populate('ayudante', 'nombre rol'); // Populate después de guardar
    res.status(201).json(tareaPoblada);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Obtener tarea por ID
exports.obtenerTareaPorId = async (req, res) => {
  try {
    const tarea = await Tarea.findById(req.params.id).populate('ayudante', 'nombre rol'); // Populate el ayudante
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
    const tarea = await Tarea.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate('ayudante', 'nombre rol'); // Populate en la actualización también
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
    const tarea = await Tarea.findById(req.params.id).populate('ayudante', 'nombre rol'); // Populate en el cambio de estado también
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
