
const Tarea = require('../Models/Tarea');

exports.obtenerTodasLasTareas = async (req, res) => {
  try {
    const tareas = await Tarea.find().populate('ayudante', 'nombre rol');
    res.json(tareas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.crearTarea = async (req, res) => {
  try {
    const { nombre, accion, cantidadHoras, estado, proceso } = req.body;
    
    if (!nombre || !accion || !cantidadHoras) {
      return res.status(400).json({ error: 'Nombre, acción y cantidad de horas son campos requeridos' });
    }

    const nuevaTarea = new Tarea({
      nombre,
      accion,
      cantidadHoras: parseInt(cantidadHoras, 10),
      estado: estado || 'activo',
      proceso: proceso || 'Creado'
    });

    await nuevaTarea.save();
    const tareaPoblada = await Tarea.findById(nuevaTarea._id).populate('ayudante', 'nombre rol');
    res.status(201).json(tareaPoblada);
  } catch (error) {
    console.error('Error al crear la tarea:', error);
    res.status(400).json({ error: error.message });
  }
};

exports.obtenerTareaPorId = async (req, res) => {
  try {
    const tarea = await Tarea.findById(req.params.id).populate('ayudante', 'nombre rol');
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
    const tarea = await Tarea.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate('ayudante', 'nombre rol');
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
    const tareaActualizada = await tarea.save();
    const tareaPoblada = await Tarea.findById(tareaActualizada._id).populate('ayudante', 'nombre rol');
    res.json(tareaPoblada);
  } catch (error) {
    console.error('Error al cambiar el estado de la tarea:', error);
    res.status(500).json({ error: 'Error interno del servidor', details: error.message });
  }
};
