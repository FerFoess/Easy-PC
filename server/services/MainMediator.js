const AuthMediator = require("../services/Mediators/AuthMediator");
const InventoryMediator = require("../services/Mediators/InventoryMediator");

const authMediator = new AuthMediator();
const inventoryMediator = new InventoryMediator();


class MainMediator {
  constructor({
    cartMediator,
    inventoryMediator,
    authMediator,
    paymentMediator,
    salesMediator,
    ordenesMediator,
  }) {
    this.cartMediator = cartMediator;
    this.inventoryMediator = inventoryMediator;
    this.authMediator = authMediator;
    this.paymentMediator = paymentMediator;
    this.salesMediator = salesMediator;
    this.ordenesMediator = ordenesMediator;
   
  }
  

  async notificar(emisor, evento, datos) {
    switch (evento) {
      case "agregarAlCarrito":
        return this.cartMediator.agregarAlCarrito(
          datos.usuarioId,
          datos.productoId,
          datos.cantidad
        );
      case "obtenerCarrito":
        return this.cartMediator.obtenerCarrito(datos.usuarioId);
      case "crearCarrito":
        return this.cartMediator.crearCarrito(datos.usuarioId);
      case "actualizarCantidadComponente":
        return this.cartMediator.actualizarCantidadComponente(
          datos.usuarioId,
          datos.componentId,
          datos.newQuantity
        );
      case "limpiarCarrito":
        return this.cartMediator.limpiarCarrito(datos.usuarioId);
      case "eliminarDelCarrito":
        return this.cartMediator.eliminarDelCarrito(
          datos.usuarioId,
          datos.productoId
        );

      // Eventos de Inventario
      case "obtenerProductos":
        return this.inventoryMediator.obtenerProductos();
      case "obtenerProductoPorId":
        return this.inventoryMediator.obtenerProductoPorId(datos.id);
      case "crearProducto":
        return this.inventoryMediator.crearProducto(datos);
      case "actualizarProducto":
        return this.inventoryMediator.actualizarProducto(
          datos.id,
          datos.actualizaciones
        );
      case "eliminarProducto":
        return this.inventoryMediator.eliminarProducto(datos.id);
      case "verificarStock":
        return this.inventoryMediator.verificarStock(datos.id);
      case "reservarStock":
        return this.inventoryMediator.reservarStock(datos.items);
      case "restaurarStock":
        return this.inventoryMediator.restaurarStock(datos.items);
      case "reducirStock":
        return this.inventoryMediator.reducirStock(datos.productos);

      // Eventos de auth
      case "registrarUsuario":
      case "registerUsuario":
        return this.authMediator.registerUser(datos);
      case "loginUser":
        return this.authMediator.loginUser(datos);
      case "enviarConfirmacionCompra":
        return this.authMediator.sendPurchaseConfirmation(
          datos.email,
          datos.amount
        );
      case "surtirComponente":
        return this.authMediator.surtirComponenteMediator(
          datos.id,
          datos.nombre,
          datos.categoria,
          datos.cantidad,
          datos.correoProveedor
        );
      case "actualizarEstadoComponente":
        return this.authMediator.actualizarEstadoComponente(datos.id);

      case "verificarStock":
        return this.authMediator.verificarStock(datos.id);

      // Eventos de Pagos
      case "crearPaymentIntent":
        return this.paymentMediator.crearPaymentIntent(datos.amount);

      // Eventos de Ventas
      case "obtenerVentas":
        return this.salesMediator.obtenerVentas();
      case "obtenerVentaPorId":
        return this.salesMediator.obtenerVentaPorId(datos.idVenta);
      case "crearVenta":
        return this.salesMediator.crearVenta(
          datos.idUsuario,
          datos.total,
          datos.productos,
          datos.fecha
        );
      //Ordenes
      case "crearOrden":
        return this.ordenesMediator.crearOrden(datos);
      case "obtenerOrdenes":
        return this.ordenesMediator.obtenerOrdenes();
      case "actualizarEstadoOrden":
        return this.ordenesMediator.actualizarEstadoOrden(datos);
      case "eliminarOrden":
        return this.ordenesMediator.eliminarOrden(datos);

      default:
        console.log("Evento no manejado: ${evento}");
    }
  }
}

module.exports = MainMediator;