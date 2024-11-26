class Mediador {
  
  constructor() {
    this.servicios = {};

  }
  

  registrarServicio(nombre, instancia) {
    this.servicios[nombre] = instancia;
  }
  

  async notificar(emisor, evento, datos) {
    switch (evento) {
      // Carrito
      case "agregarAlCarrito":
        return await this._manejarAgregarAlCarrito(emisor, datos);
        break;
      case "eliminarDelCarrito":
        return await this._manejarEliminarDelCarrito(emisor, datos);
        break;
      case "obtenerCarrito":
        return await this._manejarObtenerCarrito(emisor, datos);
        break;
      case "crearCarrito":
        return await this._manejarCrearCarrito(emisor, datos);
      case "actualizarCantidadComponente":
        return await this._manejarActualizarCantidadComponente(emisor, datos);
      case "limpiarCarrito":
        return await this._manejarLimpiarCarrito(emisor, datos);
      case "actualizarTotalCarrito":
        return await this._manejarActualizarTotalCarrito(emisor, datos);

      // Almacén
      case "obtenerProductos":
        return await this._manejarObtenerProductos(emisor, datos);
      case "obtenerProductoPorId":
        return await this._manejarObtenerProductoPorId(emisor, datos);
      case "crearProducto":
        return await this._manejarCrearProducto(emisor, datos);
      case "actualizarProducto":
        return await this._manejarActualizarProducto(emisor, datos);
      case "eliminarProducto":
        return await this._manejarEliminarProducto(emisor, datos);
      case "verificarStock":
        return await this._manejarVerificarStock(emisor, datos);
      case "reservarStock":
        return await this._manejarReservarStock(emisor, datos);
      case "restaurarStock":
        return await this._manejarRestaurarStock(emisor, datos);
      case "reducirStock":
        return await this._manejarReducirStock(emisor, datos);

      // Autenticación
      case "registerUser":
        await this._manejarRegistroUsuario(emisor, datos);
        break;
      case "loginUser":
       return await this._manejarInicioSesion(emisor, datos);
        break;
      case "sendPurchaseConfirmation":
        await this._manejarEnviarConfirmacionCompra(emisor, datos);
        break;

      // Notificaciones
      case "crearAlerta":
        await this._manejarCrearAlerta(emisor, datos);
        break;
      case "obtenerAlertas":
        await this._manejarObtenerAlertas(emisor, datos);
        break;

      // Pago
      case 'crearPaymentIntent':
    return await this._manejarCrearPaymentIntent(emisor, datos);


//Ventas
case 'obtenerVentas':
    return await this._manejarObtenerVentas(emisor, datos);
case 'obtenerVentaPorId':
    return await this._manejarObtenerVentaPorId(emisor, datos);
case 'crearVenta':
    return await this._manejarCrearVenta(emisor, datos);

      default:
        console.log(`Evento no manejado: ${evento}`);
    }
  }

  //Carrito
  async _manejarCrearCarrito(emisor, datos) {
    const carritoService = this.servicios["carritoService"];
    const carrito = await carritoService.createCart(datos.usuarioId);
    console.log(`Carrito creado para el usuario ${datos.usuarioId}`);
    return carrito;
  }

  async _manejarObtenerCarrito(emisor, datos) {
    const carritoService = this.servicios["carritoService"];
  
    // Verifica si el carritoService está registrado
    if (!carritoService) {
      console.error("carritoService no encontrado en los servicios");
      throw new Error("carritoService no encontrado en los servicios");
    }
  
    try {
      // Aquí obtienes el carrito usando el servicio
      const carrito = await carritoService.getCart(datos.usuarioId);
  
      if (!carrito) {
        console.error(`No se encontró el carrito para el usuario con ID ${datos.usuarioId}`);
        throw new Error(`No se encontró el carrito para el usuario con ID ${datos.usuarioId}`);
      }
  
      console.log(`Carrito obtenido para el usuario ${datos.usuarioId}`);
      console.log(`Carrito obtenido para el usuario `,carrito);
      return carrito;
    } catch (error) {
      console.error("Error al obtener el carrito:", error.message);
      throw new Error('Error al obtener el carrito');
    }
  }
  
  
  async _manejarActualizarCantidadComponente(emisor, datos) {
    const carritoService = this.servicios["carritoService"];
    const carrito = await carritoService.updateComponentQuantity(
      datos.usuarioId,
      datos.componentId,
      datos.newQuantity
    );
    console.log(
      `Cantidad del componente ${datos.componentId} actualizada a ${datos.newQuantity} en el carrito de ${datos.usuarioId}`
    );
    return carrito;
  }

  async _manejarLimpiarCarrito(emisor, datos) {
    const carritoService = this.servicios["carritoService"];
    const resultado = await carritoService.clearCart(datos.usuarioId);
    console.log(`Carrito del usuario ${datos.usuarioId} limpiado`);
    return resultado;
  }

  async _manejarActualizarTotalCarrito(emisor, datos) {
    const carritoService = this.servicios["carritoService"];
    const carrito = await carritoService.updateTotal(datos.usuarioId);
    console.log(
      `Total actualizado para el carrito del usuario ${datos.usuarioId}`
    );
    return carrito;
  }

  async _manejarAgregarAlCarrito(emisor, datos) {
    const carritoService = this.servicios["carritoService"];
    await carritoService.addComponentToCart(
      datos.usuarioId,
      datos.productoId,
      datos.cantidad
    );
    console.log(
      `Producto ${datos.productoId} agregado al carrito de ${datos.usuarioId}`
    );
  }

  async _manejarEliminarDelCarrito(emisor, datos) {
    const carritoService = this.servicios["carritoService"];
    await carritoService.removeComponentFromCart(datos.usuarioId, datos.productoId);
    console.log(
      `Producto ${datos.productoId} eliminado del carrito de ${datos.usuarioId}`
    );
  }

  async _manejarReservarStock(emisor, datos) {
    const almacenService = this.servicios["almacenService"];
    await almacenService.reservarStock(datos.productos);
    console.log("Stock reservado:", datos.productos);
  }

  async _manejarLiberarReservaStock(emisor, datos) {
    const almacenService = this.servicios["almacenService"];
    await almacenService.liberarReserva(datos.productos);
    console.log("Reserva liberada:", datos.productos);
  }

  //almacen:
   // Manejo de métodos del almacén:
   async _manejarObtenerProductos(emisor, datos) {
    const almacenService = this.servicios["almacenService"];
    const productos = await almacenService.obtenerProductos();
    console.log("Productos obtenidos:", productos);
    return productos;
  }

  async _manejarObtenerProductoPorId(emisor, datos) {
    const almacenService = this.servicios["almacenService"];
    const producto = await almacenService.obtenerProductoPorId(datos.id);
    if (!producto) {
      throw new Error(`Producto con ID ${datos.id} no encontrado`);
    }
    console.log(`Producto obtenido: ${producto.nombre}`);
    return producto;
  }

  async _manejarCrearProducto(emisor, datos) {
    const almacenService = this.servicios["almacenService"];
    const producto = await almacenService.crearProducto(datos);
    console.log(`Producto creado: ${producto.nombre}`);
    return producto;
  }

  async _manejarActualizarProducto(emisor, datos) {
    const almacenService = this.servicios["almacenService"];
    const producto = await almacenService.actualizarProducto(datos.id, datos.actualizaciones);
    console.log(`Producto actualizado: ${producto.nombre}`);
    return producto;
  }

  async _manejarEliminarProducto(emisor, datos) {
    const almacenService = this.servicios["almacenService"];
    await almacenService.eliminarProducto(datos.id);
    console.log(`Producto con ID ${datos.id} eliminado`);
  }

  async _manejarVerificarStock(emisor, datos) {
    const almacenService = this.servicios["almacenService"];
    const producto = await almacenService.verificarStockYAlertar(datos.id);
    console.log(`Stock verificado para el producto: ${producto.nombre}`);
    return producto;
  }

  async _manejarReservarStock(emisor, datos) {
    const almacenService = this.servicios["almacenService"];
    const resultado = await almacenService.reservarStock(datos.items);
    console.log("Stock reservado:", datos.items);
    return resultado;
  }

  async _manejarRestaurarStock(emisor, datos) {
    const almacenService = this.servicios["almacenService"];
    await almacenService.restaurarStock(datos.items);
    console.log("Stock restaurado para los productos:", datos.items);
  }

  async _manejarReducirStock(emisor, datos) {
    const almacenService = this.servicios["almacenService"];
    const productosActualizados = await almacenService.reducirStock(datos.productos);
    console.log("Stock reducido para los productos:", productosActualizados);
    return productosActualizados;
  }


   // auth
   async _manejarRegistroUsuario(emisor, datos) {
    const authService = this.servicios["authService"];
    const resultado = await authService.registerUser(
      datos.firstName,
      datos.lastName,
      datos.email,
      datos.phone,
      datos.age,
      datos.password
    );
    console.log("Usuario registrado:", resultado);
    return resultado;
  }

  _manejarInicioSesion = async (emisor, datos) => {
    try {
      const authService = this.servicios["authService"];
  
      if (!authService) {
        throw new Error("authService no encontrado en los servicios");
      }
  
      // Llamamos al método loginUser y esperamos el resultado
      const resultado = await authService.loginUser(datos.username, datos.password);
  
      // Retornar explícitamente el resultado desde el mediador
      if (resultado) {
        console.log("Resultado del mediador:", resultado); // Verificar el resultado devuelto
        return resultado; // Aquí devolvemos el resultado correcto
      } else {
        throw new Error("No se obtuvo un resultado válido del servicio.");
      }
    } catch (error) {
      console.error("Error al manejar el inicio de sesión:", error.message);
      throw new Error("Error al manejar el inicio de sesión: " + error.message);
    }
  };
  

  async _manejarEnviarConfirmacionCompra(emisor, datos) {
    const authService = this.servicios["authService"];
    const resultado = await authService.sendPurchaseConfirmation(
      datos.email,
      datos.amount
    );
    console.log("Confirmación de compra enviada:", resultado);
    return resultado;
  }

  //pago
  

  async _manejarCrearPaymentIntent(emisor, datos) {
    const paymentService = this.servicios['paymentService']; // Asegúrate de registrar correctamente este servicio
    const { amount } = datos;

    if (!amount || amount <= 0) {
        throw new Error('El monto debe ser un valor positivo');
    }

    const paymentIntent = await paymentService.createPaymentIntent(amount);
    console.log('Payment Intent creado:', paymentIntent.id);
    return paymentIntent;
}



//Venta
async _manejarObtenerVentas(emisor, datos) {
    const ventasService = this.servicios['ventasService'];
    const ventas = await ventasService.obtenerVentas();
    console.log('Ventas obtenidas:', ventas);
    return ventas;
}

async _manejarObtenerVentaPorId(emisor, datos) {
    const ventasService = this.servicios['ventasService'];
    const venta = await ventasService.obtenerVentaPorId(datos.idVenta);
    console.log(`Venta obtenida con ID ${datos.idVenta}:`, venta);
    return venta;
}
async _manejarCrearVenta(emisor, datos) {
    const ventasService = this.servicios['ventasService'];
    const { idUsuario, total, productos, fecha } = datos;

    if (!idUsuario || !total || !productos) {
        throw new Error('Datos incompletos para crear una venta');
    }

    const nuevaVenta = await ventasService.crearVenta(idUsuario, total, productos, fecha);
    console.log('Venta creada:', nuevaVenta);


    return nuevaVenta;
}
 
}

module.exports = Mediador;