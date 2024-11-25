import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import './css/datosEnvio.css'; 
import Navbar from '../inicio/Navbar.js';
import axios from "axios";

const DatosEnvio = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    direccion: '',
    ciudad: '',
    codigoPostal: '',
    email: '',
    telefono: '',
  });

  const [timeLeft, setTimeLeft] = useState(500); // 5 minutos de contador inicial

  useEffect(() => {
    // Recuperar token y rellenar datos
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(token);
      setFormData(prevData => ({
        ...prevData,
        nombre: decoded.firstName || '',
        apellido: decoded.lastName || '',
        email: decoded.email || '',
        telefono: decoded.phone || '',
      }));
    }

    // Recuperar tiempo restante del localStorage
    const storedTime = localStorage.getItem('timeLeft');
    if (storedTime) {
      setTimeLeft(parseInt(storedTime));
    }

    // Iniciar el cronómetro
    const timerInterval = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timerInterval);
          handleCancel();
          return 0;
        }
        localStorage.setItem('timeLeft', prevTime - 1);
        return prevTime - 1;
      });
      
    }, 1000);

    return () => clearInterval(timerInterval); // Limpiar intervalo al desmontar
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const allFieldsFilled = Object.values(formData).every(field => field.trim() !== '');
    if (allFieldsFilled) {
      console.log("Datos de envío:", formData);
      localStorage.setItem('email', formData.email);
      window.location.href = "http://localhost:3000/checkoutForm";
    } else {
      alert("Por favor, completa todos los campos.");
    }
  };

  const handleCancel = async () => {
    try {
      const cartItems = JSON.parse(localStorage.getItem("cartItems"));
      const cartId = localStorage.getItem("cartId");

      if (!cartItems || !cartId) {
        alert("No hay datos de carrito para cancelar.");
        return;
      }
     
      // Enviar la petición para cancelar la reserva
      const response = await axios.post("http://localhost:3002/catego/cancelar-compra", {
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

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div>
      <Navbar />
      <div className="datos-envio">
        <h2>Datos de Envío</h2>
        <p>Tiempo restante: {formatTime(timeLeft)}</p> {/* Muestra el cronómetro */}
        <form onSubmit={handleSubmit}>
          {/* Campos del formulario */}
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            placeholder="Nombre"
            required
          />
          <input
            type="text"
            name="apellido"
            value={formData.apellido}
            onChange={handleChange}
            placeholder="Apellido"
            required
          />
          <input
            type="text"
            name="direccion"
            value={formData.direccion}
            onChange={handleChange}
            placeholder="Dirección"
            required
          />
          <input
            type="text"
            name="ciudad"
            value={formData.ciudad}
            onChange={handleChange}
            placeholder="Ciudad"
            required
          />
          <input
            type="text"
            name="codigoPostal"
            value={formData.codigoPostal}
            onChange={handleChange}
            placeholder="Código Postal"
            required
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            required
          />
          <input
            type="tel"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
            placeholder="Teléfono"
            required
          />
          <button type="submit" className="btn-enviar">Enviar</button>
          <button type="button" className="btn-cancelar" onClick={handleCancel}>Cancelar</button>
        </form>
      </div>
    </div>
  );
};

export default DatosEnvio;
