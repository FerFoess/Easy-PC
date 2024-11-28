const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  productoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Components', required: true },
  nombre: { type: String, required: true },
  categoria: { type: String, required: true },
  cantidad: { type: Number, required: true },
  correoProveedor: { type: String, required: true },
  fechaCreacion: { type: Date, default: Date.now },
  fechaFinalizacion: { type: Date},
  estado: { type: String, default: 'Pendiente' }, // Opciones: Pendiente, Confirmado, Enviado, Completado
});

module.exports = mongoose.model('Order', OrderSchema);
