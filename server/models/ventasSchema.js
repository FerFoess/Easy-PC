const mongoose = require('mongoose');

// Definición del esquema para ventas
const ventasSchema = new mongoose.Schema({
  idVenta: { type: Number, required: false },
  idUsuario: { type: Number, required: false },
  categoría: { type: String, required: false }, 
  costo: { type: Number, required: false },
  cantidad: { type: Number, required: false },
  fecha: { type: Date, default: Date.now } // Fecha de la venta, por defecto la fecha actual
});

// Exportar el modelo de Venta
module.exports = mongoose.model('Venta', ventasSchema);
