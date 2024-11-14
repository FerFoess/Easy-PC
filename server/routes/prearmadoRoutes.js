const express = require("express");
const router = express.Router();
const Prearmado = require("../models/prearmadoSchema");

// Ruta para obtener todos los prearmados
router.get("/", async (req, res) => {
  try {
    const prearmados = await Prearmado.find();
    res.json(prearmados);
  } catch (error) {
    console.error("Error al obtener equipos pre-armados:", error);
    res.status(500).json({ error: "Error al obtener los equipos pre-armados" });
  }
});

// Ruta para crear un nuevo prearmado
router.post("/", async (req, res) => {
  try {
    const nuevoPrearmado = new Prearmado(req.body);
    await nuevoPrearmado.save();
    res.status(201).json(nuevoPrearmado);
  } catch (error) {
    console.error("Error al crear equipo pre-armado:", error);
    res.status(500).json({ error: "Error al crear el equipo pre-armado" });
  }
});

// Ruta para obtener un prearmado por su ID
router.get("/:id", async (req, res) => {
  try {
    const prearmado = await Prearmado.findById(req.params.id);
    if (!prearmado) {
      return res.status(404).json({ error: "Equipo pre-armado no encontrado" });
    }
    res.json(prearmado);
  } catch (error) {
    console.error("Error al obtener equipo pre-armado:", error);
    res.status(500).json({ error: "Error al obtener el equipo pre-armado" });
  }
});

// Ruta para actualizar un prearmado existente por su ID
router.patch("/:id", async (req, res) => {
  try {
    const prearmadoActualizado = await Prearmado.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!prearmadoActualizado) {
      return res.status(404).json({ error: "Equipo pre-armado no encontrado" });
    }
    res.json(prearmadoActualizado);
  } catch (error) {
    console.error("Error al actualizar equipo pre-armado:", error);
    res.status(400).json({ error: "Error al actualizar el equipo pre-armado" });
  }
});

// Ruta para eliminar un prearmado por su ID
router.delete("/:id", async (req, res) => {
  try {
    const prearmadoEliminado = await Prearmado.findByIdAndDelete(req.params.id);
    if (!prearmadoEliminado) {
      return res.status(404).json({ error: "Equipo pre-armado no encontrado" });
    }
    res.json({ message: "Equipo pre-armado eliminado" });
  } catch (error) {
    console.error("Error al eliminar equipo pre-armado:", error);
    res.status(500).json({ error: "Error al eliminar el equipo pre-armado" });
  }
});

module.exports = router;
