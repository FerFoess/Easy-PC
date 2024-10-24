import React, { useState } from 'react';
import { CardElement, useStripe, useElements, Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js'; 
import axios from 'axios';
import './css/styles.css'; // Asegúrate de que los estilos estén bien aplicados

// Cargar la clave pública de Stripe
const stripePromise = loadStripe(''); 

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [amount, setAmount] = useState(100); // Definir el monto del pago

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsProcessing(true);

    const cardElement = elements.getElement(CardElement);

    try {
      console.log("Attempting payment...");

      // Solicitar el Payment Intent al backend
      const { data: { clientSecret } } = await axios.post('http://localhost:3002/api/payments/create-payment-intent', {
        amount, // Utiliza el estado para el monto
      });

      console.log("Received clientSecret:", clientSecret);

      // Confirmar el pago usando el clientSecret devuelto
      const paymentResult = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: 'Customer Name',
          },
        },
      });

      if (paymentResult.error) {
        setError(paymentResult.error.message);
        console.log("Payment error:", paymentResult.error.message);
      } else if (paymentResult.paymentIntent.status === 'succeeded') {
        setSuccess(true);
        setError(null);
        console.log("Payment succeeded!");
      }
    } catch (err) {
      setError(err.message);
      console.log("Error:", err.message);
    }

    setIsProcessing(false);
  };

  return (
    <div className="checkout-form-container">
      <h2>Pago con tarjeta</h2>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {success ? (
        <div>¡Pago exitoso!</div>
      ) : (
        <>
          <p>Formulario de pago cargado correctamente</p>
          <p>Monto total a pagar: <strong>${amount / 100} MXN</strong></p> {/* Mostrar el monto en la interfaz */}
          <form onSubmit={handleSubmit}>
            <CardElement className="card-element" /> {/* Asegúrate de que los estilos se apliquen */}
            <button type="submit" disabled={!stripe || isProcessing} className="submit-button">
              {isProcessing ? 'Procesando...' : 'Pagar'}
            </button>
          </form>
        </>
      )}
    </div>
  );
};

// Componente principal
const PaymentScreen = () => {
  console.log("Rendering PaymentScreen");
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
};

export default PaymentScreen;
