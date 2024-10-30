// controllers/filtroController.js
const Filtro = require('../models/Filtro');

const obtenerFiltros = async (req, res) => {
    try {
        const filtros = await Filtro.find();
        res.json(filtros);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener filtros' });
    }
};
const obtenerFiltrosPorCategoria = async (req, res) => {
  const { categoria } = req.query;

  try {
      const filtro = await Filtro.findOne({ categoria });
      if (!filtro) {
          return res.status(404).json({ message: "Categoría no encontrada" });
      }

      // Convertir Map a objeto regular
      const filtrosObj = {};
      filtro.filtros.forEach((value, key) => {
          filtrosObj[key] = value;
      });

      res.json(filtrosObj);
  } catch (error) {
      res.status(500).json({ error: 'Error al obtener filtros por categoría' });
  }
};





// Crear un nuevo filtro
const crearFiltro = async (req, res) => {
    const { categoria, opciones } = req.body;

    const nuevoFiltro = new Filtro({ categoria, opciones });

    try {
        await nuevoFiltro.save();
        res.status(201).json(nuevoFiltro);
    } catch (error) {
        res.status(400).json({ error: 'Error al crear el filtro' });
    }
};

// Actualizar un filtro existente
const actualizarFiltro = async (req, res) => {
    const { id } = req.params;
    const { opciones } = req.body;

    try {
        const filtroActualizado = await Filtro.findByIdAndUpdate(id, { opciones }, { new: true });
        if (!filtroActualizado) {
            return res.status(404).json({ error: 'Filtro no encontrado' });
        }
        res.json(filtroActualizado);
    } catch (error) {
        res.status(400).json({ error: 'Error al actualizar el filtro' });
    }
};

// Eliminar un filtro
const eliminarFiltro = async (req, res) => {
    const { id } = req.params;

    try {
        const filtroEliminado = await Filtro.findByIdAndDelete(id);
        if (!filtroEliminado) {
            return res.status(404).json({ error: 'Filtro no encontrado' });
        }
        res.json({ message: 'Filtro eliminado' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el filtro' });
    }
};

module.exports = {
    obtenerFiltros,
    obtenerFiltrosPorCategoria,
    crearFiltro,
    actualizarFiltro,
    eliminarFiltro
};
