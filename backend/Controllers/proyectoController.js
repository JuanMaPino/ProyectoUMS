const Proyecto = require('../Models/Proyecto');

exports.obtenerTodosLosProyectos = async (req, res) => {
  try {
    const proyectos = await Proyecto.find().populate('tipo');
    res.json(proyectos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.crearProyecto = async (req, res) => {
  try {
    const nuevoProyecto = new Proyecto(req.body);
    await nuevoProyecto.save();
    // Realiza la población de tipo después de guardar para devolver el proyecto completo
    await nuevoProyecto.populate('tipo').execPopulate();
    res.status(201).json(nuevoProyecto);
  } catch (error) {
    if (error.code === 11000) {
      if (error.keyValue && error.keyValue.codigo) {
        return res.status(400).json({ error: 'Este código de proyecto ya está registrado.' });
      }
    }
    res.status(400).json({ error: error.message });
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
    res.status(500).json({ error: error.message });
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
    res.status(400).json({ error: error.message });
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
    res.status(500).json({ error: error.message });
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
    await proyecto.populate('tipo').execPopulate();
    res.json(proyecto);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.obtenerProyectoPorCodigo = async (req, res) => {
  try {
    const proyecto = await Proyecto.findOne({ codigo: req.params.codigo }).populate('tipo');
    if (!proyecto) {
      return res.status(404).json({ error: 'Proyecto no encontrado' });
    }
    res.json(proyecto);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
