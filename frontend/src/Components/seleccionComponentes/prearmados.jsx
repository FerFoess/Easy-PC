import React, { useState, useEffect } from "react";
import "./css/prearmados.css";

const Prearmados = () => {
  const [filters, setFilters] = useState({
    processor: "",
    ram: "",
    storage: "",
    graphics: "",
    priceRange: ""
  });
  const [systems, setSystems] = useState([]);
  const [error, setError] = useState("");

  const fetchSystems = async () => {
    try {
      const response = await fetch(`http://localhost:3002/prearmados`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(filters),
      });
      if (!response.ok) {
        throw new Error("Error en la respuesta del servidor");
      }
      const data = await response.json();
      setSystems(data);
    } catch (error) {
      console.error("Error fetching systems:", error);
      setError("Error al cargar los equipos pre-armados");
    }
  };

  const handleFilterChange = (filterName, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterName]: value,
    }));
  };

  const handleSearch = () => {
    fetchSystems(); // Llama a la función para buscar sistemas con los filtros actuales
  };

  return (
    <div className="app">
      <nav className="navbar">
        <div className="logo">
          <h1 className="logo-text">Easy-PC</h1>
        </div>
        <div className="nav-text">
          <h2>Explora nuestros equipos pre-armados</h2>
        </div>
      </nav>

      <div className="gray-boxD">
        <div className="filters-horizontal">
          <div className="filter-group">
            <label>Procesador:</label>
            <select
              value={filters.processor}
              onChange={(e) => handleFilterChange("processor", e.target.value)}
            >
              <option value="">Todos</option>
              <option value="Intel">Intel</option>
              <option value="AMD">AMD</option>
            </select>
          </div>

          <div className="filter-group">
            <label>RAM:</label>
            <select
              value={filters.ram}
              onChange={(e) => handleFilterChange("ram", e.target.value)}
            >
              <option value="">Todos</option>
              <option value="8GB">8GB</option>
              <option value="16GB">16GB</option>
              <option value="32GB">32GB</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Almacenamiento:</label>
            <select
              value={filters.storage}
              onChange={(e) => handleFilterChange("storage", e.target.value)}
            >
              <option value="">Todos</option>
              <option value="SSD">SSD</option>
              <option value="HDD">HDD</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Tarjeta Gráfica:</label>
            <select
              value={filters.graphics}
              onChange={(e) => handleFilterChange("graphics", e.target.value)}
            >
              <option value="">Todas</option>
              <option value="NVIDIA">NVIDIA</option>
              <option value="AMD">AMD</option>
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

          {/* Botón Buscar */}
          <button className="search-button" onClick={handleSearch}>
            Buscar
          </button>
        </div>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <div className="systems-grid">
          {systems.length > 0 ? (
            systems.map((system) => (
              <div className="system-card" key={system.id}>
                <img src={system.image} alt={system.name} className="system-image" />
                <h3>{system.name}</h3>
                <p>{system.processor} | {system.ram} RAM | {system.storage}</p>
                <p>Gráficos: {system.graphics}</p>
                <p>Precio: ${system.price}</p>
                <button className="view-details-button">
                  Ver detalles
                </button>
              </div>
            ))
          ) : (
            <p>No se encontraron equipos con los filtros aplicados.</p>
          )}
        </div>
      </div>

      <button className="back-button" onClick={() => window.history.back()}>
        Regresar
      </button>
    </div>
  );
};

export default Prearmados;
