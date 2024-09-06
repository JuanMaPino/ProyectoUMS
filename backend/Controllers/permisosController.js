const Permiso = require('../Models/Permisos')

exports.obtenerTodosLosPermisos = async (req, res) => {
    try{
        const permisos = await Permiso.find();
        res.json(permisos);
    } catch(error){
      res.status(500).json({error: 'Error al obtener todos los permisos', details: error.message});
    }
};