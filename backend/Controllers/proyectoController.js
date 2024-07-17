// Controllers/proyectoController.js
const Proyecto = require('../Models/Proyecto');

exports.obtenerTodosLosProyectos = async (req, res) => {
  try {
    const proyectos = await Proyecto.find().populate('tipo');
    res.json(proyectos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener todos los proyectos', details: error.message });
  }
};

exports.crearProyecto = async (req, res) => {
  try {
    const nuevoProyecto = new Proyecto(req.body);
    await nuevoProyecto.save();
    await nuevoProyecto.populate('tipo');
    res.status(201).json(nuevoProyecto);
  } catch (error) {
    res.status(400).json({ error: 'Error al crear proyecto', details: error.message });
  }
};

exports.obtenerProyectoPorId = async (req, res) => {
  try {
    const proyecto = await Proyecto.findById(req.params.id).populate('tipo');
    if (!proyecto) {
      return res.status(404).json({ error: 'Proyecto no encontrado' });
    }
    res.json(proyecto);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener proyecto por ID', details: error.message });
  }
};

exports.actualizarProyecto = async (req, res) => {
  try {
    const proyecto = await Proyecto.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('tipo');
    if (!proyecto) {
      return res.status(404).json({ error: 'Proyecto no encontrado' });
    }
    res.json(proyecto);
  } catch (error) {
    res.status(400).json({ error: 'Error al actualizar proyecto', details: error.message });
  }
};

exports.eliminarProyecto = async (req, res) => {
  try {
    const proyecto = await Proyecto.findByIdAndDelete(req.params.id);
    if (!proyecto) {
      return res.status(404).json({ error: 'Proyecto no encontrado' });
    }
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar proyecto', details: error.message });
  }
};

exports.cambiarEstadoProyecto = async (req, res) => {
  try {
    const proyecto = await Proyecto.findById(req.params.id);
    if (!proyecto) {
      return res.status(404).json({ error: 'Proyecto no encontrado' });
    }
    proyecto.estado = proyecto.estado === 'activo' ? 'inactivo' : 'activo';
    await proyecto.save();
    await proyecto.populate('tipo');
    res.json(proyecto);
  } catch (error) {
    res.status(500).json({ error: 'Error al cambiar estado del proyecto', details: error.message });
  }
};
