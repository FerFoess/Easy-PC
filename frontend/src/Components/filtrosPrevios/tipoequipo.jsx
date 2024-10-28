import "./css/styles.css";
import React from "react";
function TipoEquipo() {
  const handleRedirect1 = () => {
    window.location.href = "http://localhost:3000/propocito"; // Cambia este enlace al que desees
  };

  const handleRedirect2 = () => {
    window.location.href = "http://localhost:3000/prearmados"; // Cambia este enlace al que desees
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
            <h1>Crea tu equipo desde cero o elige uno listo</h1>
        </div>
      </nav>

      <div className="card-container">
        <div className="card" onClick={handleRedirect1}>
          <img src="/assets/armar.png" alt="Imagen 1" className="card-image" />
          <h2 className="card-text">Crear equipo</h2>
        </div>
        <div className="card" onClick={handleRedirect2}>
          <img src="/assets/armado.png" alt="Imagen 2" className="card-image" />
          <h2 className="card-text">Elegir uno listo</h2>
        </div>
      </div>
      <button className="back-button" onClick={handleGoBack}>
        Regresar
      </button>
    </div>
  );
}

export default TipoEquipo;
