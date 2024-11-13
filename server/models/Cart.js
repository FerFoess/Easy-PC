const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  componentId: {
     type: String ,  // Sigue usando ObjectId para los IDs de componentes
    required: true,
  },

});

const cartSchema = new mongoose.Schema({
  userId: {
    type: String, 
    required: true,
  },
  items: [cartItemSchema], 
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
