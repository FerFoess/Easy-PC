import React, { useState, useEffect } from "react";
import { FaShoppingCart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./css/styles.css";

const GestionProveedores = () => {
  const navigate = useNavigate();
  const [categorias, setCategorias] = useState([
    { id: 1, nombre: "CPU" },
    { id: 2, nombre: "Memorias RAM" },
    { id: 3, nombre: "Almacenamiento Principal" },
    { id: 4, nombre: "Tarjetas Madre" },
    { id: 6, nombre: "Fuentes de poder" },
    { id: 7, nombre: "Gabinetes" },
    { id: 8, nombre: "Disipadores" },
    { id: 9, nombre: "Tarjetas de video" },
  ]);
  const [productos, setProductos] = useState([]);
  const [filtroCategoria, setFiltroCategoria] = useState("");
  const [filtroProducto, setFiltroProducto] = useState("");
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [productosEnCarrito, setProductosEnCarrito] = useState([]);
  const [filtroProveedor, setFiltroProveedor] = useState("");
  const [cantidadSeleccionada, setCantidadSeleccionada] = useState({});
  const [totalPagar, setTotalPagar] = useState(0);
  const [mostrarCarrito, setMostrarCarrito] = useState(false);

  const agregarAlCarrito = (producto, proveedor, cantidad) => {
    if (!cantidad || cantidad <= 0) {
      alert("Por favor, seleccione una cantidad válida.");
      return;
    }

    const itemCarrito = {
      nombre: producto.nombre,
      proveedor: proveedor.proveedor,
      cantidad,
      precio: proveedor.precio_proveedor,
      total: cantidad * proveedor.precio_proveedor,
    };

    setProductosEnCarrito([...productosEnCarrito, itemCarrito]);
    setTotalPagar((prevTotal) => prevTotal + itemCarrito.total);
  };

  useEffect(() => {
    const obtenerProductos = async () => {
      try {
        const respuesta = await fetch("http://localhost:3002/produ");
        if (!respuesta.ok) {
          throw new Error(`Error HTTP: ${respuesta.status}`);
        }
        const datos = await respuesta.json();
        if (Array.isArray(datos)) {
          setProductos(datos);
        }
      } catch (error) {
        console.error("Error al cargar los productos:", error);
      }
    };
    obtenerProductos();
  }, []);

  const confirmarPedido = () => {
    if (productosEnCarrito.length > 0) {
      localStorage.setItem(
        "productosConfirmados",
        JSON.stringify(productosEnCarrito)
      );

      navigate("");
    } else {
      alert("No hay productos en el carrito.");
    }
  };

  // Estilos en línea para la navbar
  const navbarStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0.5rem 2rem",
    backgroundColor: "#000f5a",
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

  return (
    <>
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
            Estadisticas
          </button>
        </div>
      </nav>

      <div className="contenedor" style={{ background: "black" }}>
        <div
          className="carrito-icono"
          onClick={() => setMostrarCarrito(!mostrarCarrito)}
        >
          <FaShoppingCart size={30} />
          <span className="contador-carrito">{productosEnCarrito.length}</span>
        </div>

        {/* Carrito de compras */}
        <div className={`card-carrito ${mostrarCarrito ? "visible" : ""}`}>
          <h3>Carrito de compras</h3>
          {productosEnCarrito.length > 0 ? (
            <>
              {productosEnCarrito.map((producto, index) => (
                <p key={index}>
                  {producto.cantidad} x {producto.nombre} (Proveedor:{" "}
                  {producto.proveedor}) - ${producto.precio}
                </p>
              ))}
              <button className="btn-confirmar" onClick={confirmarPedido}>
                Confirmar productos
              </button>
            </>
          ) : (
            <p>No hay productos en el carrito.</p>
          )}
        </div>

        {/* Sidebar de categorías */}
        <div className="sidebar">
          <h2 style={{ color: "white" }}>Categorías</h2>
          <ul>
            {categorias.map((categoria) => (
              <li
                key={categoria.id}
                style={{ color: "white" }}
                className={filtroCategoria === categoria.nombre ? "active" : ""}
                onClick={() => setFiltroCategoria(categoria.nombre)}
              >
                {categoria.nombre}
              </li>
            ))}
          </ul>
        </div>

        {/* Listado de productos */}
        <div className="main-content">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Buscar productos"
              value={filtroProducto}
              onChange={(e) => setFiltroProducto(e.target.value)}
            />
            <select
              value={filtroCategoria}
              onChange={(e) => setFiltroCategoria(e.target.value)}
            >
              {categorias.map((categoria) => (
                <option key={categoria.id} value={categoria.nombre}>
                  {categoria.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="grid-productos">
            {productos
              .filter(
                (producto) =>
                  producto.categoria?.toLowerCase() ===
                    filtroCategoria.toLowerCase() &&
                  producto.nombre
                    ?.toLowerCase()
                    .includes(filtroProducto.toLowerCase())
              )
              .map((producto) => (
                <div
                  key={producto._id}
                  className="producto-card"
                  onClick={() => setProductoSeleccionado(producto)}
                >
                  <h3>{producto.nombre}</h3>
                  <p>Modelo: {producto.modelo}</p>
                  <p>Marca: {producto.marca}</p>
                </div>
              ))}
          </div>

          {productoSeleccionado && (
            <div className="detalle-producto">
              <h2>{productoSeleccionado.nombre}</h2>

              <div className="proveedores-lista">
                {productoSeleccionado.proveedores?.map((proveedor, index) => (
                  <div key={index} className="proveedor-item">
                    <p>Proveedor: {proveedor.proveedor}</p>
                    <input
                      type="number"
                      min="1"
                      placeholder="Cantidad"
                      onChange={(e) =>
                        setCantidadSeleccionada((prevState) => ({
                          ...prevState,
                          [proveedor.proveedor]: e.target.value,
                        }))
                      }
                    />
                    <button
                      style={{
                        marginTop: "0.5rem",
                        padding: "0.4rem 0.8rem",
                        backgroundColor: "#4CAF50",
                        color: "#ffffff",
                        border: "none",
                        borderRadius: "10px",
                        cursor: "pointer",
                        fontSize: "0.9rem",
                        transition:
                          "background-color 0.3s ease, transform 0.2s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "#45a049";
                        e.currentTarget.style.transform = "scale(1.05)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "#4CAF50";
                        e.currentTarget.style.transform = "scale(1)";
                      }}
                      onClick={() =>
                        agregarAlCarrito(
                          productoSeleccionado,
                          proveedor,
                          parseInt(cantidadSeleccionada[proveedor.proveedor])
                        )
                      }
                    >
                      Añadir al carrito
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default GestionProveedores;
