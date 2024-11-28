// Navbar.js
import React from "react";
import { useNavigate } from "react-router-dom";
import { FaTag,FaShoppingCart, FaHome, FaDesktop, FaBoxOpen, FaInfoCircle, FaUser, FaSignOutAlt } from "react-icons/fa";  // Importamos los iconos correspondientes
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
      <button style={navButtonStyle} onClick={() => navigate("/inicio")}>
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
          onClick={() => navigate("/inicio")}
        >
          <FaHome size={24} /> Inicio
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
          onClick={() => navigate("/Tipoequipo")}
        >
          <FaDesktop size={24} /> Arma tu PC
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
          <FaBoxOpen size={24} /> Catálogo de Componentes
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
          <FaInfoCircle size={24} /> Más sobre Nosotros
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
          onClick={() => navigate("/miCuenta")}
        >
          <FaTag size={24} /> Mis Compras
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
          <FaShoppingCart size={24} />
        </button>
        <button
          style={navButtonStyle}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor =
              navButtonHoverStyle.backgroundColor)
          }
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "red")}
          onClick={() => navigate("/")}
        >
          <FaSignOutAlt size={24} /> Cerrar Sesión
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
