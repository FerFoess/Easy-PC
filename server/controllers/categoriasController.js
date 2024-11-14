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
    const { nombre, descripcion, especificaciones, categoria, precio, tipo, proposito, stock } = req.body;

    // Validación de campos obligatorios
    if (!nombre || !categoria || !precio || !especificaciones || !tipo || !proposito || stock === undefined) {
      return res.status(400).json({ error: 'Nombre, categoría, precio, especificaciones, tipo, propósito y stock son obligatorios' });
    }

    // Validar que las especificaciones sean un Map de arreglos de String
    if (typeof especificaciones !== 'object' || Array.isArray(especificaciones)) {
      return res.status(400).json({ error: 'especificaciones debe ser un objeto Map de arreglos de String' });
    }

    for (let [key, value] of Object.entries(especificaciones)) {
      if (!Array.isArray(value) || !value.every(v => typeof v === 'string')) {
        return res.status(400).json({ error: 'Cada especificación debe ser un arreglo de strings' });
      }
    }

    const nuevaCategoria = new Categoria({
      nombre,
      descripcion,
      categoria,
      precio,
      especificaciones: new Map(Object.entries(especificaciones)), // Convertir a Map
      tipo,
      proposito,
      stock, // Incluye el campo de stock
    });

    const categoriaGuardada = await nuevaCategoria.save();
    res.status(201).json(categoriaGuardada);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Error al crear la categoría' });
  }
};

// Controlador para actualizar una categoría existente
// Controlador para actualizar una categoría existente
exports.actualizarCategoria = async (req, res) => {
  try {
    const { nombre, descripcion, especificaciones, categoria, precio, tipo, proposito, stock } = req.body;

    // Validaciones
    if (especificaciones && typeof especificaciones !== 'object') {
      return res.status(400).json({ error: 'especificaciones debe ser un objeto Map de arreglos de String' });
    }

    if (especificaciones) {
      for (let [key, value] of Object.entries(especificaciones)) {
        if (!Array.isArray(value) || !value.every(v => typeof v === 'string')) {
          return res.status(400).json({ error: 'Cada especificación debe ser un arreglo de strings' });
        }
      }
    }

    // Actualizar la categoría
    const categoriaActualizada = await Categoria.findByIdAndUpdate(
      req.params.id,
      {
        nombre,
        descripcion,
        especificaciones: especificaciones ? new Map(Object.entries(especificaciones)) : undefined,
        categoria,
        precio,
        tipo,
        proposito,
        stock,
        imagen: req.file ? req.file.path : undefined, // Actualizar imagen si es proporcionada
      },
      { new: true } // Devuelve el objeto actualizado
    );

    if (!categoriaActualizada) {
      return res.status(404).json({ error: 'Categoría no encontrada' });
    }

    res.status(200).json(categoriaActualizada);
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
