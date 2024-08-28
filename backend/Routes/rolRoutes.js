const express = require('express');
const router = express.Router();
const rolController = require('../Controllers/rolController');

router.get('/', rolController.obtenerTodosLosRoles);
router.post('/', rolController.crearRol);
router.get('/:id', rolController.obtenerRolPorId);
router.put('/:id', rolController.actualizarRol);
router.delete('/:id', rolController.eliminarRol);
router.patch('/:id/estado', rolController.cambiarEstadoRol);
router.get('/buscar/:nombre', rolController.obtenerRolPorNombre);

module.exports = router;
