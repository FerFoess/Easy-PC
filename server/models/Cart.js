const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  componentId: {
    type: mongoose.Schema.Types.ObjectId, // Sigue usando ObjectId para los IDs de componentes
    required: true,
  },
  // Se eliminan los campos 'quantity' y 'price'
});

const cartSchema = new mongoose.Schema({
  userId: {
    type: String, // Puedes almacenar solo el ID como cadena
    required: true,
  },
  items: [cartItemSchema], // Lista de productos en el carrito
  total: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'abandoned'],
    default: 'active',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
