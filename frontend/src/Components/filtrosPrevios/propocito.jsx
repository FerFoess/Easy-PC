import React from "react";
import "./css/styles.css"; // Puedes mantener la importación si tienes estilos adicionales en CSS
import Navbar from '../inicio/Navbar.js';

function Propocito() {
  const handleRedirect1 = () => {
    window.location.href = "http://localhost:3000/propocitoSeleccion";  // Cambia este enlace al que desees
  };

  const handleRedirect2 = () => {
    window.location.href = "http://localhost:3000/libreseleccion"; // Cambia este enlace al que desees
  };

  const handleGoBack = () => {
    window.history.back(); // Esto llevará al usuario a la página anterior
  };

  // Estilos en línea
  const appStyle = {
    fontFamily: "Arial, sans-serif",
    color: "#ffffff",
    backgroundColor: "#27293d",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  };

  const cardContainerStyle = {
    display: "flex",
    gap: "2rem",
    margin: "2rem 0",
  };

  const cardStyle = {
    backgroundColor: "#3b3c50",
    borderRadius: "10px",
    width: "250px",
    padding: "1rem",
    textAlign: "center",
    cursor: "pointer",
    transition: "transform 0.3s ease",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
  };

  const cardHoverStyle = {
    transform: "scale(1.05)",
  };

  const cardImageStyle = {
    width: "100%",
    height: "auto",
    borderRadius: "10px",
  };

  const cardTextStyle = {
    marginTop: "1rem",
    fontSize: "1.5rem",
  };


  const instructionsContainerStyle = {
    backgroundColor: "#444755",
    borderRadius: "10px",
    padding: "1rem",
    marginTop: "2rem",
    width: "80%",
    textAlign: "center",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
  };



  const backButtonStyle = {
    padding: "0.8rem 1.5rem",
    fontSize: "1rem",
    border: "none",
    borderRadius: "20px",
    color: "#ffffff",
    backgroundColor: "#5c6bc0",
    cursor: "pointer",
    transition: "background-color 0.3s ease, transform 0.2s ease",
    marginTop: "2rem",
  };
  const instructionsTextStyle = {
    fontSize: "1.2rem",
    color: "#fff",
  };

  return (
    <div style={appStyle}>
      <Navbar />
      <div style={cardContainerStyle}>
        <div
          style={cardStyle}
          onMouseEnter={(e) => (e.currentTarget.style.transform = cardHoverStyle.transform)}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "")}
          onClick={handleRedirect1}
        >
          <img src="/assets/armar.png" alt="Imagen 1" style={cardImageStyle} />
          <h2 style={cardTextStyle}>Propocito</h2>
        </div>
        <div
          style={cardStyle}
          onMouseEnter={(e) => (e.currentTarget.style.transform = cardHoverStyle.transform)}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "")}
          onClick={handleRedirect2}
        >
          <img src="/assets/armado.png" alt="Imagen 2" style={cardImageStyle} />
          <h2 style={cardTextStyle}>Libre</h2>
        </div>
      </div>
      
      {/* Instructions Box */}
      <div style={instructionsContainerStyle}>
        <p style={instructionsTextStyle}>
          En esta sección, puedes elegir entre dos opciones: 
          <strong>Propocito</strong> te permite crear un equipo a tu medida, perfecto para tu día a día, mientras que <strong>Libre</strong> te permite seleccionar diferentes componentes sin ninguna restricción para así dejar volar tu creatividad.
        </p>
      </div>

      <button
        className="back-button"
        onClick={handleGoBack}
        style={{
          backgroundColor: '#e57373',
          border: 'none',
          color: '#ffffff',
          padding: '0.6rem 1rem',
          borderRadius: '20px',
          cursor: 'pointer',
          transition: 'background-color 0.3s ease',
          marginBottom: '1rem',
        }}
      >
        Regresar
      </button>
    </div>
  );
}

export default Propocito;
