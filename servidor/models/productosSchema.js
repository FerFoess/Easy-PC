const mongoose = require('mongoose');

// Definición del esquema para productos
const productoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },  // Nombre del producto
  categoria: { type: mongoose.Schema.Types.ObjectId, ref: 'Categoria', required: true },  // Referencia a la categoría
  descripcion: { type: String, required: true },  // Descripción del producto
  precio_unitario: { type: Number, required: true },  // Precio por unidad
  cantidad_disponible: { type: Number, required: true },  // Cantidad disponible en stock
  fecha_ingreso: { type: Date, default: Date.now },  // Fecha de ingreso del producto
  estado: { type: String, enum: ['disponible', 'agotado', 'inactivo'], default: 'disponible' }  // Estado del producto
});

// Exportar el modelo de Producto
module.exports = mongoose.model('Producto', productoSchema);
