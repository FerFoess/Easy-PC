const stripe = require('stripe')('sk_test_51QCqe5G2SwsehGOd94jUKqaRqH7LeO6alWoy8pUC2mfgjG3QlfDkBkdmHcFndGeGBtcvQg6zWrRKKbLxnbMAYQRL004HCUSsa0');
exports.createPaymentIntent = async (req, res) => {
  const { amount } = req.body;

    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount * 100, 
        currency: 'mxn', 
      });
  
      res.send({
        clientSecret: paymentIntent.client_secret,
      });
    } catch (error) {
      console.error("Error en createPaymentIntent:", error.message); 
      res.status(500).send({ error: error.message }); 
    }
  };
  
