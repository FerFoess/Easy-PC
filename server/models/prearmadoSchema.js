// models/Prearmado.js
const mongoose = require("mongoose");

const PrearmadoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  processor: {
    type: String,
    required: true
  },
  ram: {
    type: String,
    required: true
  },
  storage: {
    type: String,
    required: true
  },
  graphics: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  stock:{
    type:String,
    requiere:true
  }
});

module.exports = mongoose.model("Prearmado", PrearmadoSchema);
