const mongoose = require('mongoose');

// Definición del esquema para productos
const productosSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  categoria: { type: String, required: true },  // Cambiado a String
  descripcion: { type: String, required: true },
  precio_unitario: { type: Number, required: true },
  cantidad_disponible: { type: Number, required: true },
  estado: { type: String, enum: ['disponible', 'agotado', 'inactivo'], default: 'disponible' }
});


// Exportar el modelo de Producto
module.exports = mongoose.model('Producto', productosSchema);
