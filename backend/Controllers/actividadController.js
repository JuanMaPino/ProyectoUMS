const Actividad = require('../Models/Actividad');

exports.obtenerTodasLasActividades = async (req, res) => {
    try {
        const actividades = await Actividad.find()
            .populate({
                path: 'tareas',
                populate: {
                    path: 'ayudante', // Poblar los ayudantes dentro de las tareas
                    select: 'nombre rol' // Campos a seleccionar del ayudante
                }
            })
            .populate('insumos.insumo');
        res.json(actividades);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.obtenerActividadesPorProyecto = async (req, res) => {
    const { proyectoId } = req.params;
    try {
        const actividades = await Actividad.find({ proyecto: proyectoId })
            .populate({
                path: 'tareas',
                populate: {
                    path: 'ayudante',
                    select: 'nombre rol'
                }
            })
            .populate('insumos.insumo');
        res.json(actividades);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.crearActividad = async (req, res) => {
    const { nombre, fecha, tipo, descripcion, tareas, insumos, proyecto } = req.body;

    const nuevaActividad = new Actividad({
        nombre,
        fecha,
        tipo,
        descripcion,
        tareas: tareas.map(t => ({ _id: t._id, ayudante: t.ayudante })), // Incluir ayudante en cada tarea
        insumos: insumos.map(i => ({ insumo: i.insumo._id, cantidad: i.cantidad })),
        proyecto
    });

    try {
        const actividadGuardada = await nuevaActividad.save();
        const actividadPoblada = await Actividad.findById(actividadGuardada._id)
            .populate({
                path: 'tareas',
                populate: {
                    path: 'ayudante',
                    select: 'nombre rol'
                }
            })
            .populate('insumos.insumo');
        res.status(201).json(actividadPoblada);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.obtenerActividadPorId = async (req, res) => {
    try {
        const actividad = await Actividad.findById(req.params.id)
            .populate({
                path: 'tareas',
                populate: {
                    path: 'ayudante',
                    select: 'nombre rol'
                }
            })
            .populate('insumos.insumo');
        if (!actividad) {
            return res.status(404).json({ message: 'No se encontró la actividad' });
        }
        res.json(actividad);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.actualizarActividad = async (req, res) => {
    const { nombre, fecha, tipo, descripcion, tareas, insumos } = req.body;

    try {
        const actividad = await Actividad.findById(req.params.id);
        if (!actividad) {
            return res.status(404).json({ message: 'No se encontró la actividad' });
        }

        actividad.nombre = nombre;
        actividad.fecha = fecha;
        actividad.tipo = tipo;
        actividad.descripcion = descripcion;
        actividad.tareas = tareas.map(t => ({ _id: t._id, ayudante: t.ayudante })); // Incluir ayudante en la actualización
        actividad.insumos = insumos.map(i => ({ insumo: i.insumo._id, cantidad: i.cantidad }));

        const actividadActualizada = await actividad.save();
        const actividadPoblada = await Actividad.findById(actividadActualizada._id)
            .populate({
                path: 'tareas',
                populate: {
                    path: 'ayudante',
                    select: 'nombre rol'
                }
            })
            .populate('insumos.insumo');
        res.json(actividadPoblada);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.eliminarActividad = async (req, res) => {
    try {
        const actividad = await Actividad.findById(req.params.id);
        if (!actividad) {
            return res.status(404).json({ message: 'No se encontró la actividad' });
        }

        await actividad.remove();
        res.status(204).json({ message: 'Actividad eliminada' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.cambiarEstadoActividad = async (req, res) => {
    try {
        const actividad = await Actividad.findById(req.params.id);
        if (!actividad) {
            return res.status(404).json({ message: 'No se encontró la actividad' });
        }

        actividad.estado = actividad.estado === 'activo' ? 'inactivo' : 'activo';
        const actividadActualizada = await actividad.save();
        res.json(actividadActualizada);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.obtenerActividadPorNombre = async (req, res) => {
    try {
        const actividad = await Actividad.findOne({ nombre: req.params.nombre })
            .populate({
                path: 'tareas',
                populate: {
                    path: 'ayudante',
                    select: 'nombre rol'
                }
            })
            .populate('insumos.insumo');
        if (!actividad) {
            return res.status(404).json({ message: 'No se encontró la actividad' });
        }
        res.json(actividad);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
