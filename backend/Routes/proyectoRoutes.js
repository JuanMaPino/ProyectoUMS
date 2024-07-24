// Routes/proyectoRoutes.js
const express = require('express');
const router = express.Router();
const proyectoController = require('../Controllers/proyectoController');

// Rutas para CRUD de proyectos
router.get('/', proyectoController.obtenerTodosLosProyectos);
router.post('/', proyectoController.crearProyecto);
router.get('/:id', proyectoController.obtenerProyectoPorId);
router.put('/:id', proyectoController.actualizarProyecto);
router.delete('/:id', proyectoController.eliminarProyecto);

// Otras rutas específicas
router.patch('/:id/estado', proyectoController.cambiarEstadoProyecto);

module.exports = router;
