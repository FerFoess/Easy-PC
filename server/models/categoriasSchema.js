const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Esquema de la Categoria
const CategoriaSchema = new Schema({
  nombre: {
    type: String,
    required: true
  }
});

// Exportar el modelo Categoria
module.exports = mongoose.model('Categoria', CategoriaSchema);
