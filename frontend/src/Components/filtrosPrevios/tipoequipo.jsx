import React from "react";
import { useNavigate } from "react-router-dom"; // Asegúrate de tener react-router-dom instalado

function TipoEquipo() {
  const navigate = useNavigate();

  const handleRedirect1 = () => {
    window.location.href = "http://localhost:3000/propocito";
  };

  const handleRedirect2 = () => {
    window.location.href = "http://localhost:3000/prearmados"; // Cambia este enlace al que desees
  };

  const handleGoBack = () => {
    window.history.back();
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

  const navbarStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0.5rem 2rem",
    backgroundColor: "#1e1f2b",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
    width: "100%",
  };

  const logoImageStyle = {
    width: "90px",
    height: "90px",
    borderRadius: "50%",
  };

  const navButtonsStyle = {
    display: "flex",
    gap: "1rem",
  };

  const navButtonStyle = {
    color: "#ffffff",
    backgroundColor: "transparent",
    border: "2px solid #5c6bc0",
    padding: "0.6rem 1.2rem",
    borderRadius: "20px",
    fontSize: "1rem",
    cursor: "pointer",
    transition: "background-color 0.3s ease, transform 0.2s ease",
  };

  const navButtonHoverStyle = {
    backgroundColor: "#5c6bc0",
    transform: "scale(1.05)",
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

  const backButtonHoverStyle = {
    backgroundColor: "#7986cb",
    transform: "scale(1.05)",
  };

  return (
    <div style={appStyle}>
      <nav style={navbarStyle}>
        <div className="logo">
          <img src="/assets/logo.png" alt="Logo" style={logoImageStyle} />
        </div>
        <div style={navButtonsStyle}>
        <button
            style={navButtonStyle}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = navButtonHoverStyle.backgroundColor)}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
            onClick={() => navigate('/inicio')}
          >
            Inicio
          </button>
          <button
            style={navButtonStyle}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = navButtonHoverStyle.backgroundColor)}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
            onClick={() => navigate('/Tipoequipo')}
          >
            Arma tu pc
          </button>
          <button
            style={navButtonStyle}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = navButtonHoverStyle.backgroundColor)}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
            onClick={() => navigate('/catalogo-componentes')}
          >
            Catálogo de componentes
          </button>
          <button
                        style={navButtonStyle}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = navButtonHoverStyle.backgroundColor)}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'red')}
                        onClick={() => navigate('/login')}
                    >
                        Cerrar Sesión
                    </button>
        </div>
      </nav>

      <div style={cardContainerStyle}>
        <div
          style={cardStyle}
          onMouseEnter={(e) => (e.currentTarget.style.transform = cardHoverStyle.transform)}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "")}
          onClick={handleRedirect1}
        >
          <img src="/assets/armar.png" alt="Imagen 1" style={cardImageStyle} />
          <h2 style={cardTextStyle}>Crear equipo</h2>
        </div>
        <div
          style={cardStyle}
          onMouseEnter={(e) => (e.currentTarget.style.transform = cardHoverStyle.transform)}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "")}
          onClick={handleRedirect2}
        >
          <img src="/assets/armado.png" alt="Imagen 2" style={cardImageStyle} />
          <h2 style={cardTextStyle}>Elegir uno listo</h2>
        </div>
      </div>
      <button
        style={backButtonStyle}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = backButtonHoverStyle.backgroundColor)}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = backButtonStyle.backgroundColor)}
        onClick={handleGoBack}
      >
        Regresar
      </button>
    </div>
  );
}

export default TipoEquipo;
