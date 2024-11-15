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
  stock: {
    type: String,
    required: true
  },
  imagen: {  // Nueva propiedad imagen
    type: String, // Puede ser un string con la URL o el path relativo a la imagen
    default: 'https://via.placeholder.com/150' // Imagen por defecto si no se proporciona
  }
});

module.exports = mongoose.model("Prearmado", PrearmadoSchema);
