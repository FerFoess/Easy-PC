// controllers/ordenesController.js
const mediador = require('../services/index'); // Cargar el mediador global

// Crear una nueva orden
exports.crearOrden = async (req, res) => {
  const { productoId, nombre, categoria, cantidad, correoProveedor } = req.body;

  try {
    // Usar el mediador para manejar la creación de la orden
    const result = await mediador.notificar('ordenesService', 'crearOrden', {
      productoId,
      nombre,
      categoria,
      cantidad,
      correoProveedor
    });

    res.status(201).json(result);
  } catch (error) {
    console.error("Error al crear la orden:", error);
    res.status(500).json({ error: "Hubo un error al crear la orden." });
  }
};

// Obtener órdenes con estado 'Pendiente' o 'En Proceso'
exports.obtenerOrdenes = async (req, res) => {
  try {
    // Usar el mediador para obtener las órdenes
    const result = await mediador.notificar('ordenesService', 'obtenerOrdenes', {});

    res.status(200).json(result);
  } catch (error) {
    console.error("Error al obtener las órdenes:", error);
    res.status(500).json({ error: "Hubo un error al obtener las órdenes." });
  }
};

// Actualizar el estado de una orden
exports.actualizarEstadoOrden = async (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;

  try {
    // Usar el mediador para actualizar el estado de la orden
    const result = await mediador.notificar('ordenesService', 'actualizarEstadoOrden', {
      id,
      estado
    });

    res.status(200).json(result);
  } catch (error) {
    console.error("Error al actualizar la orden:", error);
    res.status(500).json({ error: "Hubo un error al actualizar la orden." });
  }
};

// Eliminar una orden
exports.eliminarOrden = async (req, res) => {
  const { id } = req.params;

  try {
    // Usar el mediador para eliminar la orden
    const result = await mediador.notificar('ordenesService', 'eliminarOrden', { id });

    res.status(200).json(result);
  } catch (error) {
    console.error("Error al eliminar la orden:", error);
    res.status(500).json({ error: "Hubo un error al eliminar la orden." });
  }
};
