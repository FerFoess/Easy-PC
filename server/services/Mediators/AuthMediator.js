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
  
    async iniciarSesion(username, password) {
      return this.authService.loginUser(username, password);
    }
  
    async sendPurchaseConfirmation(email, amount) {
      return this.authService.sendPurchaseConfirmation(email, amount);
    }
  }
  
  module.exports = AuthMediator;