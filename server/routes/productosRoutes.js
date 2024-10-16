const express = require("express");
const router = express.Router();
const Producto = require("../models/productosSchema");

// Ruta para obtener todos los productos
router.get("/", async (req, res) => {
  try {
    const productos = await Producto.find().populate('categoria');
    res.json(productos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener los productos" });
  }
});

// Ruta para crear un nuevo producto
router.post("/", async (req, res) => {
  try {
    const nuevoProducto = new Producto(req.body);
    await nuevoProducto.save();
    res.status(201).json(nuevoProducto);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Error al crear un nuevo producto" });
  }
});

// Ruta para obtener un producto por su ID
// En tu archivo de rutas de productos
router.get("/todos", async (req, res) => {
  try {
    const productos = await Producto.find()
      .populate('categoria proveedor'); // Asegúrate de que 'proveedor' esté en el esquema
    res.json(productos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener los productos" });
  }
});

// Ruta para actualizar un producto existente por su ID
router.patch("/:id", async (req, res) => {
  try {
    const productoActualizado = await Producto.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }  // Asegura que las validaciones se ejecuten
    ).populate('categoria');
    
    if (!productoActualizado) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    res.json(productoActualizado);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Error al actualizar el producto" });
  }
});

// Ruta para eliminar un producto por su ID
router.delete("/:id", async (req, res) => {
  try {
    const productoEliminado = await Producto.findByIdAndDelete(req.params.id);
    if (!productoEliminado) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    res.json({ message: "Producto eliminado" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al eliminar el producto" });
  }
});

module.exports = router;
