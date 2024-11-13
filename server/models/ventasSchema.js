const mongoose = require('mongoose');

const ventaSchema = new mongoose.Schema({
  idVenta: { type: String, required: false },
  idUsuario: { type: String, required: false },
  total: { type: Number, required: false },
  fecha: { type: Date, default: Date.now },
  productos: [
    {
      idProducto: { type: String, required: false },
      nombre: { type: String, required: false },
      cantidad: { type: Number, required: false },
      categoria: { type: String, required: false },
      costo: { type: Number, required: false },
    },
  ],
});

module.exports = mongoose.model('Venta', ventaSchema);
