class CartMediator {
  constructor(carritoService) {
    this.carritoService = carritoService;
  }

  async crearCarrito(usuarioId) {
    return this.carritoService.createCart(usuarioId);
  }

  async obtenerCarrito(usuarioId) {
    return this.carritoService.getCart(usuarioId);
  }

  async actualizarCantidadComponente(usuarioId, componentId, newQuantity) {
    return this.carritoService.updateComponentQuantity(usuarioId, componentId, newQuantity);
  }

  async limpiarCarrito(usuarioId) {
    return this.carritoService.clearCart(usuarioId);
  }

  async agregarAlCarrito(usuarioId, productoId, cantidad) {
    return this.carritoService.addComponentToCart(usuarioId, productoId, cantidad);
  }

  async eliminarDelCarrito(usuarioId, productoId) {
    return this.carritoService.removeComponentFromCart(usuarioId, productoId);
  }

  async actualizarTotal(usuarioId) {
    return this.carritoService.updateTotal(usuarioId);
  }
}

module.exports = CartMediator;
