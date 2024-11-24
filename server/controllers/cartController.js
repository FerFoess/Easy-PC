// En controllers/cartController.js
const CarritoService = require('../services/CarritoService');  // Importa la clase
const carritoService = new CarritoService();  // Instancia la clase

// Ahora usa carritoService en lugar de CartService
const getCart = async (req, res) => {
  const userId = req.params.userId;
  console.log("userId recibido:", userId);

  try {
    const cart = await carritoService.getCart(userId);  // Usa la instancia
    res.json({ 
      _id: cart._id,  // Enviamos el ID del carrito
      cartItems: cart.items 
    });
  } catch (error) {
    console.error("Error al obtener el carrito:", error);
    res.status(500).json({ message: 'Error al obtener el carrito' });
  }
};

// Crear un carrito nuevo
const createCart = async (req, res) => {
  const userId = req.params.userId;
  try {
    const cart = await carritoService.createCart(userId);  // Llamamos al servicio
    res.status(201).json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear el carrito' });
  }
};

// Agregar un componente al carrito
const addComponentToCart = async (req, res) => {
  const { userId } = req.params;
  const { componentId } = req.body;
  try {
    const cart = await carritoService.addComponentToCart(userId, componentId);  // Llamamos al servicio
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Error al agregar el producto al carrito' });
  }
};

// Eliminar un componente del carrito
const removeComponentFromCart = async (req, res) => {
  const { userId } = req.params;
  const { componentId } = req.body;
  try {
    const cart = await carritoService.removeComponentFromCart(userId, componentId);  // Llamamos al servicio
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el producto del carrito' });
  }
};

// Actualizar la cantidad de un componente en el carrito
const updateComponentQuantity = async (req, res) => {
  const { userId } = req.params;
  const { componentId, newQuantity } = req.body;
  try {
    const cart = await carritoService.updateComponentQuantity(userId, componentId, newQuantity);  // Llamamos al servicio
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar la cantidad del componente' });
  }
};

// Limpiar el carrito
const clearCart = async (req, res) => {
  const { userId } = req.params;
  
  try {
    await carritoService.clearCart(userId);  // Llamamos al servicio
    res.status(200).json({ message: 'Carrito eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el carrito' });
  }
};

// Actualizar el total del carrito
const updateTotal = async (req, res) => {
  const { userId } = req.params;
  const { total } = req.body;
  try {
    const cart = await carritoService.updateTotal(userId, total);  // Llamamos al servicio
    res.status(200).json(cart);
  } catch (error) {
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
  updateTotal 
};
