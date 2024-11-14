import React, { useState, useEffect } from "react";
import Navbar from '../inicio/Navbar.js';
import {
  CardElement,
  useStripe,
  useElements,
  Elements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import "./css/styles.css";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const stripePromise = loadStripe(
  "pk_test_51QCqe5G2SwsehGOdAgYJvAcnk2CLP84ThrP0lBLVu1w2B3m2OE1JZHCCrFunL0MBEoirJBUQMsdn6H7EYVFknhuO00VkqVBiwv"
);

const CheckoutForm = () => {

  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [amount, setAmount] = useState(0);
  const [formData, setFormData] = useState({
    userId: "",
    nombre: "",
    apellido: "",
  });
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    // Retrieve total and cart items from localStorage
    const storedAmount = localStorage.getItem("totalCompra");
    const storedCartItems = localStorage.getItem("cartItems");
    // Get email from localStorage
    if (storedAmount) setAmount(parseFloat(storedAmount) * 100); // Convert to cents

    if (storedCartItems) {
      try {
        const parsedCartItems = JSON.parse(storedCartItems);
        setCartItems(parsedCartItems);
        console.log("Cart Items:", parsedCartItems); // Log to confirm cart items are being set
      } catch (err) {
        console.error("Error parsing cart items from localStorage:", err);
      }
    } else {
      console.error("No cart items found in localStorage.");
    }

    // Get user details from localStorage token
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      setFormData({
        userId: decoded.userId || "",
        nombre: decoded.firstName || "",
        apellido: decoded.lastName || "",
      });
    }
  }, []);


  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsProcessing(true);

    const cardElement = elements.getElement(CardElement);

    try {
      const {
        data: { clientSecret },
      } = await axios.post(
        "http://localhost:3002/payments/create-payment-intent",
        {
          amount,
        }
      );

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
      } else if (paymentResult.paymentIntent.status === "succeeded") {
        setSuccess(true);
        setError(null);

        // Actualizar el stock de los productos
        await axios.post("http://localhost:3002/components/reducir-stock", {
          productos: cartItems.map((item) => ({
            idProducto: item.idProducto,
            cantidad: item.cantidad,
          })),
        });

        // Crear la venta en la base de datos
        await axios.post("http://localhost:3002/ventas/ventas", {
          idUsuario: formData.userId,
          total: amount / 100,
          productos: cartItems.map((item) => ({
            idProducto: item.idProducto,
            nombre: item.nombre,
            cantidad: item.cantidad,
            categoria: item.categoria,
            costo: item.costo,
          })),
          fecha: new Date(),
        });

        const email = localStorage.getItem("email");

        await axios.post(
          "http://localhost:3002/auth/send-payment-confirmation",
          {
            email: email, 
            amount,
          }
        );

        // Eliminar el carrito después de actualizar el stock y registrar la venta
        await axios.delete(`http://localhost:3002/cart/cart/${formData.userId}/clearCart`);

        // Limpiar localStorage
        localStorage.removeItem("totalCompra");
        localStorage.removeItem("cartItems");
        localStorage.removeItem("email");
        localStorage.removeItem("cartId");
      }
    } catch (err) {
      setError(err.message);
    }

    setIsProcessing(false);
};


  return (
    <div className="checkout-form-container">
      <h2>Pago con tarjeta</h2>
      {error && <div style={{ color: "red" }}>{error}</div>}
      {success ? (
        <div>
          <h3>¡Pago exitoso!</h3>
          <p>Los datos de envío han sido enviados al correo proporcionado.</p>
          <button
            onClick={() => (window.location.href = "/inicio")}
            className="submit-button"
          >
            Regresar a Inicio
          </button>
        </div>
      ) : (
        <>
          <p>Por favor indique su tarjeta para el pago correspondiente</p>
          <p>
            Monto total a pagar:{" "}
            <strong>${(amount / 100).toFixed(2)} MXN</strong>
          </p>
          <form onSubmit={handleSubmit}>
            <CardElement className="card-element" />
            <button
              type="submit"
              disabled={!stripe || isProcessing}
              className="submit-button"
            >
              {isProcessing ? "Procesando..." : "Pagar"}
            </button>
          </form>
        </>
      )}
    </div>
  );
};

// Main component
const PaymentScreen = () => {
  const navigate = useNavigate();

  const navbarStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0.5rem 2rem",
    backgroundColor: "#1e1f2b",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
    width: "100%",
  };

  const logoImageStyle = {
    width: "90px",
    height: "90px",
    borderRadius: "50%",
  };

  const navButtonsStyle = {
    display: "flex",
    gap: "1rem",
  };

  const navButtonStyle = {
    color: "#ffffff",
    backgroundColor: "transparent",
    border: "2px solid #5c6bc0",
    padding: "0.6rem 1.2rem",
    borderRadius: "20px",
    fontSize: "1rem",
    cursor: "pointer",
    transition: "background-color 0.3s ease, transform 0.2s ease",
  };

  return (
    <Elements stripe={stripePromise}>
      <div
        style={{
          fontFamily: "Arial, sans-serif",
          color: "#ffffff",
          backgroundColor: "#27293d",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
       <Navbar />

        <CheckoutForm />
      </div>
    </Elements>
  );
};

export default PaymentScreen;
