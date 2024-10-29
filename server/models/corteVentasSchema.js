const mongoose = require('mongoose');

// Definición del esquema para corteVentas
const corteVentasSchema = new mongoose.Schema({
  fecha: { type: Date, default: Date.now }, // Fecha del corte, por defecto la fecha actual
  total: { type: Number, required: true } // Campo requerido para el dinero
});

// Exportar el modelo de CorteVentas
module.exports = mongoose.model('CorteVentas', corteVentasSchema);
