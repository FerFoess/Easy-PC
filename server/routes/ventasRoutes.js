const express = require('express');
const router = express.Router();
const ventasController = require('../controllers/ventasController');

// Ruta para crear una nueva venta
router.post('/crearVentas', ventasController.crearVenta);

// Ruta para obtener todas las ventas
router.get('/obtenerVentas', ventasController.obtenerVentas);

// Ruta para obtener una venta por su ID
router.get('/obtenerVenta/:id', ventasController.obtenerVentaPorId);

module.exports = router;
