const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Verificar si el modelo ya existe para evitar sobrescribirlo
const Producto = mongoose.models.Producto || mongoose.model('Producto', new Schema({
  nombre: { type: String, required: true },
  categoria: { type: String, required: true },
  precio: { type: Number, required: true },
  descripcion: { type: String, required: true },
  imagen: { type: String },
  detalles: { 
    modelo: { type: String },
    capacidad: { type: String },
    velocidad: { type: String },
    tipo: { type: String },
    formato: { type: String },
  }
}));

module.exports = Producto;
