const express = require('express');
const router = express.Router();
const multer = require('multer'); // Requerir Multer para el manejo de archivos
const Categoria = require('../models/categoriasSchema');
const path = require('path');

// Configurar Multer para guardar imágenes en una carpeta llamada "uploads"
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Carpeta donde se guardarán las imágenes
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // Asigna un nombre único a cada archivo
  }
});

const upload = multer({ storage: storage });

// Ruta para crear una nueva categoría con imagen
// Ruta para crear una nueva categoría con imagen
router.post('/', upload.single('imagen'), async (req, res) => {
  try {
    const { nombre, descripcion, detalles, categoria, precio } = req.body;

    // Validar que los campos requeridos estén presentes
    if (!nombre || !categoria || !precio || !detalles) {
      return res.status(400).json({ error: 'Nombre, categoría, precio y detalles son obligatorios' });
    }

    // Convertir `detalles` a objeto si se envía como cadena JSON
    let detallesParsed;
    try {
      detallesParsed = typeof detalles === 'string' ? JSON.parse(detalles) : detalles;
    } catch (parseError) {
      return res.status(400).json({ error: 'Detalles debe ser un objeto válido o una cadena JSON' });
    }

    // Crear un nuevo objeto con la imagen si se subió una
    let nuevaCategoria = {
      nombre,
      descripcion,
      categoria,
      precio,
      detalles: detallesParsed, // Asigna el objeto parseado o directamente el objeto
    };

    if (req.file) {
      nuevaCategoria.imagen = req.file.path; // Guarda la ruta de la imagen subida
    }

    const categoriaCreada = new Categoria(nuevaCategoria);
    await categoriaCreada.save();

    res.status(201).json(categoriaCreada);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Error al crear la categoría' });
  }
});




// Ruta para obtener una categoría por su ID
router.get('/', async (req, res) => {
  try {
    const categorias = await Categoria.find();
    res.json(categorias); // Devuelve todas las categorías con la estructura actualizada
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener las categorías' });
  }
});


// Ruta para actualizar una categoría existente por su ID
router.patch('/:id', async (req, res) => {
  try {
    const { nombre, descripcion, detalles, categoria, precio } = req.body;

    // Validar que 'nombre', 'detalles', 'categoria' y 'precio', si están presentes, tengan el formato correcto
    if (nombre && typeof nombre !== 'string') {
      return res.status(400).json({ error: 'Nombre debe ser una cadena de texto' });
    }
    if (detalles && typeof detalles !== 'object') {
      return res.status(400).json({ error: 'Detalles debe ser un objeto' });
    }
    if (categoria && typeof categoria !== 'string') {
      return res.status(400).json({ error: 'Categoría debe ser una cadena de texto' });
    }
    if (precio && typeof precio !== 'number') {
      return res.status(400).json({ error: 'Precio debe ser un número' });
    }

    const categoriaActualizada = await Categoria.findByIdAndUpdate(
      req.params.id,
      { nombre, descripcion, detalles, categoria, precio },
      { new: true }
    );

    if (!categoriaActualizada) {
      return res.status(404).json({ error: 'Categoría no encontrada' });
    }

    res.json(categoriaActualizada);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Error al actualizar la categoría' });
  }
});


// Ruta para eliminar una categoría por su ID
router.delete('/:id', async (req, res) => {
  console.log("ID recibido en el backend:", req.params.id);  // Depurar el valor de id en el backend
  try {
    const categoriaEliminada = await Categoria.findByIdAndDelete(req.params.id);
    if (!categoriaEliminada) {
      return res.status(404).json({ error: 'Categoría no encontrada' });
    }
    res.json({ message: 'Categoría eliminada' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar la categoría' });
  }
});


module.exports = router;
