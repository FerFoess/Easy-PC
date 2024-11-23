import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaBell } from "react-icons/fa";
import Notificaciones from "../notificaciones/notificaciones"; // Importa el componente

const Inicio = () => {
  const navigate = useNavigate();

  const [mostrarNotificaciones, setMostrarNotificaciones] = useState(false);

  const toggleNotificaciones = () => {
    setMostrarNotificaciones(!mostrarNotificaciones);
  };

  const containerStyle = {
    paddingTop: "120px", // espacio para el navbar fijo
  };

  const navbarStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0.5rem 2rem",
    backgroundColor: "#1e1f2b",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
    zIndex: 1000,
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

  return (
    <div style={containerStyle}>
      <nav style={navbarStyle}>
        <div className="logo">
          <img src="/assets/logo.png" alt="Logo" style={logoImageStyle} />
        </div>
        <div style={navButtonsStyle}>
          <button
            style={navButtonStyle}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor =
                navButtonHoverStyle.backgroundColor)
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "transparent")
            }
            onClick={() => navigate("/inicio")}
          >
            Inicio
          </button>
          <button
            style={navButtonStyle}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor =
                navButtonHoverStyle.backgroundColor)
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "transparent")
            }
            onClick={() => navigate("/productform")}
          >
            Agregar Producto
          </button>
          <button
            style={navButtonStyle}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor =
                navButtonHoverStyle.backgroundColor)
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "transparent")
            }
            onClick={() => navigate("/almacen")}
          >
            Almacen
          </button>
          <button
            style={navButtonStyle}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor =
                navButtonHoverStyle.backgroundColor)
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "transparent")
            }
            onClick={() => navigate("/estadisticas")}
          >
            Estadísticas
          </button>
          <button
            style={navButtonStyle}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor =
                navButtonHoverStyle.backgroundColor)
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "transparent")
            }
            onClick={() => navigate("/corte")}
          >
            Cortes
          </button>
          <button style={navButtonStyle} onClick={toggleNotificaciones}>
            <FaBell size={24} /> Notificaciones
          </button>
          <button
            style={navButtonStyle}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor =
                navButtonHoverStyle.backgroundColor)
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "transparent")
            }
            onClick={() => navigate("/mi-cuenta")}
          >
            Mi cuenta
          </button>
        </div>
        {/* Renderiza el componente Notificaciones */}
        <Notificaciones
          mostrarNotificaciones={mostrarNotificaciones}
          toggleNotificaciones={toggleNotificaciones}
        />
      </nav>
    </div>
  );
};

export default Inicio;
