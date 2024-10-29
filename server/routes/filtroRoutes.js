// routes/filtroRoutes.js
const express = require('express');
const router = express.Router();
const {
    obtenerFiltros,
    obtenerFiltrosPorCategoria,
    crearFiltro,
    actualizarFiltro,
    eliminarFiltro
} = require('../controllers/filtroController');

// Rutas para filtros
router.get('/filtros', obtenerFiltros); // Obtener todos los filtros
router.get('/filtros/categoria', obtenerFiltrosPorCategoria); // Obtener filtros por categoría
router.post('/filtros', crearFiltro); // Crear un nuevo filtro
router.put('/filtros/:id', actualizarFiltro); // Actualizar un filtro existente
router.delete('/filtros/:id', eliminarFiltro); // Eliminar un filtro

module.exports = router;
