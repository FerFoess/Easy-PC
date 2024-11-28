const Components = require('../models/components');
const Alerta = require('../models/alerta');
const Prearmado = require('../models/prearmadoSchema');
class AlmacenService {
  constructor(mediador) {
    this.mediador = mediador; 
  }
  // Obtener todos los productos
  async obtenerProductos() {
    try {
      return await Components.find();
    } catch (error) {
      throw new Error('Error al obtener productos');
    }
  }

  // Obtener un producto por su ID
  async obtenerProductoPorId(id) {
    try {
      return await Components.findById(id);
    } catch (error) {
      throw new Error('Error al obtener el producto');
    }
  }

  // Crear un nuevo producto
  async crearProducto(datos) {
    try {
      const nuevoProducto = new Components(datos);
      await nuevoProducto.save();
      return nuevoProducto;
    } catch (error) {
      throw new Error('Error al crear el producto');
    }
  }

 
  async actualizarProducto(id, datos) {
    try {
      return await Components.findByIdAndUpdate(id, datos, { new: true });
    } catch (error) {
      throw new Error('Error al actualizar el producto');
    }
  }

  
  async eliminarProducto(id) {
    try {
      return await Components.findByIdAndDelete(id);
    } catch (error) {
      throw new Error('Error al eliminar el producto');
    }
  }

  
  async verificarStockYAlertar(id) {
    try {
      // Buscar el producto en ambas colecciones
      const productoComponent = await Components.findById(id);
      const productoPrearmado = await Prearmado.findById(id);
      const producto = productoComponent || productoPrearmado;
  
      if (!producto) {
        throw new Error('Producto no encontrado');
      }
  
      // Verificar el stock
      if (producto.stock <= 5 && producto.stock > 0) {
        const alertaExistente = await Alerta.findOne({
          producto: producto.nombre,
          tipo: 'advertencia',
        });
  
        // Crear alerta si no existe
        if (!alertaExistente) {
          const alerta = new Alerta({
            producto: producto.nombre,
            stock: producto.stock,
            mensaje: 'Advertencia: Stock bajo',
            tipo: 'advertencia',
          });
          // Guardar cambios
          await alerta.save();
          
        }
      }
  
      if (producto.stock === 0) {
        const alertaExistente = await Alerta.findOne({
          producto: producto.nombre,
          tipo: 'urgente',
        });
  
        // Crear alerta si no existe
        if (!alertaExistente) {
          const alerta = new Alerta({
            producto: producto.nombre,
            stock: producto.stock,
            mensaje: '¡Alerta Urgente! Producto sin stock',
            tipo: 'urgente',
          });
          await alerta.save();
        }
         // Actualizar el estado del producto
         producto.estado = 'Agotado';
         await producto.save();
      }
  
      // Retornar el producto actualizado
      return producto;
    } catch (error) {
      console.error(`Error al verificar el stock del producto con ID ${id}:`, error);
      throw new Error(`Error al verificar el stock: ${error.message}`);
    }
  }
  

  
async obtenerStock(id = null) {
  try {
    if (id) {
      
      const productoComponent = await Components.findById(id);
      const productoPrearmado = await Prearmado.findById(id);
      const producto = productoComponent || productoPrearmado;

      if (!producto) {
        return { error: `Producto con ID ${id} no encontrado` };
      }

      return { id: producto._id, nombre: producto.nombre, stock: producto.stock };
    } else {
      // Si no se proporciona un ID, obtener el stock de todos los productos
      const productosComponentes = await Components.find();
      const productosPrearmados = await Prearmado.find();

      const todosLosProductos = [...productosComponentes, ...productosPrearmados];

      return todosLosProductos.map((producto) => ({
        id: producto._id,
        nombre: producto.nombre,
        stock: producto.stock,
      }));
    }
  } catch (error) {
    throw new Error(`Error al obtener el stock: ${error.message}`);
  }
}

  // Reservar stock
  async reservarStock(items) {
  
    try {
      const resultados = [];
  
      // Iteramos sobre los productos a reservar
      for (const item of items) { 
        const productoComponent = await Components.findById(item.idProducto);
        const productoPrearmado = await Prearmado.findById(item.idProducto);
        const productoEnBase = productoComponent || productoPrearmado;

        if (!productoEnBase) {
          return { error: `Producto con ID ${item.idProducto} no encontrado` };
        }
  
        if (productoEnBase.stock < item.cantidad) {
          return { error: `Stock insuficiente para el producto ${productoEnBase.nombre}` };
        }
  
        // Reservamos el stock, restando la cantidad solicitada
        productoEnBase.stock -= item.cantidad;
        await productoEnBase.save();
  
        // Guardamos un registro de la reserva (si es necesario)
        resultados.push({
          id: productoEnBase.id,
          nombre: productoEnBase.nombre,
          cantidadReservada: item.cantidad, // Usamos 'item.cantidad'
          stockRestante: productoEnBase.stock,
        });
      }
  
      return resultados;
    } catch (error) {
      console.error("Error en reservarStock:", error);
      throw new Error('Error al reservar el stock');
    }
  }
  
// Restaurar stock de los productos reservados
async restaurarStock(items) {
  console.log("todo:",items);
  try {

      // Iteramos sobre los productos a reservar
      for (const item of items) { 
        const productoComponent = await Components.findById(item.idProducto);
        const productoPrearmado = await Prearmado.findById(item.idProducto);
        const productoEnBase = productoComponent || productoPrearmado;

        if (!productoEnBase) {
          return { error: `Producto con ID ${item.idProducto} no encontrado` };
        }
  
        if (productoEnBase.stock < item.cantidad) {
          return { error: `Stock insuficiente para el producto ${productoEnBase.nombre}` };
        }
  
        // Reservamos el stock, restando la cantidad solicitada
        productoEnBase.stock = productoEnBase.stock+item.cantidad;
        await productoEnBase.save();
      }

  } catch (error) {
    throw new Error(`Error al restaurar el stock: ${error.message}`);
  }
}





async recibirNotificacion(evento, datos) {
  if (evento === "pagoExitoso") {
    // Reducir el stock después de un pago exitoso
    await this.reservarStock(datos.productos);
  } else if (evento === "compraCancelada") {
    // Restaurar el stock después de una cancelación
    await this.restaurarStock(datos.items);
  }
}

}






module.exports = AlmacenService;
