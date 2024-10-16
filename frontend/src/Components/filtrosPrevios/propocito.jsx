import "./css/styles.css";
import React from "react";

function propocito() {
  const handleRedirect1 = () => {
    window.location.href = "https://tu-primer-sitio.com"; // Cambia este enlace al que desees
  };

  const handleRedirect2 = () => {
    window.location.href = "https://tu-segundo-sitio.com"; // Cambia este enlace al que desees
  };

  const handleGoBack = () => {
    window.history.back(); // Esto llevará al usuario a la página anterior
  };

  return (
    <div className="app">
      <nav className="navbar">
        <div className="logo">
          <h1 className="logo-text">Easy-PC</h1>
        </div>
          <div className="nav-text">
            <h1>Elige para que quieres usar tu equipo o trabaja libremente</h1>
        </div>
      </nav>

      <div className="card-container">
        <div className="card" onClick={handleRedirect1}>
          <img src="/assets/armar.png" alt="Imagen 1" className="card-image" />
          <h2 className="card-text">Proposito</h2>
        </div>
        <div className="card" onClick={handleRedirect2}>
          <img src="/assets/armado.png" alt="Imagen 2" className="card-image" />
          <h2 className="card-text">Libre</h2>
        </div>
      </div>
      <button className="back-button" onClick={handleGoBack}>
        Regresar
      </button>
    </div>
  );
}

export default propocito;
