const express = require('express');
const router = express.Router();
const Producto = require('../models/almacenamientoSchema'); // Asegúrate de tener el modelo Producto

// Ruta para agregar o actualizar productos
router.post('/', (req, res) => {
  const newProduct = new Producto(req.body);
  
  // Guardar el producto en la base de datos
  newProduct.save()
    .then((savedProduct) => {
      res.status(201).json(savedProduct); // Enviar la respuesta con el producto guardado
    })
    .catch((error) => {
      console.error('Error al agregar producto:', error);
      res.status(500).json({ message: 'Error al agregar el producto' });
    });
});

module.exports = router;
