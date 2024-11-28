import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from '../inicio/Navbar';

import "./miCuenta.css";

const MisCompras = () => {
  const [compras, setCompras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState(""); // Estado para la búsqueda
  const [filtroFecha, setFiltroFecha] = useState(""); // Estado para el filtro de fecha
  const navigate = useNavigate();

  // Función para manejar la obtención de las compras
  useEffect(() => {
    const fetchCompras = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3002/ventas/obtenerVentas"
        );
        setCompras(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener las compras:", error);
        setLoading(false);
      }
    };

    fetchCompras();
  }, []);

  if (loading) {
    return <p>Cargando...</p>;
  }

  // Función para filtrar las compras por fecha
  const filtrarPorFecha = (compra) => {
    const fechaCompra = new Date(compra.fecha);
    const fechaActual = new Date();

    switch (filtroFecha) {
      case "este-mes":
        return fechaCompra.getMonth() === fechaActual.getMonth() && fechaCompra.getFullYear() === fechaActual.getFullYear();
      case "mes-pasado":
        const mesPasado = new Date(fechaActual);
        mesPasado.setMonth(mesPasado.getMonth() - 1);
        return fechaCompra.getMonth() === mesPasado.getMonth() && fechaCompra.getFullYear() === mesPasado.getFullYear();
      case "este-ano":
        return fechaCompra.getFullYear() === fechaActual.getFullYear();
      default:
        return true;
    }
  };

  // Filtrar las compras por nombre de producto y fecha
  const comprasFiltradas = compras.filter((compra) =>
    compra.productos.some((producto) =>
      producto.nombre.toLowerCase().includes(busqueda.toLowerCase())
    ) && filtrarPorFecha(compra)
  );

  return (
    <div className="fondito">
      <Navbar />
      <div className="mis-compras">
        <header className="compras-header">
        <h1 style={{ color: 'white' }}>Mis Compras</h1>

          <input
            type="text"
            placeholder="Buscar por nombre de producto"
            className="buscar"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
          <select
            value={filtroFecha}
            onChange={(e) => setFiltroFecha(e.target.value)}
            className="filtro-fecha"
          >
            <option value="">Filtrar por fecha</option>
            <option value="este-mes">Este mes</option>
            <option value="mes-pasado">Mes pasado</option>
            <option value="este-ano">Este año</option>
          </select>
        </header>

        <div className="compras-lista">
          {comprasFiltradas.length > 0 ? (
            comprasFiltradas.map((compra) => (
              <div key={compra._id} className="compra-card">
                <p className="fecha">
                  {new Date(compra.fecha).toLocaleDateString()}
                </p>
                <div className="compra-detalles">
                  <div className="estado">
                    <span>Estado: Completada</span>
                    <p>Envío estándar</p>
                  </div>
                  <div className="info-producto">
                    <h3>Total: ${compra.total}</h3>
                    <ul>
                      {compra.productos.map((producto) => (
                        <li key={producto._id}>
                          <strong>{producto.nombre}</strong>
                          <p>
                            <strong>Cantidad:</strong> {producto.cantidad}
                          </p>
                          <p>
                            <strong>Categoría:</strong> {producto.categoria}
                          </p>
                          <p>
                            <strong>Costo:</strong> ${producto.costo}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="acciones">
                    <p className="vendedor">
                      <strong>Vendedor:</strong> Tienda Oficial
                    </p>
                    <button
                      className="comprar-de-nuevo"
                      onClick={() => navigate("/carritoCompra")}
                    >
                      Volver a comprar
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No se encontraron compras.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MisCompras;
