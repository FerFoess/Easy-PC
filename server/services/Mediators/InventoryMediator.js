class InventoryMediator {
    constructor(almacenService) {
      this.almacenService = almacenService;
    }
  
    async obtenerProductos() {
      return this.almacenService.obtenerProductos();
    }
  
    async obtenerProductoPorId(id) {
      return this.almacenService.obtenerProductoPorId(id);
    }
  
    async crearProducto(datos) {
      return this.almacenService.crearProducto(datos);
    }
  
    async actualizarProducto(id, actualizaciones) {
      return this.almacenService.actualizarProducto(id, actualizaciones);
    }
  
    async eliminarProducto(id) {
      return this.almacenService.eliminarProducto(id);
    }
  
    async verificarStock(id) {
      return this.almacenService.verificarStockYAlertar(id);
    }
  
    
    async reservarStock(items) {
      return this.almacenService.reservarStock(items);
    }
  
    async restaurarStock(items) {
      return this.almacenService.restaurarStock(items);
    }
  
    async reducirStock(productos) {
      return this.almacenService.reducirStock(productos);
    }
  }
  
  module.exports = InventoryMediator;