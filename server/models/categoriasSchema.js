const mongoose = require('mongoose');

const categoriaSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  descripcion: { type: String },
  categoria: { type: String, required: true },
  precio: { type: Number, required: true },
  detalles: {
    type: Object, // Detalles como objeto plano
    required: true
  },
  imagen: { type: String } // Nueva propiedad para guardar la ruta de la imagen
});

module.exports = mongoose.model('Categoria', categoriaSchema);
