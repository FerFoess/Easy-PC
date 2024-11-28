// routes/ordenes.js
const express = require("express");
const router = express.Router();
const {
  crearOrden,
  obtenerOrdenes,
  actualizarEstadoOrden,
  eliminarOrden,
} = require("../controllers/ordenesController");

// Crear una nueva orden
router.post("/", crearOrden);

// Obtener todas las órdenes (Pendiente/En Proceso)
router.get("/", obtenerOrdenes);

// Actualizar el estado de una orden
router.put("/:id", actualizarEstadoOrden);

// Eliminar una orden
router.delete("/:id", eliminarOrden);

module.exports = router;
