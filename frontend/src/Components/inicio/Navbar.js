// Navbar.js
import React from "react";
import { useNavigate } from "react-router-dom";
import "./css/styles.css";

const Navbar = () => {
  const navigate = useNavigate();

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

  return (
    <nav style={navbarStyle}>
      <button style={navButtonStyle} backgroundColor = "transparent" onClick={() => navigate("/inicio")}>
        <div className="logo">
          <img src="/assets/logo.png" alt="Logo" style={logoImageStyle} />
        </div>
      </button> 
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
          onClick={() => navigate("/Tipoequipo")}
        >
          Arma tu pc
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
          onClick={() => navigate("/catalogo-componentes")}
        >
          Catálogo de componentes
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
          onClick={() => navigate("/carritoCompra")}
        >
          Carrito de compra
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
          onClick={() => navigate("/sobre-nosotros")}
        >
          Más sobre nosotros
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
        <button
          style={navButtonStyle}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor =
              navButtonHoverStyle.backgroundColor)
          }
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "red")}
          onClick={() => navigate("/login")}
        >
          Cerrar Sesión
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
