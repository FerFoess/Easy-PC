class AuthMediator {
  constructor(authService) {
    this.authService = authService;
  }

  async notificar( evento, datos) {
    console.log(`🔍 Evento recibido en AuthMediator: '${evento}'`);

    try {
      switch (evento) {
        case 'registrarUsuario':
          return await this.registerUser(datos);
        case 'loginUser':
        case 'iniciarSesion':
          return this.authService.loginUser(datos);
        case 'sendPurchaseConfirmation':
        case 'enviarConfirmacionCompra':
          return await this.sendPurchaseConfirmation(datos.email, datos.amount);
        case 'surtirComponente':
          return await this.surtirComponenteMediator(
            datos.id,
            datos.nombre,
            datos.categoria,
            datos.cantidad,
            datos.correoProveedor
          );
        case 'verificarStock':
          return await this.verificarStock(datos.id);
        default:
          throw new Error(`Evento no manejado: ${evento}`);
      }
    } catch (error) {
      console.error(`Error en el mediador para el evento ${evento}:`, error);
      throw error;
    }
  }

  // Métodos específicos (pueden mantenerse como están o ser privados)
  async registerUser(datos) {
    return this.authService.registerUser(
      datos.firstName,
      datos.lastName,
      datos.email,
      datos.phone,
      datos.age,
      datos.password
    );
  }

  async loginUser(datos) {
    return this.authService.loginUser(datos.username, datos.password);
}


  async sendPurchaseConfirmation(email, amount) {
    return this.authService.sendPurchaseConfirmation(email, amount);
  }

  async surtirComponenteMediator(id, nombre, categoria, cantidad, correoProveedor) {
    try {
      return await this.authService.surtirComponente(
        id,
        nombre,
        categoria,
        cantidad,
        correoProveedor
      );
    } catch (error) {
      console.error("Error en la función pedidoAlProveedor:", error);
      throw new Error("Error al procesar la solicitud de surtido");
    }
  }

  async actualizarEstadoComponente(id) {
    return this.authService.sendPurchaseConfirmation(id);
  }

  async verificarStock(id) {
    return this.authService.verificarStock(id);
  }
}

module.exports = AuthMediator;