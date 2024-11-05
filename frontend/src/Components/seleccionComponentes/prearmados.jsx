import React from "react";
import { useNavigate } from 'react-router-dom';
import "./css/prearmados.css"; 

function Propocito() {
  const navigate = useNavigate();

  const handleRedirect1 = () => {
    window.location.href = "http://localhost:3000/propocitoSeleccion";  
  };

  const handleRedirect2 = () => {
    window.location.href = "http://localhost:3000/libreseleccion";
  };

  const handleGoBack = () => {
    window.history.back(); 
  };

  // Estilos en línea
  const containerStyle = {
    fontFamily: 'Arial, sans-serif',
    color: '#ffffff',
    backgroundColor: '#27293d',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  };

  const navbarStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.5rem 2rem',
    backgroundColor: '#1e1f2b',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
    width: '100%',
  };

  const logoImageStyle = {
    width: '90px',
    height: '90px',
    borderRadius: '50%',
  };

  const navButtonsStyle = {
    display: 'flex',
    gap: '1rem',
  };

  const navButtonStyle = {
    color: '#ffffff',
    backgroundColor: 'transparent',
    border: '2px solid #5c6bc0',
    padding: '0.6rem 1.2rem',
    borderRadius: '20px',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease, transform 0.2s ease',
  };

  const navButtonHoverStyle = {
    backgroundColor: '#5c6bc0',
    transform: 'scale(1.05)',
  };

  return (
    <div style={containerStyle}>
      {/* Navbar */}
      <nav style={navbarStyle}>
        <div className="logo">
          <img src="/assets/logo.png" alt="Logo" style={logoImageStyle} />
        </div>
        <div style={navButtonsStyle}>
          <button
            style={navButtonStyle}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = navButtonHoverStyle.backgroundColor)}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            onClick={() => navigate('/Tipoequipo')}
          >
            Arma tu pc
          </button>
          <button
            style={navButtonStyle}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = navButtonHoverStyle.backgroundColor)}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            onClick={() => navigate('/catalogo-componentes')}
          >
            Catálogo de componentes
          </button>
          <button
            style={navButtonStyle}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = navButtonHoverStyle.backgroundColor)}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            onClick={() => navigate('/sobre-nosotros')}
          >
            Más sobre nosotros
          </button>
          <button
            style={navButtonStyle}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = navButtonHoverStyle.backgroundColor)}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            onClick={() => navigate('/mi-cuenta')}
          >
            Mi cuenta
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <h1 style={{ fontSize: '1.5rem', textAlign: 'center', marginTop: '1rem' }}>Elige para qué quieres usar tu equipo o trabaja libremente</h1>

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
          <h2 className="card-text" style={{ color: '#ffffff', margin: '0.5rem 0' }}>Propósito</h2>
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
