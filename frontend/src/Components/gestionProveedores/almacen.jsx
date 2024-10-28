import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Importa el hook useNavigate
import "./css/almacen.css"; // Asegúrate de importar el archivo CSS

const Almacen = () => {
  const navigate = useNavigate(); // Hook para navegación
  const productosConfirmados = JSON.parse(localStorage.getItem("productosConfirmados")) || [];

  // Estado para filtros
  const [filtroProveedor, setFiltroProveedor] = useState("");
  const [filtroProducto, setFiltroProducto] = useState("");

  // Agrupar productos por proveedor
  const productosPorProveedor = productosConfirmados.reduce((acc, producto) => {
    (acc[producto.proveedor] = acc[producto.proveedor] || []).push(producto);
    return acc;
  }, {});

  // Filtrar proveedores y productos
  const productosFiltrados = Object.entries(productosPorProveedor)
    .filter(([proveedor]) => proveedor.toLowerCase().includes(filtroProveedor.toLowerCase()))
    .map(([proveedor, productos]) => [
      proveedor,
      productos.filter((producto) =>
        producto.nombre.toLowerCase().includes(filtroProducto.toLowerCase())
      ),
    ])
    .filter(([proveedor, productos]) => productos.length > 0);

  return (
    <div className="contenedor-almacen">
      {/* Navbar */}
      <nav className="navbar">
        <div className="nav-buttons">
          <button className="nav-btn" onClick={() => navigate("/")}>Inicio</button>
          <button className="nav-btn" onClick={() => navigate("/productos")}>Gestión de Productos</button>
        </div>
      </nav>

      <h1 style={{ color: "white" }}>Almacén</h1>

      <div className="filtros">
        <input
          type="text"
          placeholder="Filtrar por proveedor"
          value={filtroProveedor}
          onChange={(e) => setFiltroProveedor(e.target.value)}
        />
        <input
          type="text"
          placeholder="Filtrar por producto"
          value={filtroProducto}
          onChange={(e) => setFiltroProducto(e.target.value)}
        />
      </div>

      {productosFiltrados.length > 0 ? (
        productosFiltrados.map(([proveedor, productos]) => (
          <div className="proveedor-card" key={proveedor}>
            <h2>{proveedor}</h2>
            <div className="productos-grid">
              {productos.map((producto, index) => (
                <div className="producto-card" key={index}>
                  <p><strong>Producto:</strong> {producto.nombre}</p>
                  <p><strong>Cantidad:</strong> {producto.cantidad}</p>
                  <p><strong>Fecha de adición:</strong> {new Date(producto.fecha).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          </div>
        ))
      ) : (
        <p>No hay productos en el pedido.</p>
      )}
    </div>
  );
};

export default Almacen;
