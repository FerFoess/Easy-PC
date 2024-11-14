// models/Prearmado.js
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
  stock:{
    type:String,
    requiere:true
  }
});

module.exports = mongoose.model("Prearmado", PrearmadoSchema);
