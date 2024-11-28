const mongoose = require('mongoose');

const componentsSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  descripcion: { type: String, required: true },
  categoria: { type: String, required: true },
  precio: { type: Number, required: true },
  stock: { type: Number, default: 0 },
  especificaciones: {
    type: Map,
    of: [String], 
  },
  name: { type: String, required: true },
  propositos: [{ type: String }],
  imagen: { type: String }, // Nuevo campo para almacenar la ruta de la imagen
  estado: { type: String, default: 'Disponible' },
});

// Especifica el nombre de la colección como 'components'
module.exports = mongoose.model('components', componentsSchema);
