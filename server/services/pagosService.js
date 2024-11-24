const stripe = require('stripe')('sk_test_51QCqe5G2SwsehGOd94jUKqaRqH7LeO6alWoy8pUC2mfgjG3QlfDkBkdmHcFndGeGBtcvQg6zWrRKKbLxnbMAYQRL004HCUSsa0');

class PaymentService {

    async createPaymentIntent (amount) {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'mxn',
    });
    return paymentIntent;
  } catch (error) {
    console.error("Error en el servicio de pagos:", error.message);
    throw new Error('Error al crear el Payment Intent');
  }
};

}

module.exports = PaymentService;
