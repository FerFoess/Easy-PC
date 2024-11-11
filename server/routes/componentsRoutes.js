// routes/productoRoutes.js
const express = require('express');
const router = express.Router();
const componentsController = require('../controllers/componentsController');

// CRUD
router.post('/', componentsController.crearProducto);
router.get('/', componentsController.obtenerProductos);

router.post('/getCartItems', componentsController.obtenerProductosCarrito);

router.put('/:id', componentsController.actualizarProducto);
router.delete('/:id', componentsController.eliminarProducto);


// Operaciones de filtrado
router.get('/buscar/filtros', componentsController.obtenerProductosPorFiltro);
router.get('/propositos', componentsController.obtenerProductosPorProposito);
router.get('/components/purposes/:name', componentsController.getOptionsByPurpose);
router.get('/filtros/categoria', componentsController.obtenerFiltrosPorCategoria);
router.post('/components/search', componentsController.searchComponents);
router.get('/:id/existencia', componentsController.obtenerStockProducto);
module.exports = router;
