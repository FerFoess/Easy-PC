const Cart = require('../models/Cart');

const getCart = async (req, res) => {
  const userId = req.params.userId;  // Usamos userId de los parámetros de la URL

  try {
    let cart = await Cart.findOne({ userId });

    // Si el carrito no existe, creamos uno vacío
    if (!cart) {
      cart = new Cart({ userId, items: [] }); // Crea un carrito vacío
      await cart.save(); // Guarda el carrito vacío
    }

    // Responder con cartItems y el _id del carrito
    res.json({ 
      _id: cart._id,  // Enviamos el ID del carrito
      cartItems: cart.items 
    });
  } catch (error) {
    console.error('Error al obtener el carrito:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};


// Crear un carrito para el usuario
const createCart = async (req, res) => {
  const userId = req.params.userId;  // Usamos userId de los parámetros de la URL

  try {
    // Verificar si el usuario ya tiene un carrito activo
    let cart = await Cart.findOne({ userId, status: 'active' });
    if (cart) {
      return res.status(400).json({ message: 'Ya tienes un carrito activo' });
    }

    // Crear un nuevo carrito para el usuario
    cart = new Cart({ userId, status: 'active' });
    await cart.save();

    res.status(201).json({ message: 'Carrito creado', cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear el carrito' });
  }
};

const addComponentToCart = async (req, res) => {
  const { userId } = req.params;
  const { componentId } = req.body;

  try {
    // Buscar el carrito del usuario
    let cart = await Cart.findOne({ userId });

    // Si no existe el carrito, crearlo
    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    // Verificar si el componente ya está en el carrito
    const existingItem = cart.items.find(
      item => item.componentId.toString() === componentId.toString()
    );

    if (existingItem) {
      existingItem.quantity += 1;  // Aumentar la cantidad
    } else {
      // Convertir componentId a String antes de guardarlo
      cart.items.push({ componentId: componentId.toString() });
    }

    await cart.save(); 
    res.status(200).send({ message: 'Producto agregado al carrito' });

  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error al agregar producto al carrito' });
  }
};



// Eliminar un componente del carrito
const removeComponentFromCart = async (req, res) => {
  try {
    const { componentId } = req.body; // Recibe el `componentId`
    console.log(componentId);
    const userId = req.params.userId;

    // Buscar el carrito del usuario
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: 'Carrito no encontrado' });
    }

    // Eliminar el componente del carrito
    const updatedItems = cart.items.filter(item => item.componentId.toString() !== componentId);

    // Actualizar el carrito con los nuevos items
    cart.items = updatedItems;


    await cart.save();

    res.status(200).json({ message: 'Producto eliminado', cart });
  } catch (error) {
    console.error('Error al eliminar el producto:', error);
    res.status(500).json({ message: 'Error al eliminar el producto' });
  }
};


// Actualizar la cantidad de un componente en el carrito
const updateComponentQuantity = async (req, res) => {
  const userId = req.params.userId;  // Usamos userId de los parámetros de la URL
  const { componentId, newQuantity } = req.body;

  try {
    // Verificar si el carrito existe
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: 'No tienes un carrito activo' });
    }

    // Verificar si el componente está en el carrito
    const existingItem = cart.items.find(item => item.componentId === componentId);
    if (!existingItem) {
      return res.status(404).json({ message: 'El componente no está en el carrito' });
    }

    // Actualizar la cantidad del componente
    existingItem.quantity = newQuantity;

    // Recalcular el total
    cart.total = cart.items.reduce((total, item) => total + item.quantity * item.price, 0);

    // Guardar los cambios en el carrito
    const updatedCart = await cart.save();

    res.status(200).json({ message: 'Cantidad actualizada', cart: updatedCart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar la cantidad' });
  }
};


// Función para eliminar todo el carrito
const clearCart = async (req, res) => {
  const { userId } = req.params; // Obtener el userId de los parámetros de la URL

  try {
    // Eliminar el carrito del usuario por su ID
    const result = await Cart.deleteOne({ userId });

    // Si no se encuentra el carrito, respondemos con error
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Carrito no encontrado' });
    }

    // Responder con éxito
    res.status(200).json({ message: 'Carrito eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar el carrito:', error);
    res.status(500).json({ message: 'Hubo un problema al eliminar el carrito' });
  }
};

const updateTotal = async (req, res) => {
  const { userId } = req.params; // Obtener el userId de los parámetros de la URL
  const { total } = req.body; // Obtener el total del cuerpo de la solicitud

  try {
    // Buscar el carrito del usuario por su ID
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: 'Carrito no encontrado' });
    }

    // Actualizar el total en el carrito
    cart.total = total;

    // Guardar el carrito con el nuevo total
    await cart.save();

    res.status(200).json({ message: 'Total actualizado exitosamente' });
  } catch (error) {
    console.error('Error al actualizar el total:', error);
    res.status(500).json({ message: 'Hubo un problema al actualizar el total' });
  }
};

module.exports = { getCart, createCart, addComponentToCart, removeComponentFromCart, updateComponentQuantity, clearCart , updateTotal };
