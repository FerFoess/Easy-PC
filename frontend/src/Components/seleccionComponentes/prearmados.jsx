import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./css/prearmados.css";

const Prearmados = () => {
  const navigate = useNavigate();

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
  const [prearmados, setPrearmados] = useState([]);
  const [filteredPrearmados, setFilteredPrearmados] = useState([]);
  const [selectedPC, setSelectedPC] = useState(null); // Estado para el prearmado seleccionado
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPrearmados();
  }, []);

  const fetchPrearmados = async () => {
    try {
      const response = await fetch("http://localhost:3002/prearmado");

      if (!response.ok) {
        throw new Error("Error en la respuesta del servidor");
      }

      const data = await response.json();
      setPrearmados(data);

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

      setFilteredPrearmados(data);
    } catch (error) {
      console.error("Error fetching prearmados:", error);
      setError("Error al cargar los prearmados");
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
          (filters.priceRange === "500-1000" && item.price > 500 && item.price <= 1000) ||
          (filters.priceRange === "1000+" && item.price > 1000))
      );
    });
    setFilteredPrearmados(filtered);
  }, [filters, prearmados]);

  const handleSelectPC = (pc) => {
    setSelectedPC(pc);
  };

  const handleAcceptPC = () => {
    if (selectedPC) {
      navigate('/resumenCompra', { state: { selecciones: { pcSeleccionada: [selectedPC] } } });
    }
  };  

  return (
    <div className="app">
      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">
          <img src="/assets/logo.png" alt="Logo" className="logo-image" />
        </div>
        <div className="nav-buttons">
          <button className="nav-button" onClick={() => navigate('/inicio')}>Inicio</button>
          <button className="nav-button" onClick={() => navigate('/Tipoequipo')}>Arma tu pc</button>
          <button className="nav-button" onClick={() => navigate('/catalogo-componentes')}>Catálogo de componentes</button>
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

        {error && <p style={{ color: "red" }}>{error}</p>}

        <div className="prearmados-cards">
          {filteredPrearmados.map((system) => (
            <div key={system._id} className="system-card">
              <h3>{system.name}</h3>
              <p>Procesador: {system.processor}</p>
              <p>RAM: {system.ram}</p>
              <p>Almacenamiento: {system.storage}</p>
              <p>Tarjeta Gráfica: {system.graphics}</p>
              <p>Precio: ${system.price}</p>
              <button onClick={() => handleSelectPC(system)}>
                Seleccionar PC
              </button>
            </div>
          ))}
          {filteredPrearmados.length === 0 && <p>No se encontraron equipos con los filtros seleccionados.</p>}
        </div>
        
        {selectedPC && (
          <div className="selected-pc">
            <h3>PC Seleccionada</h3>
            <p>Nombre: {selectedPC.name}</p>
            <p>Procesador: {selectedPC.processor}</p>
            <p>RAM: {selectedPC.ram}</p>
            <p>Almacenamiento: {selectedPC.storage}</p>
            <p>Tarjeta Gráfica: {selectedPC.graphics}</p>
            <p>Precio: ${selectedPC.price}</p>
            <button onClick={handleAcceptPC}>Aceptar</button>
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
