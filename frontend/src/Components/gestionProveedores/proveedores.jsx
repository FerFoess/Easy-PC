import React, { useState, useEffect } from "react";
import { FaShoppingCart } from "react-icons/fa";
import "./css/styles.css";

const GestionProveedores = () => {
  const [categorias, setCategorias] = useState([
    { id: 1, nombre: "CPU" },
    { id: 2, nombre: "RAM" },
    { id: 3, nombre: "Almacenamiento" },
    { id: 4, nombre: "Placa Madre" },
    { id: 5, nombre: "GPU" },
    { id: 6, nombre: "Fuente de poder" },
    { id: 7, nombre: "Gabinete" },
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
  
  const agregarAlCarrito = (producto, proveedor, cantidad) => {
    if (cantidad <= 0) {
      alert("Por favor, seleccione una cantidad válida.");
      return;
    }

    const itemCarrito = {
      nombre: producto.nombre, // Cambiado aquí para usar el nombre correcto
      proveedor: proveedor.proveedor,
      cantidad,
      precio: proveedor.precio_proveedor,
      total: cantidad * proveedor.precio_proveedor,
    };

    setProductosEnCarrito([...productosEnCarrito, itemCarrito]);
    setTotalPagar(totalPagar + itemCarrito.total);
  };

  useEffect(() => {
    const obtenerProductos = async () => {
      try {
        const respuesta = await fetch("http://localhost:3002/produ");
        if (!respuesta.ok) {
          throw new Error(`Error HTTP: ${respuesta.status}`);
        }
        const datos = await respuesta.json();
        console.log("Productos obtenidos:", datos);

        if (Array.isArray(datos)) {
          setProductos(datos);
        } else {
          console.error("Los datos no son un array:", datos);
        }
      } catch (error) {
        console.error("Error al cargar los productos:", error);
      }
    };

    obtenerProductos();
  }, []);

  const productosFiltrados = productos.filter(
    (producto) =>
      producto.categoria?.toLowerCase() === filtroCategoria.toLowerCase() &&
      producto.nombre?.toLowerCase().includes(filtroProducto.toLowerCase())
  );

  const proveedoresFiltrados = productoSeleccionado
    ? productoSeleccionado.proveedores.filter((proveedor) =>
        proveedor.proveedor
          .toLowerCase()
          .includes(filtroProveedor.toLowerCase())
      )
    : [];

  const manejarCambioCantidad = (proveedor, cantidad) => {
    const nuevaCantidad = {
      ...cantidadSeleccionada,
      [proveedor.proveedor]: parseInt(cantidad) || 0,
    };
    setCantidadSeleccionada(nuevaCantidad);

    const nuevoTotal = proveedoresFiltrados.reduce((total, proveedor) => {
      const cantidadProveedor = nuevaCantidad[proveedor.proveedor] || 0;
      return total + cantidadProveedor * proveedor.precio_proveedor;
    }, 0);

    setTotalPagar(nuevoTotal);
  };

  const mostrarDetalles = (detalles) => {
    if (!detalles || typeof detalles !== "object") return null;

    return Object.entries(detalles).map(([clave, valor]) => (
      <li key={clave}>
        <strong>{clave.replace(/_/g, " ")}:</strong> {valor}
      </li>
    ));
  };

  return (
    <div className="contenedor">
      <div
        className="carrito-icono"
        onClick={() => setMostrarCarrito(!mostrarCarrito)}
      >
        <FaShoppingCart size={30} />
        <span className="contador-carrito">{productosEnCarrito.length}</span>
      </div>

      {/* Card del carrito que se muestra/oculta */}
      <div className={`card-carrito ${mostrarCarrito ? "visible" : ""}`}>
  <h3>Carrito de compras</h3>
  {productosEnCarrito.length > 0 ? (
    <>
      {productosEnCarrito.map((producto, index) => (
        <p key={index}>
          {producto.cantidad} x {producto.nombre} (Proveedor: {producto.proveedor}) - ${producto.precio}
        </p>
      ))}
      {/* Botón de confirmar productos */}
      <button className="btn-confirmar" onClick={() => alert('Productos confirmados')}>
        Confirmar productos
      </button>
    </>
  ) : (
    <p>No hay productos en el carrito.</p> // Si el carrito está vacío
  )}
</div>


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
          {productosFiltrados.map((producto) => (
            <div
              key={producto._id}
              className="producto-card"
              onClick={() => setProductoSeleccionado(producto)}
            >
              <img
                src={producto.imagen || "https://via.placeholder.com/150"}
                alt={producto.nombre}
              />
              <h3>{producto.nombre}</h3>
              <p>Modelo: {producto.modelo}</p>
              <p>Marca: {producto.marca}</p>
              <p>
                Stock:{" "}
                {producto.proveedores
                  ? producto.proveedores.reduce(
                      (total, prov) => total + prov.stock,
                      0
                    )
                  : "No disponible"}
              </p>
              <p>Precio: ${producto.precio_base}</p>
            </div>
          ))}
        </div>

        {productoSeleccionado && (
          <div className="detalle-producto">
            <h2>{productoSeleccionado.nombre}</h2>
            <img
              src={
                productoSeleccionado.imagen || "https://via.placeholder.com/150"
              }
              alt={productoSeleccionado.nombre}
            />
            <p>
              <strong>Precio:</strong> ${productoSeleccionado.precio_base}
            </p>
            <p>
              <strong>Stock:</strong>{" "}
              {productoSeleccionado.proveedores
                ? productoSeleccionado.proveedores.reduce(
                    (total, prov) => total + prov.stock,
                    0
                  )
                : "No disponible"}
            </p>
            <h3>Detalles:</h3>
            <ul>{mostrarDetalles(productoSeleccionado.detalles)}</ul>

            <div className="search-bar-proveedores">
              <input
                type="text"
                placeholder="Buscar proveedores"
                value={filtroProveedor}
                onChange={(e) => setFiltroProveedor(e.target.value)}
              />
            </div>

            <div className="grid-proveedores">
              {proveedoresFiltrados.map((proveedor) => (
                <div key={proveedor.proveedor} className="proveedor-card">
                  <h4>{proveedor.proveedor}</h4>
                  <p>Precio: ${proveedor.precio_proveedor}</p>
                  <input
                    type="number"
                    min="1"
                    placeholder="Cantidad"
                    value={cantidadSeleccionada[proveedor.proveedor] || ""}
                    onChange={(e) =>
                      manejarCambioCantidad(proveedor, e.target.value)
                    }
                  />
                  <button
                    onClick={() =>
                      agregarAlCarrito(
                        productoSeleccionado,
                        proveedor,
                        cantidadSeleccionada[proveedor.proveedor]
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
  );
};

export default GestionProveedores;
