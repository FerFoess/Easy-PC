import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import './css/datosEnvio.css'; // Asegúrate de tener estilos adecuados en este archivo

const DatosEnvio = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    direccion: '',
    ciudad: '',
    codigoPostal: '',
    email: '',
    telefono: ''
  });

  useEffect(() => {
    // Obtener el token del localStorage
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(token);
      // Llenar los datos del formulario con la información del usuario
      setFormData(prevData => ({
        ...prevData,
        nombre: decoded.firstName || '',
        apellido: decoded.lastName || '',
        email: decoded.email || '',
        telefono: decoded.phone || ''
      }));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Verificar si todos los campos están llenos
    const allFieldsFilled = Object.values(formData).every(field => field.trim() !== '');

    if (allFieldsFilled) {
      // Aquí puedes manejar el envío de los datos
      console.log("Datos de envío:", formData);
      // Redirigir a la siguiente página
      window.location.href = "http://localhost:3000/checkoutForm"; 
    } else {
      alert("Por favor, completa todos los campos."); // Mensaje de advertencia
    }
  };

  return (
    <div className="datos-envio">
      <div className="barra-proceso">
        <div className="paso activo">Seleccionar Productos</div>
        <div className="paso activo">Resumen de Compra</div>
        <div className="paso activo">Datos de Envío</div>
        <div className="paso">Realizar pago</div>
      </div>
      <h2>Datos de Envío</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="nombre">Nombre:</label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="apellido">Apellido:</label>
          <input
            type="text"
            id="apellido"
            name="apellido"
            value={formData.apellido}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="direccion">Dirección:</label>
          <input
            type="text"
            id="direccion"
            name="direccion"
            value={formData.direccion}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="ciudad">Ciudad:</label>
          <input
            type="text"
            id="ciudad"
            name="ciudad"
            value={formData.ciudad}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="codigoPostal">Código Postal:</label>
          <input
            type="text"
            id="codigoPostal"
            name="codigoPostal"
            value={formData.codigoPostal}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="telefono">Teléfono:</label>
          <input
            type="tel"
            id="telefono"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn-enviar">Enviar</button>
      </form>
    </div>
  );
};

export default DatosEnvio;
