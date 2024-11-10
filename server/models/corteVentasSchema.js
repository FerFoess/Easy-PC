const mongoose = require('mongoose');

// Definición del esquema para corteVentas
const corteVentasSchema = new mongoose.Schema({
  fecha: { type: String, unique: true, required: true }, // Cambiado a String
  total: { type: Number, required: true } // Campo requerido para el dinero
});

// Exportar el modelo de CorteVentas
module.exports = mongoose.model('CorteVentas', corteVentasSchema);
