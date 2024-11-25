const mongoose = require('mongoose');

const AlertaSchema = new mongoose.Schema({
  producto: {
    type: String,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
  },
  mensaje: {
    type: String,
    required: true,
  },
  tipo: {
    type: String,  // 'advertencia' o 'urgente'
    required: true,
  },
  fecha: {
    type: Date,
    default: Date.now,
  },
});

const Alerta = mongoose.model('Alerta', AlertaSchema);
module.exports = Alerta;
