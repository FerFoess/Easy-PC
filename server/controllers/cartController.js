const mediador = require('../services/index'); 

// Obtener el carrito de un usuario
const getCart = async (req, res) => {
  const userId = req.params.userId;
  console.log("userId recibido:", userId);

  try {
    // Solicitar el carrito al mediador
    const cart = await mediador.notificar("cartController", "obtenerCarrito", { usuarioId: userId });
    
    // Verificar que el carrito existe y tiene los datos esperados
    if (!cart || !cart._id) {
      return res.status(404).json({ message: 'Carrito no encontrado' });
    }

    // Si todo está bien, responder con el carrito
    res.json({
      _id: cart._id,  // ID del carrito
      cartItems: cart.items,  // Items del carrito
    });
  } catch (error) {
    // Capturar y manejar cualquier error
    console.error("Error al obtener el carrito:", error);
    res.status(500).json({ message: 'Error al obtener el carrito' });
  }
};

// Crear un carrito nuevo
const createCart = async (req, res) => {
  const userId = req.params.userId;
  try {
    const cart = await mediador.notificar("cartController", "crearCarrito", { usuarioId: userId });
    res.status(201).json(cart);
  } catch (error) {
    console.error("Error al crear el carrito:", error);
    res.status(500).json({ message: 'Error al crear el carrito' });
  }
};

// Agregar un componente al carrito
const addComponentToCart = async (req, res) => {
  const { userId } = req.params;
  const { componentId } = req.body;
  try {
    const cart = await mediador.notificar("cartController", "agregarAlCarrito", {
      usuarioId: userId,
      productoId: componentId,
      cantidad: 1, // Asumiendo cantidad predeterminada de 1
    });
    res.status(200).json(cart);
  } catch (error) {
    console.error("Error al agregar el producto al carrito:", error);
    res.status(500).json({ message: 'Error al agregar el producto al carrito' });
  }
};

// Eliminar un componente del carrito
const removeComponentFromCart = async (req, res) => {
  const { userId } = req.params;
  const { componentId } = req.body;
  try {
    const cart = await mediador.notificar("cartController", "eliminarDelCarrito", {
      usuarioId: userId,
      productoId: componentId,
    });
    res.status(200).json(cart);
  } catch (error) {
    console.error("Error al eliminar el producto del carrito:", error);
    res.status(500).json({ message: 'Error al eliminar el producto del carrito' });
  }
};

// Actualizar la cantidad de un componente en el carrito
const updateComponentQuantity = async (req, res) => {
  const { userId } = req.params;
  const { componentId, newQuantity } = req.body;
  try {
    const cart = await mediador.notificar("cartController", "actualizarCantidadComponente", {
      usuarioId: userId,
      componentId,
      newQuantity,
    });
    res.status(200).json(cart);
  } catch (error) {
    console.error("Error al actualizar la cantidad del componente:", error);
    res.status(500).json({ message: 'Error al actualizar la cantidad del componente' });
  }
};

// Limpiar el carrito
const clearCart = async (req, res) => {
  const { userId } = req.params;
  try {
    await mediador.notificar("cartController", "limpiarCarrito", { usuarioId: userId });
    res.status(200).json({ message: 'Carrito eliminado exitosamente' });
  } catch (error) {
    console.error("Error al limpiar el carrito:", error);
    res.status(500).json({ message: 'Error al eliminar el carrito' });
  }
};

// Actualizar el total del carrito
const updateTotal = async (req, res) => {
  const { userId } = req.params;
  try {
    const cart = await mediador.notificar("cartController", "actualizarTotalCarrito", { usuarioId: userId });
    res.status(200).json(cart);
  } catch (error) {
    console.error("Error al actualizar el total:", error);
    res.status(500).json({ message: 'Error al actualizar el total' });
  }
};

module.exports = {
  getCart,
  createCart,
  addComponentToCart,
  removeComponentFromCart,
  updateComponentQuantity,
  clearCart,
  updateTotal,
};
