const mongoose = require('mongoose');

const filterSchema = new mongoose.Schema({
  categoria: {
    type: String,
    required: true,
    unique: true, // Asegúrate de que cada categoría sea única
  },
  filtros: {
    type: Map,
    of: [String], // Cada filtro tendrá un array de opciones
  },
});

const Filter = mongoose.model('Filtro', filterSchema);

module.exports = Filter;