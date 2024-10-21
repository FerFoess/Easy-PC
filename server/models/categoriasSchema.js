// models/categoriasSchema.js
const mongoose = require('mongoose');

// Definición del esquema para categorías
const categoriaSchema = new mongoose.Schema({
  nombre: { type: String, required: true, unique: true },
  descripcion: { type: String, required: true }
});

// Exportar el modelo de Categoria
module.exports = mongoose.model('Categoria', categoriaSchema);
