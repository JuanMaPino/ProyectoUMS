const Proyecto = require('../Models/Proyecto');

exports.obtenerTodosLosProyectos = async (req, res) => {
  try {
    const proyectos = await Proyecto.find();
    res.json(proyectos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener todos los proyectos', details: error.message });
  }
};

exports.crearProyecto = async (req, res) => {
  const { nombre, descripcion } = req.body;

  if (!nombre || !descripcion) {
    return res.status(400).json({ error: 'El nombre y la descripción son obligatorios.' });
  }

  try {
    const nuevoProyecto = new Proyecto(req.body);
    await nuevoProyecto.save();
    res.status(201).json(nuevoProyecto);
  } catch (error) {
    res.status(400).json({ error: 'Error al crear proyecto', details: error.message });
  }
};

exports.obtenerProyectoPorId = async (req, res) => {
  try {
    const proyecto = await Proyecto.findById(req.params.id);
    if (!proyecto) {
      return res.status(404).json({ error: 'Proyecto no encontrado' });
    }
    res.json(proyecto);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener proyecto por ID', details: error.message });
  }
};

exports.actualizarProyecto = async (req, res) => {
  const { nombre, descripcion } = req.body;

  if (!nombre || !descripcion) {
    return res.status(400).json({ error: 'El nombre y la descripción son obligatorios.' });
  }

  try {
    const proyecto = await Proyecto.findByIdAndUpdate(req.params.id, req.body, { new: true });
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
    res.json(proyecto);
  } catch (error) {
    res.status(500).json({ error: 'Error al cambiar estado del proyecto', details: error.message });
  }
};

exports.obtenerActividadesPorProyecto = async (req, res) => {
  try {
    const proyecto = await Proyecto.findById(req.params.id)
      .select('actividades')
      .populate({
        path: 'actividades.tareas',
        populate: {
          path: 'ayudante', // Poblar los ayudantes de las tareas
          select: 'nombre rol' // Seleccionar solo los campos nombre y rol de los ayudantes
        }
      })
      .populate('actividades.insumos.insumo') // Popula los insumos
      .populate('actividades.beneficiarios'); // Popula los beneficiarios

    if (!proyecto) {
      return res.status(404).json({ error: 'Proyecto no encontrado' });
    }
    res.json(proyecto.actividades);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener actividades del proyecto', details: error.message });
  }
};


// Añadir una nueva actividad a un proyecto
exports.agregarActividad = async (req, res) => {
  try {
    const { id } = req.params;
    const proyecto = await Proyecto.findById(id);
    if (!proyecto) {
      return res.status(404).json({ error: 'Proyecto no encontrado' });
    }

    proyecto.actividades.push(req.body);
    await proyecto.save();
    res.status(201).json(proyecto.actividades);
  } catch (error) {
    res.status(500).json({ error: 'Error al agregar actividad', details: error.message });
  }
};

// Actualizar una actividad existente
exports.actualizarActividad = async (req, res) => {
  try {
    const { id, idActividad } = req.params;
    const proyecto = await Proyecto.findById(id)
      .populate('actividades.tareas')
      .populate('actividades.insumos.insumo')
      .populate('actividades.beneficiarios'); // Popula tareas e insumos

    if (!proyecto) {
      return res.status(404).json({ error: 'Proyecto no encontrado' });
    }

    const actividad = proyecto.actividades.id(idActividad);
    if (!actividad) {
      return res.status(404).json({ error: 'Actividad no encontrada' });
    }

    Object.assign(actividad, req.body);
    await proyecto.save();
    res.json(actividad);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar actividad', details: error.message });
  }
};


// Eliminar una actividad de un proyecto
exports.eliminarActividad = async (req, res) => {
  try {
    const { id, idActividad } = req.params;
    const proyecto = await Proyecto.findById(id);
    if (!proyecto) {
      return res.status(404).json({ error: 'Proyecto no encontrado' });
    }

    proyecto.actividades.id(idActividad).remove();
    await proyecto.save();
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar actividad', details: error.message });
  }
};

// Cambiar el estado de una actividad (de 'activo' a 'inactivo' o viceversa)
exports.cambiarEstadoActividad = async (req, res) => {
  try {
    const { id, idActividad } = req.params;
    const proyecto = await Proyecto.findById(id);
    
    if (!proyecto) {
      return res.status(404).json({ error: 'Proyecto no encontrado' });
    }

    const actividad = proyecto.actividades.id(idActividad);
    if (!actividad) {
      return res.status(404).json({ error: 'Actividad no encontrada' });
    }

    // Alternar el estado de la actividad
    actividad.estado = actividad.estado === 'activo' ? 'inactivo' : 'activo';
    await proyecto.save();

    res.json(actividad);
  } catch (error) {
    res.status(500).json({ error: 'Error al cambiar el estado de la actividad', details: error.message });
  }
};

