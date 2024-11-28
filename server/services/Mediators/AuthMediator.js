class AuthMediator {
  constructor(authService) {
    this.authService = authService;
  }

  async registrarUsuario(datos) {
    return this.authService.registerUser(
      datos.firstName,
      datos.lastName,
      datos.email,
      datos.phone,
      datos.age,
      datos.password
    );
  }

  async loginUser(username, password) {
    return this.authService.loginUser(username, password);
  }

  async sendPurchaseConfirmation(email, amount) {
    return this.authService.sendPurchaseConfirmation(email, amount);
  }
  // Función modificada para manejar la solicitud de surtir un componente
  async surtirComponenteMediator(id,nombre, categoria, cantidad, correoProveedor) {
    try {
      // Llamamos al servicio para enviar el correo con la solicitud de surtido
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
