const AlmacenService = require('../services/almacenService');
const Mediador = require('../services/Mediador'); // Asegúrate de que esta clase exista
const mediador = new Mediador(); // Crear instancia del Mediador
const almacenService = new AlmacenService(mediador);

// Controlador para obtener todos los productos
exports.obtenerProductos = async (req, res) => {
  try {
    const productos = await almacenService.obtenerProductos();
    res.status(200).json(productos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener los productos' });
  }
};

// Controlador para obtener un producto por ID
exports.obtenerProductoPorId = async (req, res) => {
  try {
    const producto = await almacenService.obtenerProductoPorId(req.params.id);
    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.status(200).json(producto);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener el producto' });
  }
};

// Controlador para crear un producto
exports.crearProducto = async (req, res) => {
  try {
    const productoCreado = await almacenService.crearProducto(req.body);
    res.status(201).json(productoCreado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear el producto' });
  }
};

// Controlador para actualizar un producto
exports.actualizarProducto = async (req, res) => {
  try {
    const productoActualizado = await almacenService.actualizarProducto(req.params.id, req.body);
    res.status(200).json(productoActualizado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar el producto' });
  }
};

// Controlador para eliminar un producto
exports.eliminarProducto = async (req, res) => {
  try {
    const productoEliminado = await almacenService.eliminarProducto(req.params.id);
    res.status(200).json({ message: 'Producto eliminado' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar el producto' });
  }
};

// Controlador para verificar stock y enviar alertas
exports.verificarStockYAlertar = async (req, res) => {
  try {
    const producto = await almacenService.verificarStockYAlertar(req.params.id);
    res.status(200).json({ message: 'Verificación de stock realizada' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al verificar el stock' });
  }
};

// Controlador para reservar stock
exports.reservarStock = async (req, res) => {

  try {
    const { items } = req.body; // Recibimos los productos y sus cantidades
    const resultado = await almacenService.reservarStock(items);
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
    await almacenService.restaurarStock(items); 

    // Responder con éxito
    res.status(200).json({ message: 'Reserva cancelada' });
  } catch (error) {
    console.error('Error al cancelar la compra:', error);
    res.status(500).json({ error: 'Error al cancelar la compra y restaurar el stock' });
  }
};

