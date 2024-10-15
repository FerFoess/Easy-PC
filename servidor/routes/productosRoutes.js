const express = require("express");
const router = express.Router();
const Producto = require("../models/productoSchema");

// Ruta para obtener todos los productos
router.get("/", async (req, res) => {
  try {
    const productos = await Producto.find().populate('categoria proveedor');
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
router.get("/:id", async (req, res) => {
  try {
    const producto = await Producto.findById(req.params.id).populate('categoria proveedor');
    if (!producto) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }
    res.json(producto);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener el producto" });
  }
});

// Ruta para actualizar un producto existente por su ID
router.patch("/:id", async (req, res) => {
  try {
    const productoActualizado = await Producto.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('categoria proveedor');
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
