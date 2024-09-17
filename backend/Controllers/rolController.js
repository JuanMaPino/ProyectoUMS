const Rol = require('../Models/Rol');

exports.obtenerTodosLosRoles = async (req, res) => {
  try {
    const roles = await Rol.find().populate('permisos');
    res.json(roles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.crearRol = async (req, res) => {
  try {
    const nuevoRol = new Rol(req.body);
    await nuevoRol.save();
    res.status(201).json(nuevoRol);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Este nombre de rol ya está registrado.' });
    }
    res.status(400).json({ error: error.message });
  }
};

exports.obtenerRolPorId = async (req, res) => {
  try {
    const rol = await Rol.findById(req.params.id);
    if (!rol) {
      return res.status(404).json({ error: 'Rol no encontrado' });
    }
    res.json(rol);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.actualizarRol = async (req, res) => {
  try {
    const rol = await Rol.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!rol) {
      return res.status(404).json({ error: 'Rol no encontrado' });
    }
    res.json(rol);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.eliminarRol = async (req, res) => {
  try {
    const rol = await Rol.findByIdAndDelete(req.params.id);
    if (!rol) {
      return res.status(404).json({ error: 'Rol no encontrado' });
    }
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.cambiarEstadoRol = async (req, res) => {
  try {
    const rol = await Rol.findById(req.params.id);
    if (!rol) {
      return res.status(404).json({ error: 'Rol no encontrado' });
    }
    rol.estado = rol.estado === 'activo' ? 'inactivo' : 'activo';
    await rol.save();
    res.json(rol);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.obtenerRolPorNombre = async (req, res) => {
  try {
    const rol = await Rol.findOne({ nombre: req.params.nombre });
    if (!rol) {
      return res.status(404).json({ error: 'Rol no encontrado' });
    }
    res.json(rol);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
