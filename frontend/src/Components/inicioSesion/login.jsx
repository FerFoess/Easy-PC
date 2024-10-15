import React, { useState } from "react";
import "./css/styles.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí puedes agregar la lógica para manejar el inicio de sesión
    console.log("Iniciando sesión:", { username, password });
  };

  return (
    <div className="login-container">
      <img src="/assets/logo.png" alt="Logo" className="logo-image" />

      <h2 style={{ color: "white" }}>Inicia Sesión</h2>

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
          <button type="submit">Crear Cuenta</button>
        </div>
      </form>
    </div>
  );
};

export default Login;
