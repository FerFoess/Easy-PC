const express = require('express');
const router = express.Router();
const { getCart, createCart, addComponentToCart, removeComponentFromCart, updateComponentQuantity, clearCart , updateTotal} = require('../controllers/cartController');

// Ruta para obtener el carrito de un usuario
router.get("/:userId", getCart);

// Ruta para crear un nuevo carrito
router.post('/cart', createCart);

// Ruta para agregar un componente al carrito (con userId)
router.post('/:userId/addComponentToCart', addComponentToCart);

// Ruta para eliminar un componente del carrito
router.delete('/cart/:userId/removeComponent', removeComponentFromCart);

// Ruta para actualizar la cantidad de un componente en el carrito
router.put('/:userId/updateQuantity', updateComponentQuantity);

router.delete('/cart/:userId/clearCart', clearCart);

router.patch('/cart/:userId/updateTotal', updateTotal);
module.exports = router;
