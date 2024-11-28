import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaBell } from "react-icons/fa";
import Notificaciones from "../notificaciones/notificaciones"; // Importa el componente

const Inicio = () => {
  const navigate = useNavigate();

  const [mostrarNotificaciones, setMostrarNotificaciones] = useState(false);
  const [contadorNotificaciones, setContadorNotificaciones] = useState(0); // Ejemplo con 12 notificaciones

  const toggleNotificaciones = () => {
    setMostrarNotificaciones(!mostrarNotificaciones);
    if (!mostrarNotificaciones) {
      setContadorNotificaciones(0); // Reinicia el contador al abrir
    }
  };

  const handleNuevaNotificacion = (nuevas) => {
    setContadorNotificaciones((prev) => prev + nuevas);
  };

  const containerStyle = {
    paddingTop: "120px", // Espacio para el navbar fijo
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

  const notificationIconStyle = {
    position: "relative",
    display: "inline-block",
  };

  const notificationBadgeStyle = {
    position: "absolute",
    top: "-5px",
    right: "-10px",
    background: "red", // Fondo rojo para el círculo
    color: "white",
    borderRadius: "50%",
    width: "20px",
    height: "20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "0.8rem",
    fontWeight: "bold",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)", // Sombra para resaltar
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
            onClick={() => navigate("/surtir")}
          >
            Surtir Componentes
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
          <button
            style={{ position: "relative", background: "transparent", border: "none" }}
            onClick={toggleNotificaciones}
          >
            <div style={notificationIconStyle}>
              <FaBell size={24} color="#ffffff" />
              {contadorNotificaciones > 0 && (
                <span style={notificationBadgeStyle}>{contadorNotificaciones}</span>
              )}
            </div>
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
      </nav>

      {/* Renderiza el componente Notificaciones */}
      <Notificaciones
        mostrarNotificaciones={mostrarNotificaciones}
        toggleNotificaciones={toggleNotificaciones}
        onNuevaNotificacion={handleNuevaNotificacion}
      />
    </div>
  );
};

export default Inicio;
