import React, { useState, useEffect } from 'react';
import { CardElement, useStripe, useElements, Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js'; 
import axios from 'axios';
import './css/styles.css';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

// Cargar la clave pública de Stripe
const stripePromise = loadStripe('pk_test_51QCqe5G2SwsehGOdAgYJvAcnk2CLP84ThrP0lBLVu1w2B3m2OE1JZHCCrFunL0MBEoirJBUQMsdn6H7EYVFknhuO00VkqVBiwv'); 

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [amount, setAmount] = useState(0); 
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: ''
  });

  useEffect(() => {
    // Obtener el total de localStorage y actualizar el monto del pago
    const storedAmount = localStorage.getItem('totalCompra');
    if (storedAmount) {
      setAmount(parseFloat(storedAmount) * 100); // Convertir a centavos para Stripe
    }

    // Obtener datos del usuario desde el localStorage o desde el estado del formulario
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(token);
      setFormData({
        nombre: decoded.firstName || '',
        apellido: decoded.lastName || '',
        email: decoded.email || ''
      });
    }
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsProcessing(true);

    const cardElement = elements.getElement(CardElement);

    try {
      console.log("Attempting payment...");

      // Solicitar el Payment Intent al backend
      const { data: { clientSecret } } = await axios.post('http://localhost:3002/payments/create-payment-intent', {
        amount, // Usar el estado para el monto
      });

      console.log("Received clientSecret:", clientSecret);

      // Confirmar el pago usando el clientSecret devuelto
      const paymentResult = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: `${formData.nombre} ${formData.apellido}`,
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

        // Enviar correo con la información de la compra
        await axios.post('http://localhost:3002/auth/send-payment-confirmation', {
          email: formData.email,
          amount,
        });

        // Limpiar el localStorage
        localStorage.removeItem('totalCompra');
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
        <div>
          <h3>¡Pago exitoso!</h3>
          <p>Los datos de envío han sido enviados al correo proporcionado.</p>
          <button onClick={() => window.location.href = '/inicio'} className="submit-button">
            Regresar a Inicio
          </button>
        </div>
      ) : (
        <>
          <p>Por favor indique su tarjeta para el pago correspondiente</p>
          <p>Monto total a pagar: <strong>${(amount / 100).toFixed(2)} MXN</strong></p> {/* Mostrar el monto en la interfaz */}
          <form onSubmit={handleSubmit}>
            <CardElement className="card-element" />
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
  const navigate = useNavigate();

  // Estilos del navbar
  const navbarStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.5rem 2rem',
    backgroundColor: '#1e1f2b',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
    width: '100%',
  };

  const logoImageStyle = {
    width: '90px',
    height: '90px',
    borderRadius: '50%',
  };

  const navButtonsStyle = {
    display: 'flex',
    gap: '1rem',
  };

  const navButtonStyle = {
    color: '#ffffff',
    backgroundColor: 'transparent',
    border: '2px solid #5c6bc0',
    padding: '0.6rem 1.2rem',
    borderRadius: '20px',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease, transform 0.2s ease',
  };

  return (
    <Elements stripe={stripePromise}>
      <div style={{ fontFamily: 'Arial, sans-serif', color: '#ffffff', backgroundColor: '#27293d', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <nav style={navbarStyle}>
          <div className="logo">
            <img src="/assets/logo.png" alt="Logo" style={logoImageStyle} />
          </div>
          <div style={navButtonsStyle}>
            <button style={navButtonStyle} onClick={() => navigate('/inicio')}>Inicio</button>
            <button style={navButtonStyle} onClick={() => navigate('/catalogo-componentes')}>Catálogo de componentes</button>
            <button style={navButtonStyle} onClick={() => navigate('/sobre-nosotros')}>Más sobre nosotros</button>
            <button style={navButtonStyle} onClick={() => navigate('/mi-cuenta')}>Mi cuenta</button>
          </div>
        </nav>
        
        <CheckoutForm />
      </div>
    </Elements>
  );
};

export default PaymentScreen;
