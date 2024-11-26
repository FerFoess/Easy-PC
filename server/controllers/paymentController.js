const mediador = require('../services/index'); 

exports.createPaymentIntent = async (req, res) => {
  const { amount } = req.body;

  try {
    // Usa el mediador para manejar el evento
    const paymentIntent = await mediador.notificar("paymentController", "crearPaymentIntent", { amount });

    // Respuesta exitosa con el client_secret
    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("Error en createPaymentIntent:", error.message);
    res.status(500).send({ error: error.message });
  }
};
