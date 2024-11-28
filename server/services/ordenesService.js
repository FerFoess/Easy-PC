// services/ordenesService.js
const Orden = require("../models/orderSchema");

class OrdenesService {
  constructor(mediador) {
    this.mediador = mediador; 
  }

  async crearOrden({ productoId, nombre, categoria, cantidad, correoProveedor }) {
    try {
      const nuevaOrden = new Orden({ productoId, nombre, categoria, cantidad, correoProveedor });
      await nuevaOrden.save();
      return nuevaOrden;
    } catch (error) {
      console.error("Error al crear la orden:", error);
      throw new Error("Hubo un error al crear la orden.");
    }
  }

  // Obtener órdenes con estado 'Pendiente' o 'En Proceso'
  async obtenerOrdenes() {
    try {
      const ordenes = await Orden.find({
        estado: { $in: ["Pendiente", "En Proceso", "Terminada"] },
      });
      return ordenes;
    } catch (error) {
      console.error("Error al obtener las órdenes:", error);
      throw new Error("Hubo un error al obtener las órdenes.");
    }
  }

 // Actualizar el estado de una orden
async actualizarEstadoOrden({ id, estado }) {
  try {
    let updateData = { estado };

    // Si el estado es "Terminada", agregar la fecha de finalización
    if (estado === "Terminada") {
      updateData.fechaFinalizacion = new Date();
    }

    const ordenActualizada = await Orden.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!ordenActualizada) {
      throw new Error("Orden no encontrada.");
    }

    return ordenActualizada;
  } catch (error) {
    console.error("Error al actualizar la orden:", error);
    throw new Error("Hubo un error al actualizar la orden.");
  }
}


  // Eliminar una orden
  async eliminarOrden({ id }) {
    try {
      const ordenEliminada = await Orden.findByIdAndDelete(id);
      
      if (!ordenEliminada) {
        throw new Error("Orden no encontrada.");
      }

      return { mensaje: "Orden eliminada exitosamente." };
    } catch (error) {
      console.error("Error al eliminar la orden:", error);
      throw new Error("Hubo un error al eliminar la orden.");
    }
  }
}

module.exports = OrdenesService;
