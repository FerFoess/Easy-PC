const Components = require('../models/components'); // Asegúrate de importar el modelo correcto

// Controlador para obtener todas las categorías
exports.obtenerCategorias = async (req, res) => {
  try {
    const categorias = await Components.find();
    res.status(200).json(categorias);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener las categorías' });
  }
};

// Controlador para obtener una categoría por su ID
exports.obtenerCategoriaPorId = async (req, res) => {
  try {
    const categoria = await Components.findById(req.params.id);
    if (!categoria) {
      return res.status(404).json({ error: 'Categoría no encontrada' });
    }
    res.status(200).json(categoria);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener la categoría' });
  }
};


exports.crearCategoria = async (req, res) => {
  console.log('Archivo recibido:', req.file); // Verifica si el archivo está llegando
  console.log('Datos del cuerpo:', req.body); // Verifica los datos del cuerpo

  const { nombre, categoria, precio, especificaciones, descripcion, stock, propositos, name } = req.body;

  // Validación básica de los campos obligatorios
  if (!nombre || !categoria || !precio || !especificaciones || !stock || !name) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  // Asegúrate de que especificaciones se está recibiendo correctamente
  let especificacionesObj;
  try {
    especificacionesObj = JSON.parse(especificaciones); // Convertir especificaciones de string a objeto
  } catch (error) {
    return res.status(400).json({ error: 'Las especificaciones no son un JSON válido' });
  }

  // Crear la nueva categoría
  try {
    const nuevaCategoria = new Components({
      nombre,
      categoria,
      precio,
      especificaciones: especificacionesObj, // Ahora es un objeto
      descripcion,
      stock,
      propositos,
      name,
      imagen: req.file ? req.file.path : undefined, // Si se sube una imagen, agregar la ruta
    });

    // Guardar la nueva categoría en la base de datos
    const categoriaGuardada = await nuevaCategoria.save();
    return res.status(201).json(categoriaGuardada);
  } catch (error) {
    console.error('Error al crear la categoría:', error);
    return res.status(500).json({ error: 'Error al crear la categoría' });
  }
};




// Controlador para actualizar una categoría existente
exports.actualizarCategoria = async (req, res) => {
  try {
    const { nombre, descripcion, categoria, precio, especificaciones, name, propositos, stock } = req.body;

    // Validaciones
    if (especificaciones && typeof especificaciones !== 'object') {
      return res.status(400).json({ error: 'Las especificaciones deben ser un objeto Map de arreglos de String' });
    }

    if (especificaciones) {
      for (let [key, value] of Object.entries(especificaciones)) {
        if (!Array.isArray(value) || !value.every(v => typeof v === 'string')) {
          return res.status(400).json({ error: 'Cada especificación debe ser un arreglo de strings' });
        }
      }
    }

    // Actualizar la categoría
    const categoriaActualizada = await Components.findByIdAndUpdate(
      req.params.id,
      {
        nombre,
        descripcion,
        especificaciones: especificaciones ? new Map(Object.entries(especificaciones)) : undefined,
        categoria,
        precio,
        name,
        propositos,
        stock,
        imagen: req.file ? req.file.path : undefined, // Actualizar imagen si se proporciona
      },
      { new: true } // Devuelve el objeto actualizado
    );

    if (!categoriaActualizada) {
      return res.status(404).json({ error: 'Categoría no encontrada' });
    }

    res.status(200).json(categoriaActualizada);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Error al actualizar la categoría', details: error.message });
  }
};

// Controlador para eliminar una categoría por su ID
exports.eliminarCategoria = async (req, res) => {
  try {
    const categoriaEliminada = await Components.findByIdAndDelete(req.params.id);
    if (!categoriaEliminada) {
      return res.status(404).json({ error: 'Categoría no encontrada' });
    }
    res.status(200).json({ message: 'Categoría eliminada' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar la categoría', details: error.message });
  }
};
