const Venta = require('../models/ventasSchema');

// Controlador para obtener todas las ventas
exports.obtenerVentas = async (req, res) => {
  try {
    const ventas = await Venta.find();
    res.status(200).json(ventas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener las ventas' });
  }
};

// Controlador para obtener una venta por su ID (idVenta)
exports.obtenerVentaPorId = async (req, res) => {
  try {
    const venta = await Venta.findOne({ idVenta: req.params.idVenta });
    if (!venta) {
      return res.status(404).json({ error: 'Venta no encontrada' });
    }
    res.status(200).json(venta);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener la venta' });
  }
};

// Controlador para crear una nueva venta
exports.crearVenta = async (req, res) => {
  try {
    const { idVenta, idUsuario, categoría, costo, cantidad, fecha } = req.body;
    const nuevaVenta = new Venta({
      idVenta,
      idUsuario,
      categoría,
      costo,
      cantidad,
      fecha: fecha || Date.now() // Usa la fecha actual si no se proporciona
    });
    const ventaGuardada = await nuevaVenta.save();
    res.status(201).json(ventaGuardada);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Error al crear la venta' });
  }
};

// Controlador para actualizar una venta existente
exports.actualizarVenta = async (req, res) => {
  try {
    const venta = await Venta.findOneAndUpdate({ idVenta: req.params.idVenta }, req.body, { new: true });
    if (!venta) {
      return res.status(404).json({ error: 'Venta no encontrada' });
    }
    res.status(200).json(venta);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Error al actualizar la venta' });
  }
};

// Controlador para eliminar una venta por su ID (idVenta)
exports.eliminarVenta = async (req, res) => {
  try {
    const ventaEliminada = await Venta.findOneAndDelete({ idVenta: req.params.idVenta });
    if (!ventaEliminada) {
      return res.status(404).json({ error: 'Venta no encontrada' });
    }
    res.status(200).json({ message: 'Venta eliminada' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar la venta' });
  }
};
