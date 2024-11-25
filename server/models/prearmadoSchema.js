const mongoose = require("mongoose");

const PrearmadoSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true
  },
  procesador: {
    type: String,
    required: true
  },
  ram: {
    type: String,
    required: true
  },
  almacenamiento: {
    type: String,
    required: true
  },
  graficos: {
    type: String,
    required: true
  },
  precio: {
    type: Number,
    required: true
  },
  stock: { // Cambiado a Number
    type: Number,
    required: true
  },
  imagen: {
    type: String,
    default: 'https://via.placeholder.com/150'
  }
});

module.exports = mongoose.model("Prearmado", PrearmadoSchema);
