const express = require('express');
const router = express.Router();
const ventasController = require('../controllers/ventasController');

// Rutas para ventas
router.get('/obtenerVentas', ventasController.obtenerVentas);
router.get('/obtenerVenta/:id', ventasController.obtenerVentaPorId);
router.post('/ventas', ventasController.crearVenta);

module.exports = router;
