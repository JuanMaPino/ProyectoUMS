const Actividad = require('../Models/Actividad');

exports.obtenerTodasLasActividades = async (req, res) => {
    try {
        const actividades = await Actividad.find()
            .populate('tareas')
            .populate('insumos.insumo');
        res.json(actividades);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.crearActividad = async (req, res) => {
    const { nombre, fecha, tipo, descripcion, tareas, insumos } = req.body;

    const nuevaActividad = new Actividad({
        nombre,
        fecha,
        tipo,
        descripcion,
        tareas: tareas.map(t => t._id),
        insumos: insumos.map(i => ({ insumo: i.insumo._id, cantidad: i.cantidad }))
    });

    try {
        const actividadGuardada = await nuevaActividad.save();
        const actividadPoblada = await Actividad.findById(actividadGuardada._id)
            .populate('tareas')
            .populate('insumos.insumo');
        res.status(201).json(actividadPoblada);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.obtenerActividadPorId = async (req, res) => {
    try {
        const actividad = await Actividad.findById(req.params.id)
            .populate('tareas')
            .populate('insumos.insumo');
        if (actividad == null) {
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
        if (actividad == null) {
            return res.status(404).json({ message: 'No se encontró la actividad' });
        }

        actividad.nombre = nombre;
        actividad.fecha = fecha;
        actividad.tipo = tipo;
        actividad.descripcion = descripcion;
        actividad.tareas = tareas.map(t => t._id);
        actividad.insumos = insumos.map(i => ({ insumo: i.insumo._id, cantidad: i.cantidad }));

        const actividadActualizada = await actividad.save();
        const actividadPoblada = await Actividad.findById(actividadActualizada._id)
            .populate('tareas')
            .populate('insumos.insumo');
        res.json(actividadPoblada);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.eliminarActividad = async (req, res) => {
    try {
        const actividad = await Actividad.findById(req.params.id);
        if (actividad == null) {
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
        if (actividad == null) {
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
            .populate('tareas')
            .populate('insumos.insumo');
        if (actividad == null) {
            return res.status(404).json({ message: 'No se encontró la actividad' });
        }
        res.json(actividad);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
