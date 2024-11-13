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

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#27293d', color: '#ffffff', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
     <Navbar />

      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', margin: '2rem' }}>
        <div
          className="card"
          onClick={handleRedirect1}
          style={{
            backgroundColor: '#5c6bc0',
            borderRadius: '10px',
            padding: '1rem',
            margin: '1rem',
            cursor: 'pointer',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
            width: '200px',
            textAlign: 'center'
          }}
        >
          <img src="/assets/armar.png" alt="Imagen 1" className="card-image" style={{ width: '100%', borderRadius: '10px' }} />
          <h2 className="card-text" style={{ color: '#ffffff', margin: '0.5rem 0' }}>Proposito</h2>
        </div>
        <div
          className="card"
          onClick={handleRedirect2}
          style={{
            backgroundColor: '#5c6bc0',
            borderRadius: '10px',
            padding: '1rem',
            margin: '1rem',
            cursor: 'pointer',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
            width: '200px',
            textAlign: 'center'
          }}
        >
          <img src="/assets/armado.png" alt="Imagen 2" className="card-image" style={{ width: '100%', borderRadius: '10px' }} />
          <h2 className="card-text" style={{ color: '#ffffff', margin: '0.5rem 0' }}>Libre</h2>
        </div>
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
          marginBottom: '1rem'
        }}
      >
        Regresar
      </button>
    </div>
  );
}

export default Propocito;
