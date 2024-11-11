const mongoose = require('mongoose');

const ventaSchema = new mongoose.Schema({
  idVenta: { type: String, required: true },
  idUsuario: { type: String, required: true },
  total: { type: Number, required: true },
  fecha: { type: Date, default: Date.now },
  productos: [
    {
      idProducto: { type: String, required: true },
      nombre: { type: String, required: true },
      cantidad: { type: Number, required: true },
      categoria: { type: String, required: true },
      costo: { type: Number, required: true },
    },
  ],
});

module.exports = mongoose.model('Venta', ventaSchema);
