import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./css/prearmados.css";
import Navbar from "../inicio/Navbar.js";
import { jwtDecode } from "jwt-decode";
import { FaShoppingCart } from "react-icons/fa";

const Prearmados = () => {
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    processor: "",
    ram: "",
    storage: "",
    graphics: "",
    priceRange: "",
  });
  const [filterOptions, setFilterOptions] = useState({
    processor: [],
    ram: [],
    storage: [],
    graphics: [],
  });
  const [prearmados, setPrearmados] = useState([]);
  const [filteredPrearmados, setFilteredPrearmados] = useState([]);
  const [selectedPC, setSelectedPC] = useState(null); // Estado para el prearmado seleccionado
  const [error, setError] = useState("");
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupMensaje, setPopupMensaje] = useState("");
  const [cartItems, setCartItems] = useState([]); // Estado para productos en el carrito

  useEffect(() => {
    fetchPrearmados();
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      setUserId(decoded.userId);
      fetchCartItems(decoded.userId); // Obtener los productos en el carrito
    } else {
      window.location.href = "http://localhost:3000";
    }
  }, []);

  const fetchPrearmados = async () => {
    try {
      const response = await fetch("http://localhost:3002/prearmado");

      if (!response.ok) {
        throw new Error("Error en la respuesta del servidor");
      }

      const data = await response.json();
      setPrearmados(data);

      const processors = [...new Set(data.map((item) => item.processor))];
      const rams = [...new Set(data.map((item) => item.ram))];
      const storages = [...new Set(data.map((item) => item.storage))];
      const graphicsCards = [...new Set(data.map((item) => item.graphics))];

      setFilterOptions({
        processor: processors,
        ram: rams,
        storage: storages,
        graphics: graphicsCards,
      });

      setFilteredPrearmados(data);
    } catch (error) {
      console.error("Error fetching prearmados:", error);
      setError("Error al cargar los prearmados");
    }
  };

  const fetchCartItems = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:3002/cart/${userId}`);
      if (response.status === 200) {
        // Asegurarse de que cartItems sea siempre un array
        setCartItems(Array.isArray(response.data) ? response.data : []);
      }
    } catch (error) {
      console.error("Error al obtener los productos del carrito:", error);
      setCartItems([]); // Asegurarse de que sea un array vacío en caso de error
    }
  };
  

  const handleFilterChange = (filterName, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterName]: value,
    }));
  };

  useEffect(() => {
    const filtered = prearmados.filter((item) => {
      return (
        (!filters.processor || item.processor === filters.processor) &&
        (!filters.ram || item.ram === filters.ram) &&
        (!filters.storage || item.storage === filters.storage) &&
        (!filters.graphics || item.graphics === filters.graphics) &&
        (!filters.priceRange ||
          (filters.priceRange === "0-500" && item.price <= 500) ||
          (filters.priceRange === "500-1000" &&
            item.price > 500 &&
            item.price <= 1000) ||
          (filters.priceRange === "1000+" && item.price > 1000))
      );
    });
    setFilteredPrearmados(filtered);
  }, [filters, prearmados]);

  const handleSelectPC = (pc) => {
    setSelectedPC(pc);
  };

  const handleAcceptPC = async () => {
    try {
      // Si no hay usuario, redirigir al login
      if (!userId) {
        window.location.href = "http://localhost:3000";
        return;
      }

      const response = await axios.post(
        `http://localhost:3002/cart/${userId}/addComponentToCart`,
        {
          componentId: selectedPC._id,
        }
      );
      if (response.status === 200) {
        setPopupVisible(false);
        setTimeout(() => {
          setPopupMensaje("Producto agregado al carrito");
          setPopupVisible(true);
          fetchCartItems(userId); // Actualizar el carrito después de agregar el producto
        }, 300);
      } else {
        throw new Error("Error al agregar el producto al carrito");
      }
    } catch (error) {
      console.error("Error al agregar producto al carrito:", error);
    }
  };

  const cerrarPopups = () => {
    setSelectedPC(null);
    setPopupVisible(false);
  };

  // Función para verificar si un prearmado está en el carrito
  const isInCart = (pcId) => {
    return cartItems.some((item) => item._id === pcId);
  };

  return (
    <div className="app">
      <Navbar />
      <div className="gray-boxD">
        <div className="filters-horizontal">
          <div className="filter-group">
            <label>Procesador:</label>
            <select
              value={filters.processor}
              onChange={(e) => handleFilterChange("processor", e.target.value)}
            >
              <option value="">Todos</option>
              {filterOptions.processor.map((processor) => (
                <option key={processor} value={processor}>
                  {processor}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>RAM:</label>
            <select
              value={filters.ram}
              onChange={(e) => handleFilterChange("ram", e.target.value)}
            >
              <option value="">Todos</option>
              {filterOptions.ram.map((ram) => (
                <option key={ram} value={ram}>
                  {ram}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Almacenamiento:</label>
            <select
              value={filters.storage}
              onChange={(e) => handleFilterChange("storage", e.target.value)}
            >
              <option value="">Todos</option>
              {filterOptions.storage.map((storage) => (
                <option key={storage} value={storage}>
                  {storage}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Tarjeta Gráfica:</label>
            <select
              value={filters.graphics}
              onChange={(e) => handleFilterChange("graphics", e.target.value)}
            >
              <option value="">Todas</option>
              {filterOptions.graphics.map((graphics) => (
                <option key={graphics} value={graphics}>
                  {graphics}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Rango de Precios:</label>
            <select
              value={filters.priceRange}
              onChange={(e) => handleFilterChange("priceRange", e.target.value)}
            >
              <option value="">Todos</option>
              <option value="0-500">$0 - $500</option>
              <option value="500-1000">$500 - $1000</option>
              <option value="1000+">Más de $1000</option>
            </select>
          </div>
        </div>

        {error && <p style={{ color: "red" }}>{error}</p>}

<div className="prearmados-cards">
  {filteredPrearmados.map((system) => (
    <div key={system._id} className="system-card" style={{ position: "relative" }}>
      {/* Mostrar ícono de carrito si ya está en el carrito */}
      {isInCart(system._id) && (
        <div
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            borderRadius: "50%",
            padding: "5px",
            color: "white",
          }}
        >
          <FaShoppingCart />
        </div>
      )}
      <h3>{system.nombre}</h3>
      <p>Procesador: {system.procesador}</p>
      <p>RAM: {system.ram}</p>
      <p>Almacenamiento: {system.almacenamiento}</p>
      <p>Tarjeta Gráfica: {system.graficos}</p>
      <p>Precio: ${system.precio}</p>
      <button onClick={() => handleSelectPC(system)}>
        {isInCart(system._id) ? "Ya está en el carrito" : "Seleccionar PC"}
      </button>
    </div>
  ))}
  {filteredPrearmados.length === 0 && (
    <p>No se encontraron equipos con los filtros seleccionados.</p>
  )}
</div>


        {selectedPC && (
          <div className="popup">
            <div className="popup-content">
              <h3>PC Seleccionada</h3>
              <p>Nombre: {selectedPC.nombre}</p>
              <p>Procesador: {selectedPC.procesador}</p>
              <p>RAM: {selectedPC.ram}</p>
              <p>Almacenamiento: {selectedPC.almacenamiento}</p>
              <p>Tarjeta Gráfica: {selectedPC.graficos}</p>
              <p>Precio: ${selectedPC.precio}</p>
              <button onClick={handleAcceptPC}>Agregar al carrito</button>
              <button className="btn-cerrar" onClick={cerrarPopups}>
                Cerrar
              </button>
            </div>
          </div>
        )}

        {popupVisible && (
          <div className="popup-overlay" onClick={cerrarPopups}>
            <div className="popup-message">
              <p>{popupMensaje}</p>
              <button onClick={cerrarPopups}>Cerrar</button>
            </div>
          </div>
        )}
      </div>

      <button className="back-button" onClick={() => window.history.back()}>
        Regresar
      </button>
    </div>
  );
};

export default Prearmados;
