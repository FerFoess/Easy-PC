import React, { useState, useEffect } from "react";
import "./css/sty.css";

const PropocitoSeleccion = () => {
  const [selectedPurpose, setSelectedPurpose] = useState('');
  const [options, setOptions] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]); // Estado para opciones seleccionadas
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOptions = async () => {
      if (selectedPurpose) {
        try {
          const response = await fetch(`http://localhost:3002/options/purpose/${selectedPurpose}`); // Cambia esta URL por la correcta
          if (!response.ok) {
            throw new Error("Error en la respuesta del servidor");
          }
          const data = await response.json();
          setOptions(data.slice(0, 8)); // Limitar a los primeros 8
          setSelectedOptions([]); // Limpiar opciones seleccionadas al cambiar el propósito
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
    if (selectedOptions.includes(option.id)) {
      setSelectedOptions((prev) => prev.filter((id) => id !== option.id));
    } else {
      setSelectedOptions((prev) => [...prev, option.id]);
    }
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


      <div className="gray-box">
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
          </div>

          {/* Opciones basadas en el propósito seleccionado */}
          {selectedPurpose && options.length > 0 && (
            <div className="options-container">
              {options.map((option) => (
                <div className="option-checkbox" key={option.id}> {/* Usar option.id como key */}
                  <input
                    type="checkbox"
                    id={option.id} // Usar el id del option para el input
                    checked={selectedOptions.includes(option.id)} // Manejo del estado del checkbox
                    onChange={() => handleOptionChange(option)}
                  />
                  <label htmlFor={option.id}>{option.name}</label> {/* Mostrar el name */}
                </div>
              ))}
            </div>
          )}

          {error && <p style={{ color: "red" }}>{error}</p>} {/* Mensaje de error */}
        </div>
      </div>

      <button className="back-button" onClick={() => window.history.back()}>
        Regresar
      </button>
    </div>
  );
};

export default PropocitoSeleccion;
