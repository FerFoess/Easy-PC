import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './css/almacen.css';

const Almacen = () => {
  const navigate = useNavigate();
  const [productosConfirmados, setProductosConfirmados] = useState(
    JSON.parse(localStorage.getItem("productosConfirmados")) || []
  );

  const [filtroProveedor, setFiltroProveedor] = useState("");
  const [filtroProducto, setFiltroProducto] = useState("");

  const handleCancelarProducto = (proveedor, productoIndex) => {
    const nuevosProductos = productosConfirmados.filter((producto, index) => 
      !(producto.proveedor === proveedor && index === productoIndex)
    );

    setProductosConfirmados(nuevosProductos);
    localStorage.setItem("productosConfirmados", JSON.stringify(nuevosProductos));
  };

  const productosPorProveedor = productosConfirmados.reduce((acc, producto) => {
    (acc[producto.proveedor] = acc[producto.proveedor] || []).push(producto);
    return acc;
  }, {});

  const productosFiltrados = Object.entries(productosPorProveedor)
    .filter(([proveedor]) => proveedor.toLowerCase().includes(filtroProveedor.toLowerCase()))
    .map(([proveedor, productos]) => [
      proveedor,
      productos.filter((producto) =>
        producto.nombre.toLowerCase().includes(filtroProducto.toLowerCase())
      ),
    ])
    .filter(([proveedor, productos]) => productos.length > 0);

  const navbarStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0.5rem 2rem",
    backgroundColor: "#000f5a",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
    width: "100%",
    position: "fixed",
    top: "0",
    left: "0",
    zIndex: "10",
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
    border: "2px solid white",
    padding: "0.6rem 1.2rem",
    borderRadius: "20px",
    fontSize: "1rem",
    cursor: "pointer",
    transition: "background-color 0.3s ease, transform 0.2s ease",
  };

  const navButtonHoverStyle = {
    backgroundColor: "black",
    transform: "scale(1.05)",
  };

  const filterButtonStyle = {
    padding: "0.5rem",
    borderRadius: "5px",
    border: "1px solid #5c6bc0",
    fontSize: "1rem",
    width: "200px",
    marginRight: "1rem",
    color: "white",
    transition: "all 0.2s ease-in-out",
    
  };

  const filterButtonFocusStyle = {
    backgroundColor: "black",
    color: "#ffffff",
    padding: "20px",
    width: "20px"
  };

  return (
    <div className="contenedor-almacen">
      <nav style={navbarStyle}>
        <div className="logo">
          <img src="/assets/logo.png" alt="Logo" style={logoImageStyle} />
        </div>
        <div style={navButtonsStyle}>
          <button
            style={navButtonStyle}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = navButtonHoverStyle.backgroundColor)}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
            onClick={() => navigate("/")}
          >
            Inicio
          </button>
          <button
            style={navButtonStyle}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = navButtonHoverStyle.backgroundColor)}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
            onClick={() => navigate("/proveedores")}
          >
            Proveedores
          </button>
          <button
            style={navButtonStyle}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = navButtonHoverStyle.backgroundColor)}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
            onClick={() => navigate("/estadisticas")}
          >
            Estadisticas
          </button>
        </div>
      </nav>

      <div style={{ marginTop: "120px" }}>
        <h1 style={{ color: "white", textAlign: "center" }}>Almacén</h1>

        <div className="filtros">
          <input
            type="text"
            placeholder="Filtrar por proveedor"
            style={filterButtonStyle}
            onFocus={(e) => {
              e.target.style.backgroundColor = filterButtonFocusStyle.backgroundColor;
              e.target.style.color = filterButtonFocusStyle.color;
            }}
            onBlur={(e) => {
              e.target.style.backgroundColor = "transparent";
              e.target.style.color = "#1e1f2b";
            }}
            value={filtroProveedor}
            onChange={(e) => setFiltroProveedor(e.target.value)}
          />
          
          <input
            type="text"
            placeholder="Filtrar por producto"
            style={filterButtonStyle}
            onFocus={(e) => {
              e.target.style.backgroundColor = filterButtonFocusStyle.backgroundColor;
              e.target.style.color = filterButtonFocusStyle.color;
            }}
            onBlur={(e) => {
              e.target.style.backgroundColor = "transparent";
              e.target.style.color = "#1e1f2b";
            }}
            value={filtroProducto}
            onChange={(e) => setFiltroProducto(e.target.value)}
          />
        </div>
        <br />

        {productosFiltrados.length > 0 ? (
          productosFiltrados.map(([proveedor, productos]) => (
            <div className="proveedor-card" key={proveedor}>
              <h2>{proveedor}</h2>
              <div className="productos-grid">
                {productos.map((producto, index) => (
                  <div className="producto-card" key={index}>
                  <p><strong>Producto:</strong> {producto.nombre}</p>
                  <p><strong>Cantidad:</strong> {producto.cantidad}</p>
                  <button
                    style={{
                      marginTop: "0.5rem",
                      padding: "0.4rem 0.8rem",
                      backgroundColor: "#ff4c4c",
                      color: "#ffffff",
                      border: "none",
                      borderRadius: "10px",
                      cursor: "pointer",
                      fontSize: "0.9rem",
                      transition: "background-color 0.3s ease, transform 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#ff3333";
                      e.currentTarget.style.transform = "scale(1.05)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "#ff4c4c";
                      e.currentTarget.style.transform = "scale(1)";
                    }}
                    onClick={() => handleCancelarProducto(proveedor, index)}
                  >
                    Cancelar
                  </button>
                </div>
                
                ))}
              </div>
            </div>
          ))
        ) : (
          <p>No hay productos en el pedido.</p>
        )}
      </div>
    </div>
  );
};

export default Almacen;
