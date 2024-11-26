const Venta = require('../models/ventasSchema');
  // Lógica para crear una nueva venta
  const moment = require('moment-timezone');
class VentasService {
  // Lógica para obtener todas las ventas
  async obtenerVentas() {
    try {
      return await Venta.find();
    } catch (error) {
      throw new Error('Error al obtener las ventas');
    }
  }

  // Lógica para obtener una venta por su ID
  async obtenerVentaPorId(idVenta) {
    try {
      return await Venta.findOne({ idVenta });
    } catch (error) {
      throw new Error('Error al obtener la venta');
    }
  }



  async crearVenta(idUsuario, total, productos, fecha) {
    try {
      const fechaEnMexico = fecha
        ? moment.tz(fecha, "America/Mexico_City").toDate() // Convierte una fecha dada
        : moment.tz("America/Mexico_City").toDate(); // Toma la fecha actual en la zona horaria de México
  
      const nuevaVenta = new Venta({
        idUsuario,
        total,
        productos,
        fecha: fechaEnMexico,
      });
  
      // Asignar el _id generado como idVenta
      nuevaVenta.idVenta = nuevaVenta._id;
  
      return await nuevaVenta.save();
    } catch (error) {
      throw new Error('Error al crear la venta');
    }
  }
}

module.exports = VentasService; // Exportamos la clase
