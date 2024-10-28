import React, { useState, useEffect } from "react";
import { FaShoppingCart } from "react-icons/fa";
import { useNavigate } from "react-router-dom"; // Importación para navegación
import "./css/styles.css";

const GestionProveedores = () => {
  const navigate = useNavigate(); // Hook para navegación

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
  const [filtroCategoria, setFiltroCategoria] = useState("RAM");
  const [filtroProducto, setFiltroProducto] = useState("");
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [productosEnCarrito, setProductosEnCarrito] = useState([]);
  const [filtroProveedor, setFiltroProveedor] = useState("");
  const [cantidadSeleccionada, setCantidadSeleccionada] = useState({});
  const [totalPagar, setTotalPagar] = useState(0);
  const [mostrarCarrito, setMostrarCarrito] = useState(false);

  // Función para agregar productos al carrito
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

  // Efecto para obtener productos desde una API
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

  // Navegar al almacén y pasar los productos del carrito
  // Navegar al almacén y pasar los productos del carrito
  const confirmarPedido = () => {
    if (productosEnCarrito.length > 0) {
      // Guardar los productos confirmados en localStorage
      localStorage.setItem(
        "productosConfirmados",
        JSON.stringify(productosEnCarrito)
      );

      // Navegar a la pantalla 'Almacén'
      navigate("/almacen");
    } else {
      alert("No hay productos en el carrito.");
    }
  };

  return (
    <>
      <nav className="navbar">
        <div className="logo">
          <h1 className="logo-text">Easy-PC</h1>
        </div>
        <div className="nav-buttons">
          <button className="nav-btn" onClick={() => navigate("/almacen")}>
            Almacen
          </button>
        </div>
      </nav>

      <div className="contenedor">
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
          <h1 style={{ color: "white" }}>Gestión productos/proveedores</h1>

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
              <p>
                <strong>Stock:</strong>{" "}
                {productoSeleccionado.proveedores
                  ? productoSeleccionado.proveedores.reduce(
                      (total, prov) => total + prov.stock,
                      0
                    )
                  : "No disponible"}
              </p>

              <div className="search-bar-proveedores">
                <input
                  type="text"
                  placeholder="Buscar proveedores"
                  value={filtroProveedor}
                  onChange={(e) => setFiltroProveedor(e.target.value)}
                />
              </div>

              <div className="grid-proveedores">
                {productoSeleccionado.proveedores
                  .filter((proveedor) =>
                    proveedor.proveedor
                      .toLowerCase()
                      .includes(filtroProveedor.toLowerCase())
                  )
                  .map((proveedor) => (
                    <div key={proveedor.proveedor} className="proveedor-card">
                      <h4>{proveedor.proveedor}</h4>

                      <input
                        type="number"
                        placeholder="Cantidad"
                        min="1"
                        value={cantidadSeleccionada[proveedor.proveedor] || ""}
                        onChange={(e) =>
                          setCantidadSeleccionada({
                            ...cantidadSeleccionada,
                            [proveedor.proveedor]:
                              parseInt(e.target.value) || 0,
                          })
                        }
                      />
                      <button
                        className="btn-agregar"
                        onClick={() =>
                          agregarAlCarrito(
                            productoSeleccionado,
                            proveedor,
                            cantidadSeleccionada[proveedor.proveedor] || 0
                          )
                        }
                      >
                        Agregar al carrito
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
