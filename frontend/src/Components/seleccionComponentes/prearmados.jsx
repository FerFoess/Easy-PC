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
  const [filterOptions, setFilterOptions] = useState({
    processor: [],
    ram: [],
    storage: [],
    graphics: []
  });
  const [selectedSystem, setSelectedSystem] = useState(null); // Estado para el sistema armado
  const [error, setError] = useState("");

  useEffect(() => {
    fetchFilterOptions();
  }, []);

  const fetchFilterOptions = async () => {
    try {
      const response = await fetch("http://localhost:3002/prearmado");

      if (!response.ok) {
        throw new Error("Error en la respuesta del servidor");
      }

      const data = await response.json();

      const processors = [...new Set(data.map(item => item.processor))];
      const rams = [...new Set(data.map(item => item.ram))];
      const storages = [...new Set(data.map(item => item.storage))];
      const graphicsCards = [...new Set(data.map(item => item.graphics))];

      setFilterOptions({
        processor: processors,
        ram: rams,
        storage: storages,
        graphics: graphicsCards
      });
    } catch (error) {
      console.error("Error fetching filter options:", error);
      setError("Error al cargar las opciones de filtros");
    }
  };

  const handleFilterChange = (filterName, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterName]: value,
    }));
  };

  const handleBuildSystem = () => {
    // Genera un sistema con los filtros seleccionados
    setSelectedSystem({
      processor: filters.processor,
      ram: filters.ram,
      storage: filters.storage,
      graphics: filters.graphics,
      priceRange: filters.priceRange,
    });
  };

  return (
    <div className="app">
      <nav className="navbar">
        <div className="logo">
          <h1 className="logo-text">Easy-PC</h1>
        </div>
        <div className="nav-text">
          <h2>Arma tu propio equipo pre-armado</h2>
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
              {filterOptions.processor.map((processor) => (
                <option key={processor} value={processor}>{processor}</option>
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
                <option key={ram} value={ram}>{ram}</option>
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
                <option key={storage} value={storage}>{storage}</option>
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
                <option key={graphics} value={graphics}>{graphics}</option>
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
        <button className="build-button" onClick={handleBuildSystem}>
          Aceptar
        </button>

        {error && <p style={{ color: "red" }}>{error}</p>}

        {/* Muestra la tarjeta del sistema armado */}
        {selectedSystem && (
          <div className="system-card">
            <h3>PC</h3>
            <p>Procesador: {selectedSystem.processor || "No seleccionado"}</p>
            <p>RAM: {selectedSystem.ram || "No seleccionada"}</p>
            <p>Almacenamiento: {selectedSystem.storage || "No seleccionado"}</p>
            <p>Tarjeta Gráfica: {selectedSystem.graphics || "No seleccionada"}</p>
            <p>Rango de Precios: {selectedSystem.priceRange || "No seleccionado"}</p>
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
