import React, { useState } from 'react';
import './css/RegisterUser.css';

const RegisterUser = () => {
  const [formData, setFormData] = useState({
    password: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    age: '',
  });
  const [successMessage, setSuccessMessage] = useState(''); // Estado para el mensaje de éxito

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3002/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        setSuccessMessage(data.message); // Mostrar el mensaje de éxito
        // Limpiar el formulario después de un registro exitoso
        setFormData({
          password: '',
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          age: '',
        });
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Hubo un problema al registrar el usuario.');
    }
  };

  const handleContinue = () => {
    window.location.href = "http://localhost:3000/"; 
  };

  const handleCancel = () => {
    // Lógica para cancelar, como limpiar el formulario o redirigir
    setFormData({
      password: '',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      age: '',
    });
    setSuccessMessage(''); // Limpiar el mensaje de éxito si se cancela
  };

  return (
    <div className="app">
      <nav className="navbar">
        <div className="logo">
          <h1 className="logo-text">Easy-PC</h1>
        </div>
        <div className="nav-text">
          <h2>Regístrate y accede a todos nuestros productos</h2>
        </div>
      </nav>

      <div className="gray-box">
        <h2>Completa los datos</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="firstName"
            placeholder="Nombre"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="lastName"
            placeholder="Apellido"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="email"
            placeholder="Direccion de correo electronico"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="phone"
            placeholder="Teléfono"
            value={formData.phone}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="age"
            placeholder="Edad"
            value={formData.age}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button type="submit">Registrar</button>
          <br />
          <button className="cancel-button" onClick={handleCancel}>Cancelar</button>
        </form>

        {successMessage && (
          <div className="success-message">
            <p>{successMessage}</p>
            <p>Revisar correo electrónico para obtener el nombre de usuario</p>
            <button onClick={handleContinue}>Continuar</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegisterUser;
