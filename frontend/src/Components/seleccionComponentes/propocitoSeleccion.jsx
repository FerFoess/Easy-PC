import React, { useState, useEffect } from "react";
import "./css/sty.css";

const PropocitoSeleccion = () => {
  const [selectedPurpose, setSelectedPurpose] = useState('');
  const [options, setOptions] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [error, setError] = useState('');

  // Estados para mostrar componentes
  const [showComponents, setShowComponents] = useState({
    processors: false,
    motherboards: false,
    graphicsCards: false,
    ram: false,
    storage: false,
    cooling: false,
    case: false,
    powerSupplies: false,
    fans: false,
    networkCards: false,
    windows: false,
  });

  useEffect(() => {
    const fetchOptions = async () => {
      if (selectedPurpose) {
        try {
          const response = await fetch(`http://localhost:3002/options/purpose/${selectedPurpose}`);
          if (!response.ok) {
            throw new Error("Error en la respuesta del servidor");
          }
          const data = await response.json();
          setOptions(data.slice(0, 8));
          setSelectedOptions([]);
        } catch (error) {
          console.error("Error fetching options:", error);
          setError("Error al cargar las opciones");
        }
      }
    };

    fetchOptions();
  }, [selectedPurpose]);

  const handlePurposeChange = (purpose) => {
    setSelectedPurpose(purpose);
  };

  const handleOptionChange = (option) => {
    setSelectedOptions((prev) => 
      prev.includes(option.id) ? prev.filter((id) => id !== option.id) : [...prev, option.id]
    );
  };

  const toggleComponentVisibility = (component) => {
    setShowComponents((prev) => ({
      ...prev,
      [component]: !prev[component],
    }));
  };

  return (
    <div className="app">
      <nav className="navbar">
        <div className="logo">
          <h1 className="logo-text">Easy-PC</h1>
        </div>
        <div className="nav-text">
          <h2>¿Cómo quieres usar tu equipo?</h2>
        </div>
      </nav>

      <div className="gray-boxD">
        {/* Filtros */}
        <div className="filters">
          <div className="purpose-filters">
            {["Juegos", "Trabajo", "Ocio", "Estudio"].map((purpose) => (
              <button
                key={purpose}
                className={selectedPurpose === purpose ? "selected" : ""}
                onClick={() => handlePurposeChange(purpose)}
              >
                {purpose}
              </button>
            ))}
            {/* Botón de búsqueda */}
            <button className="search-button" onClick={() => { /* Aquí debes manejar la búsqueda */ }}>
              Buscar
            </button>
          </div>

          {/* Opciones basadas en el propósito seleccionado */}
          {selectedPurpose && options.length > 0 && (
            <div className="options-container">
              {options.map((option) => (
                <div className="option-checkbox" key={option.id}>
                  <input
                    type="checkbox"
                    id={option.id}
                    checked={selectedOptions.includes(option.id)}
                    onChange={() => handleOptionChange(option)}
                  />
                  <label htmlFor={option.id}>{option.name}</label>
                </div>
              ))}
            </div>
          )}

          {error && <p className="error-message">{error}</p>}
        </div>

        {/* Lista de componentes */}
        <div className="components-list">
          {Object.keys(showComponents).map((component) => (
            <div className="component-category" key={component} onClick={() => toggleComponentVisibility(component)}>
              <h3>{component.charAt(0).toUpperCase() + component.slice(1)}</h3>
              {showComponents[component] && (
                <div className="component-items">
                  {/* Aquí debes mapear los componentes disponibles */}
                  <div>{component.charAt(0).toUpperCase() + component.slice(1)} 1</div>
                  <div>{component.charAt(0).toUpperCase() + component.slice(1)} 2</div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <button className="back-button" onClick={() => window.history.back()}>
        Regresar
      </button>
    </div>
  );
};

export default PropocitoSeleccion;
