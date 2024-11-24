import React, { useState } from "react";
import "./css/styles.css";
import { jwtDecode } from "jwt-decode";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleCrearCuenta = () => {
    window.location.href = "http://localhost:3000/crearcuenta";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");  // Reseteamos el error antes de hacer la solicitud
  
    try {
      const response = await fetch("http://localhost:3002/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
  
      // Verificar si la respuesta fue exitosa
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.token);  // Guardamos el token
  
        // Decodificar el token y redirigir
        const decoded = jwtDecode(data.token);
        if (decoded.role === "user") {
          window.location.href = "http://localhost:3000/inicio";
        } else {
          window.location.href = "http://localhost:3000/almacen";
        }
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Error al iniciar sesión");
      }
    } catch (error) {
      setError("Error en la conexión con el servidor");
    }
  };
  
  
  

  return (
    <div className="login-container">
      <img src="/assets/logo.png" alt="Logo" className="logo-image" />

      <h2 style={{ color: "white" }}>Inicia Sesión</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="username">Usuario:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="password">Contraseña:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <h3 style={{ color: "white" }}>o crea una cuenta</h3>
        <div className="button-container">
          <button type="submit">Iniciar Sesión</button>
        </div>
<br></br>
        <button className="button-create" onClick={handleCrearCuenta}>
          Crear cuenta
        </button>
      </form>
    </div>
  );
};

export default Login;
