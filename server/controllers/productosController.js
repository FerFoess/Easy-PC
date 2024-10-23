const Producto = require('../models/productosSchema');

// Controlador para obtener todos los productos
exports.obtenerProductos = async (req, res) => {
  try {
    const productos = await Producto.find().populate('categoria proveedor');
    res.status(200).json(productos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener los productos' });
  }
};

// Controlador para obtener un producto por su ID
exports.obtenerProductoPorId = async (req, res) => {
  try {
    const producto = await Producto.findById(req.params.id).populate('categoria proveedor');
    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.status(200).json(producto);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener el producto' });
  }
};

// Controlador para crear un nuevo producto
exports.crearProducto = async (req, res) => {
  try {
    const { nombre, categoria, descripcion, precio_unitario, cantidad_disponible, proveedor, estado } = req.body;
    const nuevoProducto = new Producto({
      nombre,
      categoria,
      descripcion,
      precio_unitario,
      cantidad_disponible,
      estado
    });
    const productoGuardado = await nuevoProducto.save();
    res.status(201).json(productoGuardado);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Error al crear el producto' });
  }
};

// Controlador para actualizar un producto existente
exports.actualizarProducto = async (req, res) => {
  try {
    const producto = await Producto.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('categoria proveedor');
    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.status(200).json(producto);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Error al actualizar el producto' });
  }
};

// Controlador para eliminar un producto por su ID
exports.eliminarProducto = async (req, res) => {
  try {
    const productoEliminado = await Producto.findByIdAndDelete(req.params.id);
    if (!productoEliminado) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.status(200).json({ message: 'Producto eliminado' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar el producto' });
  }
};
