import React, { useState, useEffect } from "react";
import Navbar from '../inicio/Navbar.js';
import { CardElement, useStripe, useElements, Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import "./css/styles.css";
import { jwtDecode } from "jwt-decode";

const stripePromise = loadStripe("pk_test_51QCqe5G2SwsehGOdAgYJvAcnk2CLP84ThrP0lBLVu1w2B3m2OE1JZHCCrFunL0MBEoirJBUQMsdn6H7EYVFknhuO00VkqVBiwv");

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [amount, setAmount] = useState(0);
  const [formData, setFormData] = useState({
    userId: "",
    nombre: "",
    apellido: "",
  });

  useEffect(() => {
    const storedTime = localStorage.getItem("timeLeft");
    if (storedTime) {
      setTimeLeft(parseInt(storedTime)); // Recuperar tiempo restante de localStorage
    }

    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      setFormData({
        userId: decoded.userId || "",
        nombre: decoded.firstName || "",
        apellido: decoded.lastName || "",
      });
    }

    const storedCartItems = localStorage.getItem("cartItems");
    if (storedCartItems) {
      const cart = JSON.parse(storedCartItems);
      setCartItems(cart);
      setAmount(cart.reduce((total, item) => total + item.costo * item.cantidad, 0)); // Calcular monto
    }

    const timerInterval = setInterval(() => {
      if (timeLeft > 0) {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timerInterval);
            handleCancel();
            return 0;
          }
          localStorage.setItem('timeLeft', prevTime - 1);
          return prevTime - 1;
        });
        
        localStorage.setItem("timeLeft", timeLeft - 1);
      } else {
        // Si el tiempo se acaba, cancelar la reserva
        handleCancel();
      }
    }, 1000);

    return () => clearInterval(timerInterval);

  }, [timeLeft]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsProcessing(true);

    const cardElement = elements.getElement(CardElement);

    try {
      const { data: { clientSecret } } = await axios.post(
        "http://localhost:3002/payments/create-payment-intent",
        { amount: amount * 100 }
      );

      const paymentResult = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: { name: `${formData.nombre} ${formData.apellido}` },
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

         // Verificar el stock de cada producto para generar alertas
         await Promise.all(
          cartItems.map((item) =>
            axios.post(`http://localhost:3002/catego/${item.idProducto}/verificarStock`)
          )
        );

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
        localStorage.removeItem("timeLeft");
      }
    } catch (err) {
      setError(err.message);
    }
    setIsProcessing(false);
  };

  // Cancelar la compra y restaurar el stock
  const handleCancel = async () => {
    try {
      // Obtener los datos del carrito desde el localStorage
      const cartItems = JSON.parse(localStorage.getItem("cartItems"));
      const cartId = localStorage.getItem("cartId");

      if (!cartItems || !cartId) {
        alert("No hay datos de carrito para cancelar.");
        return;
      }

      // Enviar la petición para cancelar la reserva
      const response = await axios.post("http://localhost:3002/catego/cancelar-compra", {
        cartId,
        items: cartItems.map(item => ({
          idProducto: item.idProducto,
          cantidad: item.cantidad
        })),
      });

      if (response.data.message === "Reserva cancelada") {
        alert("La reserva ha sido cancelada.");
        localStorage.removeItem("cartItems");
        localStorage.removeItem("cartId");
        localStorage.removeItem("timeLeft");
        window.location.href = "http://localhost:3000/carritoCompra";
      } else {
        alert("Error al cancelar la reserva.");
      }
    } catch (error) {
      console.error("Error al cancelar la reserva:", error);
      alert("No se pudo cancelar la reserva.");
    }
  };

  // Formatear el tiempo restante en minutos y segundos
  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className="checkout-form-container">
      <h2>Pago con tarjeta</h2>
      <p>Tiempo restante: {formatTime(timeLeft)}</p> {/* Muestra el cronómetro */}
      <p>Total a pagar: ${amount}</p> {/* Muestra el monto */}
      {error && <div style={{ color: "red" }}>{error}</div>}
      {success ? (
        <div>
          <h3>¡Pago exitoso!</h3>
          <button onClick={() => window.location.href = "/inicio"}>Regresar a Inicio</button>
        </div>
      ) : (
        <>
          <form onSubmit={handleSubmit}>
            <CardElement className="card-element" />
            <button type="submit" disabled={!stripe || isProcessing}>Pagar</button>
          </form>
          <button onClick={handleCancel}>Cancelar</button>
        </>
      )}
    </div>
  );
};

const PaymentScreen = () => {
  return (
    <Elements stripe={stripePromise}>
      <div>
        <Navbar />
        <CheckoutForm />
      </div>
    </Elements>
  );
};

export default PaymentScreen;
