import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/libreSeleccion.css';
import Navbar from '../inicio/Navbar.js';
const LibreSeleccion = () => {
  const navigate = useNavigate();
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');
  const [productos, setProductos] = useState([]);
  const [mostrarDetalles, setMostrarDetalles] = useState(null);
  const [propositoSeleccionado, setPropositoSeleccionado] = useState('');
  const [opciones, setOpciones] = useState([]);
  const [seleccionadas, setSeleccionadas] = useState([]);
  const [componentesSeleccionados, setComponentesSeleccionados] = useState({});
  const [error, setError] = useState('');

  const categorias = [
    'Procesador', 'Tarjeta Madre', 'Tarjeta de Video', 'Memoria RAM',
    'Almacenamiento Principal', 'Disipador', 'Gabinete',
    'Fuente de Poder', 'Ventiladores', 'Tarjetas y Módulos de Red', 'Windows'
  ];

  const propositos = ["VideoJuegos", "Trabajo", "Ocio", "Estudio"];

  useEffect(() => {
    if (propositoSeleccionado) {
      fetchOpciones();
    }
  }, [propositoSeleccionado]);

  useEffect(() => {
    if (categoriaSeleccionada) {
      buscarProductos();
    }
  }, [categoriaSeleccionada, seleccionadas]);

  const fetchOpciones = async () => {
    try {
      const response = await fetch(`http://localhost:3002/components/components/purposes/${propositoSeleccionado}`);
      if (!response.ok) throw new Error("Error en la respuesta del servidor");
      const data = await response.json();
      setOpciones(data.slice(0, 8));
    } catch (error) {
      console.error("Error al cargar las opciones:", error);
      setError("Error al cargar las opciones");
    }
  };

  const handlePropositoChange = (proposito) => {
    setPropositoSeleccionado(proposito);
  };

  const seleccionarCategoria = (categoria) => {
    setCategoriaSeleccionada(categoria);
  };

  const handleOptionChange = (option) => {
    setSeleccionadas((prev) => {
      const newSeleccionadas = prev.includes(option)
        ? prev.filter((selected) => selected !== option)
        : [...prev, option];
      return newSeleccionadas;
    });
  };

  const buscarProductos = async () => {
    if (!categoriaSeleccionada || seleccionadas.length === 0) {
      setError("Selecciona una categoría y al menos una opción.");
      return;
    }

    const selectedOptionsPayload = {
      categoria: categoriaSeleccionada,
      propositos: seleccionadas,
    };

    try {
      const response = await fetch(`http://localhost:3002/components/components/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ selectedOptions: selectedOptionsPayload }),
      });
      const data = await response.json();
      setProductos(data);
      setError('');
    } catch (error) {
      console.error("Error al buscar productos:", error);
      setError("Error al buscar productos");
    }
  };

  const mostrarDetallesProducto = (producto) => {
    setMostrarDetalles(producto);
  };

  const cerrarDetalles = () => {
    setMostrarDetalles(null);
  };

  const seleccionarComponente = (producto) => {
    setComponentesSeleccionados((prev) => {
      const newComponentes = prev[categoriaSeleccionada] || [];
      const isAlreadySelected = newComponentes.find(p => p.id === producto.id);

      if (isAlreadySelected) {
        // Si el producto ya está seleccionado, lo eliminamos
        return {
          ...prev,
          [categoriaSeleccionada]: newComponentes.filter(p => p.id !== producto.id),
        };
      } else {
        // Si no está seleccionado, lo añadimos
        return {
          ...prev,
          [categoriaSeleccionada]: [...newComponentes, { ...producto, proposito: propositoSeleccionado }],
        };
      }
    });
  };

  const isSeleccionado = (producto) => 
    componentesSeleccionados[categoriaSeleccionada]?.some(p => p.id === producto.id);

  const obtenerProductosMostrados = () => {
    const productosMostrados = [...productos];

    // Aquí se incluyen solo los productos seleccionados
    const seleccionadosDeCategoria = componentesSeleccionados[categoriaSeleccionada] || [];
    seleccionadosDeCategoria.forEach((producto) => {
      if (!productosMostrados.some(p => p.id === producto.id)) {
        productosMostrados.push(producto);
      }
    });

    return productosMostrados;
  };

  const finalizarSeleccion = () => {
    if (Object.keys(componentesSeleccionados).length === 0) {
      setError("No has seleccionado ningún componente.");
      return;
    }
    navigate('/resumenCompra', { state: { selecciones: componentesSeleccionados } });
  };

  return (
    <div className="libreSeleccion">
      <Navbar />

      <div className="propositos">
        {propositos.map((proposito) => (
          <button
            key={proposito}
            className={`proposito-btn ${proposito === propositoSeleccionado ? 'seleccionado' : ''}`}
            onClick={() => handlePropositoChange(proposito)}
          >
            {proposito}
          </button>
        ))}
      </div>

      {propositoSeleccionado && opciones.length > 0 && (
        <div className="options-container">
          {opciones.map((opcion, index) => (
            <div className="option-checkbox" key={index}>
              <input
                type="checkbox"
                id={`option-${index}`}
                checked={seleccionadas.includes(opcion)}
                onChange={() => handleOptionChange(opcion)}
              />
              <label htmlFor={`option-${index}`}>{opcion}</label>
            </div>
          ))}
        </div>
      )}

      {error && <p className="error-message">{error}</p>}

      <div className="categorias">
        {categorias.map((categoria) => (
          <button
            key={categoria}
            className={`categoria-btn ${categoria === categoriaSeleccionada ? 'seleccionada' : ''}`}
            onClick={() => seleccionarCategoria(categoria)}
          >
            {categoria}
          </button>
        ))}
        <button 
          className="categoria-btn finalizar-seleccion" 
          style={{ backgroundColor: 'green', color: 'white' }} 
          onClick={finalizarSeleccion}
        >
          Finalizar Selección
        </button>
      </div>

      <div className="productos">
        <h3>Productos en {categoriaSeleccionada}</h3>
        {obtenerProductosMostrados().length > 0 ? (
          obtenerProductosMostrados().map((producto, index) => (
            <div
              key={index}
              className={`producto ${isSeleccionado(producto) ? 'seleccionado' : 'no-seleccionado'}`}
              onClick={() => mostrarDetallesProducto(producto)}
              style={{ backgroundColor: isSeleccionado(producto) ? 'purple' : '#333' }}
            >
              <h4>{producto.nombre}</h4>
              <p>{producto.descripcion}</p>
              <p>Precio: ${producto.precio}</p>
            </div>
          ))
        ) : (
          <p>Por favor selecciona un propósito y una categoría para ver los productos.</p>
        )}
      </div>

      {mostrarDetalles && (
        <div className="popup">
          <div className="popup-content">
            <h4>{mostrarDetalles.nombre}</h4>
            <p>{mostrarDetalles.descripcion}</p>
            <p>Precio: ${mostrarDetalles.precio}</p>
            <button className="btn-seleccionar" onClick={() => seleccionarComponente(mostrarDetalles)}>
              {isSeleccionado(mostrarDetalles) ? 'Quitar Selección' : 'Seleccionar'}
            </button>
            <button className="btn-cerrar" onClick={cerrarDetalles}>Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LibreSeleccion;
