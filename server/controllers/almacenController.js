const mediador = require('../services/index'); // Cargar el mediador global

// Controlador para obtener todos los productos
exports.obtenerProductos = async (req, res) => {
  try {
    const productos = await mediador.notificar('almacenService', 'obtenerProductos');
    res.status(200).json(productos);
  } catch (error) {
    console.error('Error al obtener los productos:', error);
    res.status(500).json({ error: 'Error al obtener los productos' });
  }
};

// Controlador para obtener un producto por ID
exports.obtenerProductoPorId = async (req, res) => {
  try {
    const producto = await mediador.notificar('almacenService', 'obtenerProductoPorId', { id: req.params.id });
    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.status(200).json(producto);
  } catch (error) {
    console.error('Error al obtener el producto:', error);
    res.status(500).json({ error: 'Error al obtener el producto' });
  }
};

// Controlador para crear un producto
exports.crearProducto = async (req, res) => {
  try {
    const productoCreado = await mediador.notificar('almacenService', 'crearProducto', req.body);
    res.status(201).json(productoCreado);
  } catch (error) {
    console.error('Error al crear el producto:', error);
    res.status(500).json({ error: 'Error al crear el producto' });
  }
};

// Controlador para actualizar un producto
exports.actualizarProducto = async (req, res) => {
  try {
    const productoActualizado = await mediador.notificar('almacenService', 'actualizarProducto', {
      id: req.params.id,
      data: req.body,
    });
    res.status(200).json(productoActualizado);
  } catch (error) {
    console.error('Error al actualizar el producto:', error);
    res.status(500).json({ error: 'Error al actualizar el producto' });
  }
};

// Controlador para eliminar un producto
exports.eliminarProducto = async (req, res) => {
  try {
    await mediador.notificar('almacenService', 'eliminarProducto', { id: req.params.id });
    res.status(200).json({ message: 'Producto eliminado' });
  } catch (error) {
    console.error('Error al eliminar el producto:', error);
    res.status(500).json({ error: 'Error al eliminar el producto' });
  }
};

// Controlador para verificar stock y enviar alertas
exports.verificarStockYAlertar = async (req, res) => {
  try {
    await mediador.notificar('almacenService', 'verificarStock', { id: req.params.id });
    res.status(200).json({ message: 'Verificación de stock realizada' });
  } catch (error) {
    console.error('Error al verificar el stock:', error);
    res.status(500).json({ error: 'Error al verificar el stock' });
  }
};

// Controlador para reservar stock
exports.reservarStock = async (req, res) => {
  try {
    const { items } = req.body;
    const resultado = await mediador.notificar('almacenService', 'reservarStock', { items });
    if (resultado.error) {
      return res.status(400).json({ error: resultado.error });
    }
    res.status(200).json({
      message: 'Stock reservado exitosamente',
      detalles: resultado,
    });
  } catch (error) {
    console.error('Error al reservar el stock:', error);
    res.status(500).json({ error: 'Error interno al reservar el stock' });
  }
};

// Controlador para cancelar la compra y restaurar el stock
exports.cancelarCompra = async (req, res) => {
  try {
    const { items } = req.body;
    await mediador.notificar('almacenService', 'restaurarStock', { items });
    res.status(200).json({ message: 'Reserva cancelada' });
  } catch (error) {
    console.error('Error al cancelar la compra:', error);
    res.status(500).json({ error: 'Error al cancelar la compra y restaurar el stock' });
  }
};

// Controlador para reducir el stock
exports.reducirStocks = async (req, res) => {
  try {
    const { productos } = req.body;
    const resultado = await mediador.notificar('almacenService', 'reducirStock', { productos });
    if (resultado.error) {
      return res.status(400).json({ error: resultado.error });
    }
    res.status(200).json({
      message: 'Stock actualizado correctamente',
      productosActualizados: resultado,
    });
  } catch (error) {
    console.error('Error al reducir el stock:', error);
    res.status(500).json({ error: 'Error al reducir el stock' });
  }
};
