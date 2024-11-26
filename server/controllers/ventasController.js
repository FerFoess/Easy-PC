const mediador = require('../services/index'); // Cargar el mediador global

// Controlador para obtener todas las ventas
exports.obtenerVentas = async (req, res) => {
  try {
    const ventas = await mediador.notificar("ventasController", "obtenerVentas", {});
    res.status(200).json(ventas);
  } catch (error) {
    console.error("Error al obtener las ventas:", error);
    res.status(500).json({ error: 'Error al obtener las ventas' });
  }
};

// Controlador para obtener una venta por su ID (idVenta)
exports.obtenerVentaPorId = async (req, res) => {
  try {
    const venta = await mediador.notificar("ventasController", "obtenerVentaPorId", { idVenta: req.params.id });
    if (!venta) {
      return res.status(404).json({ error: 'Venta no encontrada' });
    }
    res.status(200).json(venta);
  } catch (error) {
    console.error("Error al obtener la venta:", error);
    res.status(500).json({ error: 'Error al obtener la venta' });
  }
};

// Controlador para crear una venta
exports.crearVenta = async (req, res) => {
  try {
    const { idUsuario, total, productos, fecha } = req.body;
    const venta = await mediador.notificar("ventasController", "crearVenta", { idUsuario, total, productos, fecha });
    res.status(201).json({ message: 'Venta guardada exitosamente', venta });
  } catch (error) {
    console.error("Error al crear la venta:", error);
    res.status(400).json({ error: 'Error al crear la venta' });
  }
};
