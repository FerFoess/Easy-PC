const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProveedorSchema = new Schema({
  proveedor: {
    type: String,
    required: true
  },
  stock: {
    type: Number,
    required: true
  },
  precio_proveedor: {
    type: Number,
    required: true
  }
});

const DetallesSchema = new Schema({
  frecuencia_base: {
    type: Number,
    required: false
  },
  frecuencia_turbo: {
    type: Number,
    required: false
  },
  numero_nucleos: {
    type: Number,
    required: false
  },
  numero_hilos: {
    type: Number,
    required: false
  },
  socket: {
    type: String,
    required: false
  },
  consumo_energia: {
    type: Number,
    required: false
  },
  memoria: {
    type: Number,
    required: false
  },
  tipo_memoria: {
    type: String,
    required: false
  },
  frecuencia_base: {
    type: Number,
    required: false
  },
  frecuencia_boost: {
    type: Number,
    required: false
  },
  capacidad: {
    type: Number,
    required: false
  },
  velocidad_lectura: {
    type: Number,
    required: false
  },
  velocidad_escritura: {
    type: Number,
    required: false
  },
  tipo: {
    type: String,
    required: false
  },
  potencia: {
    type: Number,
    required: false
  },
  certificacion: {
    type: String,
    required: false
  },
  modular: {
    type: Boolean,
    required: false
  },
  socket_compatibles: {
    type: [String],
    required: false
  },
  nivel_ruido: {
    type: Number,
    required: false
  },
  tamaño: {
    type: String,
    required: false
  }
});

const ProductoSchema = new Schema({
  nombre: {
    type: String,
    required: true
  },
  modelo: {
    type: String,
    required: true
  },
  marca: {
    type: String,
    required: true
  },
  detalles: DetallesSchema,  // Subdocumento para los detalles del producto
  precio_base: {
    type: Number,
    required: true
  },
  descripcion: {
    type: String,
    required: true
  },
  proveedores: [ProveedorSchema],  // Subdocumento para los proveedores
  estado: {
    type: Boolean,
    default: true
  }
});

module.exports = mongoose.model('Producto', ProductoSchema);
