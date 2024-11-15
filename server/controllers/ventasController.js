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
exports.crearVenta = async (req, res) => {
  try {
    const { idUsuario, total, productos, fecha } = req.body;

    // Crear una nueva venta, MongoDB generará automáticamente el _id
    const nuevaVenta = new Venta({
      idUsuario,
      total,
      productos,
      fecha: fecha || Date.now(),
    });

    // Asignar el _id generado como idVenta
    nuevaVenta.idVenta = nuevaVenta._id;

    const ventaGuardada = await nuevaVenta.save();
    res.status(201).json({ message: 'Venta guardada exitosamente', venta: ventaGuardada });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Error al crear la venta' });
  }
};



