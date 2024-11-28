const OrdenesService = require('../ordenesService');

class OrdenesMediator {
  constructor() {
    this.ordenesService = new OrdenesService(); // Crear una instancia del servicio aquí
  }

  // Crear una nueva orden
  async crearOrden(datos) {
    try {
      return await this.ordenesService.crearOrden(datos); // Usar this.ordenesService
    } catch (error) {
      console.error("Error al crear la orden en ordenesMediator:", error);
      throw new Error("Hubo un error al crear la orden.");
    }
  }

  // Obtener órdenes con estado 'Pendiente' o 'En Proceso'
  async obtenerOrdenes() {
    try {
      return await this.ordenesService.obtenerOrdenes(); // Usar this.ordenesService
    } catch (error) {
      console.error("Error al obtener las órdenes en ordenesMediator:", error);
      throw new Error("Hubo un error al obtener las órdenes.");
    }
  }

  // Actualizar el estado de una orden
  async actualizarEstadoOrden(datos) {
    try {
      return await this.ordenesService.actualizarEstadoOrden(datos); // Usar this.ordenesService
    } catch (error) {
      console.error("Error al actualizar el estado de la orden en ordenesMediator:", error);
      throw new Error("Hubo un error al actualizar la orden.");
    }
  }

  // Eliminar una orden
  async eliminarOrden(datos) {
    try {
      return await this.ordenesService.eliminarOrden(datos); // Usar this.ordenesService
    } catch (error) {
      console.error("Error al eliminar la orden en ordenesMediator:", error);
      throw new Error("Hubo un error al eliminar la orden.");
    }
  }
}

module.exports = OrdenesMediator;
