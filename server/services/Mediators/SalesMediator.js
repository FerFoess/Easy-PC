class SalesMediator {
    constructor(ventasService) {
      this.ventasService = ventasService;
    }
  
    async obtenerVentas() {
      return this.ventasService.obtenerVentas();
    }
  
    async obtenerVentaPorId(id) {
      return this.ventasService.obtenerVentaPorId(id);
    }
  
    async crearVenta(idUsuario, total, productos, fecha) {
      if (!idUsuario || !total || !productos) {
        throw new Error('Datos incompletos para crear una venta');
      }
  
      return this.ventasService.crearVenta(idUsuario, total, productos, fecha);
    }
  }
  module.exports = SalesMediator;