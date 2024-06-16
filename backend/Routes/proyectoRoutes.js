// Routes/proyectoRoutes.js
const express = require('express');
const router = express.Router();
const proyectoController = require('../Controllers/proyectoController');

router.get('/', proyectoController.obtenerTodosLosProyectos);
router.post('/', proyectoController.crearProyecto);
router.get('/:id', proyectoController.obtenerProyectoPorId);
router.put('/:id', proyectoController.actualizarProyecto);
router.delete('/:id', proyectoController.eliminarProyecto);
router.patch('/:id/estado', proyectoController.cambiarEstadoProyecto);
router.get('/buscar/:codigo', proyectoController.obtenerProyectoPorCodigo);

module.exports = router;
