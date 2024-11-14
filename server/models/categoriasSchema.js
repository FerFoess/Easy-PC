const mongoose = require('mongoose');

const categoriaSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  descripcion: { type: String },
  categoria: { type: String, required: true },
  precio: { type: Number, required: true },
  especificaciones: {
    type: Map,
    of: [String], 
  },
  tipo: { type: String, required: true },  // Asegúrate de agregar esto
  proposito: { type: String, required: true },  // Asegúrate de agregar esto
  imagen: { type: String }, // Nueva propiedad para guardar la ruta de la imagen
  stock: { type: Number, required: true } // Se agregó el atributo stock
});


module.exports = mongoose.model('Categoria', categoriaSchema);
