class PaymentMediator {
    constructor(paymentService) {
      this.paymentService = paymentService;
    }
  
    async crearPaymentIntent(amount) {
      if (!amount || amount <= 0) {
        throw new Error('El monto debe ser un valor positivo');
      }
  
      return this.paymentService.createPaymentIntent(amount);
    }
  }
  module.exports = PaymentMediator;