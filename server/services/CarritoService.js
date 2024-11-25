const Cart = require('../models/Cart');

class CarritoService {
  constructor(mediador) {
    this.mediador = mediador; // Para notificar eventos si es necesario
  }

  async getCart(userId) {
    try {
      let cart = await Cart.findOne({ userId });
      if (!cart) {
        console.log("Carrito no encontrado, creando uno nuevo"); // Debugging
        cart = new Cart({ userId, items: [] });
        await cart.save();
      }
      return cart;
    } catch (error) {
      console.error("Error en getCart:", error); // Ver detalles del error
      throw new Error('Error al obtener el carrito');
    }
  }
  
  

  // Crear un nuevo carrito (si no hay uno activo)
  async createCart(userId) {
    try {
      const existingCart = await Cart.findOne({ userId, status: 'active' });
      if (existingCart) {
        throw new Error('Ya tienes un carrito activo');
      }

      const cart = new Cart({ userId, status: 'active' });
      await cart.save();
      return cart;
    } catch (error) {
      throw new Error('Error al crear el carrito');
    }
  }

  // Agregar un componente al carrito
  async addComponentToCart(userId, componentId) {
    try {
      let cart = await this.getCart(userId); // Aseguramos que exista el carrito

      const existingItem = cart.items.find(item => item.componentId.toString() === componentId.toString());
      if (existingItem) {
        existingItem.quantity += 1; // Incrementar cantidad
      } else {
        cart.items.push({ componentId: componentId.toString(), quantity: 1 }); // Agregar nuevo item
      }

      await cart.save();

      // Notificar al Mediador si es necesario
      this.mediador?.notificar(this, 'productoAgregado', { userId, componentId });
      return cart;
    } catch (error) {
      throw new Error('Error al agregar producto al carrito');
    }
  }

  // Eliminar un componente del carrito
  async removeComponentFromCart(userId, componentId) {
    try {
      const cart = await this.getCart(userId);

      cart.items = cart.items.filter(item => item.componentId.toString() !== componentId.toString());
      await cart.save();

      // Notificar al Mediador si es necesario
      this.mediador?.notificar(this, 'productoEliminado', { userId, componentId });
      return cart;
    } catch (error) {
      throw new Error('Error al eliminar producto del carrito');
    }
  }

  // Actualizar la cantidad de un componente
  async updateComponentQuantity(userId, componentId, newQuantity) {
    try {
      const cart = await this.getCart(userId);

      const existingItem = cart.items.find(item => item.componentId.toString() === componentId.toString());
      if (!existingItem) {
        throw new Error('Componente no encontrado en el carrito');
      }

      existingItem.quantity = newQuantity;
      await cart.save();

      // Notificar al Mediador si es necesario
      this.mediador?.notificar(this, 'cantidadActualizada', { userId, componentId, newQuantity });
      return cart;
    } catch (error) {
      throw new Error('Error al actualizar la cantidad del producto');
    }
  }

  // Eliminar todo el carrito
  async clearCart(userId) {
    console.log("olv",userId)
    try {
      const cart = await Cart.deleteOne({ userId });

      // Notificar al Mediador si es necesario
      this.mediador?.notificar(this, 'carritoLimpiado', { userId });
      return { message: 'Carrito eliminado exitosamente' };
    } catch (error) {
      throw new Error('Error al eliminar el carrito');
    }
  }

  // Actualizar el total del carrito
  async updateTotal(userId) {
    try {
      const cart = await this.getCart(userId);

      cart.total = cart.items.reduce((total, item) => total + (item.quantity * (item.price || 0)), 0);
      await cart.save();

      // Notificar al Mediador si es necesario
      this.mediador?.notificar(this, 'totalActualizado', { userId, total: cart.total });
      return cart;
    } catch (error) {
      throw new Error('Error al actualizar el total del carrito');
    }
  }
}

module.exports = CarritoService;
