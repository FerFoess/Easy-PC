// routes/corteVentasRoutes.js
const express = require('express');
const {
    obtenerCortesVentas,
    obtenerCortePorId,
    crearCorteVenta,
    actualizarCorteVenta,
    eliminarCorteVenta
} = require('../controllers/corteVentasController'); // Asegúrate de que la ruta del archivo es correcta

const router = express.Router();

router.get('/obtenerCortesVentas', obtenerCortesVentas);
router.get('/:idCorte', obtenerCortePorId);
router.post('/crearCorte', crearCorteVenta);
router.put('/:idCorte', actualizarCorteVenta);
router.delete('/:idCorte', eliminarCorteVenta);

module.exports = router;
