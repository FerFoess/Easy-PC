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
router.post('/', upload.single('imagen'), async (req, res) => {
  try {
    const { nombre, descripcion, especificaciones, categoria, precio, tipo, proposito, stock } = req.body;

    // Convertir especificaciones a un objeto si es necesario
    let especificacionesParsed = {};
    try {
      especificacionesParsed = JSON.parse(especificaciones);
    } catch (error) {
      return res.status(400).json({ error: 'Las especificaciones deben ser un objeto válido' });
    }

    // Validaciones
    if (!nombre || !categoria || !precio || !especificacionesParsed || !tipo || !proposito || stock === undefined) {
      return res.status(400).json({ error: 'Nombre, categoría, precio, especificaciones, tipo, propósito y stock son obligatorios' });
    }

    // Crear un nuevo producto
    let nuevaCategoria = {
      nombre,
      descripcion,
      categoria,
      precio,
      especificaciones: new Map(Object.entries(especificacionesParsed)), // Convertir a Map
      tipo,
      proposito,
      stock,
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


// Ruta para obtener todas las categorías
router.get('/', async (req, res) => {
  try {
    const categorias = await Categoria.find();
    res.json(categorias); // Devuelve todas las categorías con la estructura actualizada
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener las categorías' });
  }
});

// Ruta para obtener una categoría por su ID
router.get('/:id', async (req, res) => {
  try {
    const categoria = await Categoria.findById(req.params.id);
    if (!categoria) {
      return res.status(404).json({ error: 'Categoría no encontrada' });
    }
    res.json(categoria);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener la categoría' });
  }
});

// Ruta para actualizar una categoría existente por su ID
router.patch('/:id', upload.single('imagen'), async (req, res) => {
  try {
    const { nombre, descripcion, especificaciones, categoria, precio, tipo, proposito, stock } = req.body;

    // Validación de los campos recibidos
    if (nombre && typeof nombre !== 'string') {
      return res.status(400).json({ error: 'Nombre debe ser una cadena de texto' });
    }
    if (especificaciones && typeof especificaciones !== 'object') {
      return res.status(400).json({ error: 'Especificaciones debe ser un objeto' });
    }
    if (categoria && typeof categoria !== 'string') {
      return res.status(400).json({ error: 'Categoría debe ser una cadena de texto' });
    }
    if (precio && typeof precio !== 'number') {
      return res.status(400).json({ error: 'Precio debe ser un número' });
    }
    if (tipo && typeof tipo !== 'string') {
      return res.status(400).json({ error: 'Tipo debe ser una cadena de texto' });
    }
    if (proposito && typeof proposito !== 'string') {
      return res.status(400).json({ error: 'Propósito debe ser una cadena de texto' });
    }
    if (stock && typeof stock !== 'number') {
      return res.status(400).json({ error: 'Stock debe ser un número' });
    }

    // Crear un objeto para actualizar, solo si los campos han sido proporcionados
    const categoriaActualizada = {
      nombre,
      descripcion,
      categoria,
      precio,
      especificaciones: especificaciones ? new Map(Object.entries(especificaciones)) : undefined, // Convertir a Map si especificaciones existe
      tipo,
      proposito,
      stock, // Actualiza el campo de stock
    };

    // Si se sube una nueva imagen, se reemplaza la anterior
    if (req.file) {
      categoriaActualizada.imagen = req.file.path; // Asigna la nueva imagen
    }

    // Actualizar la categoría en la base de datos
    const updatedCategory = await Categoria.findByIdAndUpdate(
      req.params.id, // Usamos el ID de la categoría para encontrarla
      categoriaActualizada, // Los datos a actualizar
      { new: true } // Devuelve el documento actualizado
    );

    // Si la categoría no se encuentra, devolvemos un error
    if (!updatedCategory) {
      return res.status(404).json({ error: 'Categoría no encontrada' });
    }

    // Devolvemos la categoría actualizada
    res.json(updatedCategory);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Error al actualizar la categoría' });
  }
});

// Ruta para eliminar una categoría por su ID
router.delete('/:id', async (req, res) => {
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
