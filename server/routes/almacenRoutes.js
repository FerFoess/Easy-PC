const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload'); // Middleware de Multer para subir imágenes
const almacenController = require('../controllers/almacenController');

// CRUD
router.get('/', almacenController.obtenerProductos);
router.get('/:id', almacenController.obtenerProductoPorId);

// Ruta para crear una nueva categoría, con el middleware de Multer
router.post('/', upload.single('imagen'), almacenController.crearProducto);

// Ruta para actualizar una categoría, con el middleware de Multer
router.put('/:id', upload.single('imagen'), almacenController.actualizarProducto);

// Eliminar categoría
router.delete('/:id', almacenController.eliminarProducto);

// Ruta para verificar el stock y generar alertas
router.post('/:id/verificarStock', almacenController.verificarStockYAlertar);

// Nueva ruta para reservar stock
router.post('/reservar', almacenController.reservarStock);


// routes/categoriasRoutes.js
router.post('/cancelar-compra', almacenController.cancelarCompra);

module.exports = router;
