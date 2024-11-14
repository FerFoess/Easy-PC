// routes/categoriasRoutes.js
const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload'); // Asegúrate de importar el middleware de Multer
const categoriaController = require('../controllers/categoriasController');

// CRUD
router.get('/', categoriaController.obtenerCategorias);
router.get('/:id', categoriaController.obtenerCategoriaPorId);

// Ruta para crear una nueva categoría, con el middleware de Multer
router.post('/', upload.single('imagen'), categoriaController.crearCategoria); // Llama a la función 'crearCategoria'

// Ruta para actualizar una categoría, con el middleware de Multer
router.put('/:id', upload.single('imagen'), categoriaController.actualizarCategoria);

// Eliminar categoría
router.delete('/:id', categoriaController.eliminarCategoria);

module.exports = router;
