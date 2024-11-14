const express = require('express');
const router = express.Router();
const categoriaController = require('../controllers/categoriasController');

// CRUD
router.get('/', categoriaController.obtenerCategorias);
router.get('/:id', categoriaController.obtenerCategoriaPorId);

// Ruta estándar para crear una categoría
router.post('/', categoriaController.crearCategoria);

router.put('/:id', categoriaController.actualizarCategoria);
router.delete('/:id', categoriaController.eliminarCategoria);

module.exports = router;
