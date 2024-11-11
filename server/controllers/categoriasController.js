const Categoria = require('../models/categoriasSchema');

// Controlador para obtener todas las categorías
exports.obtenerCategorias = async (req, res) => {
  try {
    const categorias = await Categoria.find();
    res.status(200).json(categorias);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener las categorías' });
  }
};

// Controlador para obtener una categoría por su ID
exports.obtenerCategoriaPorId = async (req, res) => {
  try {
    const categoria = await Categoria.findById(req.params.id);
    if (!categoria) {
      return res.status(404).json({ error: 'Categoría no encontrada' });
    }
    res.status(200).json(categoria);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener la categoría' });
  }
};

// Controlador para crear una nueva categoría
exports.crearCategoria = async (req, res) => {
  try {
    const { nombre, descripcion, detalles } = req.body;

    // Validación de campos obligatorios
    if (!nombre || !Array.isArray(detalles)) {
      return res.status(400).json({ error: 'Nombre y detalles son obligatorios, y detalles debe ser un arreglo' });
    }

    // Validar que cada detalle tenga un nombre y un tipo
    for (let detalle of detalles) {
      if (!detalle.nombre || !detalle.tipo) {
        return res.status(400).json({ error: 'Cada detalle debe incluir un nombre y un tipo' });
      }
    }

    const nuevaCategoria = new Categoria({
      nombre,
      descripcion,
      detalles
    });
    const categoriaGuardada = await nuevaCategoria.save();
    res.status(201).json(categoriaGuardada);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Error al crear la categoría' });
  }
};

// Controlador para actualizar una categoría existente
exports.actualizarCategoria = async (req, res) => {
  try {
    const { nombre, descripcion, detalles } = req.body;

    // Validación opcional de campos si están presentes en la solicitud
    if (detalles && !Array.isArray(detalles)) {
      return res.status(400).json({ error: 'Detalles debe ser un arreglo' });
    }

    if (detalles) {
      for (let detalle of detalles) {
        if (!detalle.nombre || !detalle.tipo) {
          return res.status(400).json({ error: 'Cada detalle debe incluir un nombre y un tipo' });
        }
      }
    }

    const categoria = await Categoria.findByIdAndUpdate(
      req.params.id,
      { nombre, descripcion, detalles },
      { new: true }
    );

    if (!categoria) {
      return res.status(404).json({ error: 'Categoría no encontrada' });
    }
    res.status(200).json(categoria);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Error al actualizar la categoría' });
  }
};

// Controlador para eliminar una categoría por su ID
exports.eliminarCategoria = async (req, res) => {
  try {
    const categoriaEliminada = await Categoria.findByIdAndDelete(req.params.id);
    if (!categoriaEliminada) {
      return res.status(404).json({ error: 'Categoría no encontrada' });
    }
    res.status(200).json({ message: 'Categoría eliminada' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar la categoría' });
  }
};
