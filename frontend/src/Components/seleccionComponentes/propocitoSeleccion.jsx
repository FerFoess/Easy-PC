import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/sty.css';
import Navbar from '../inicio/Navbar.js';
import axios from "axios";
import {jwtDecode} from 'jwt-decode';

const PropocitoSeleccion = () => {
  const navigate = useNavigate();
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');
  const [productos, setProductos] = useState([]);
  const [mostrarDetalles, setMostrarDetalles] = useState(null);
  const [propositoSeleccionado, setPropositoSeleccionado] = useState('');
  const [opciones, setOpciones] = useState([]);
  const [seleccionadas, setSeleccionadas] = useState([]);
  const [componentesSeleccionados, setComponentesSeleccionados] = useState({});
  const [error, setError] = useState('');
  const [userId, setUserId] = useState(null);
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupMensaje, setPopupMensaje] = useState('');

  const categorias = [
    'Procesador', 'Tarjeta Madre', 'Tarjeta de Video', 'Memoria RAM',
    'Almacenamiento Principal', 'Disipador', 'Gabinete',
    'Fuente de Poder', 'Ventiladores', 'Tarjetas y Módulos de Red', 'Windows'
  ];

  const propositos = ["VideoJuegos", "Trabajo", "Ocio", "Estudio"];

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(token);
      setUserId(decoded.userId);
    } else {
      window.location.href = 'http://localhost:3000';
    }
  }, []);

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

  const agregarAlCarrito = async (producto) => {
    try {
      const response = await axios.post(`http://localhost:3002/cart/${userId}/addComponentToCart`, {
        componentId: producto._id,
      });
      if (response.status === 200) {
        setPopupVisible(false);
        setTimeout(() => {
          setPopupMensaje('Producto agregado al carrito');
          setPopupVisible(true);
        }, 300);
      } else {
        throw new Error('Error al agregar el producto al carrito');
      }
    } catch (error) {
      console.error('Error al agregar producto al carrito:', error);
    }
  };

  const cerrarPopups = () => {
    setMostrarDetalles(null);
    setPopupVisible(false);
  };

  
const getImageUrl = (imagePath) => {
  if (imagePath) {
    return `http://localhost:3002/${imagePath.replace(/\\/g, '/')}`; // Convierte las barras invertidas en barras normales
  }
  return defaultImage; // Si no hay imagen, usa la predeterminada
};

const defaultImage = "https://mx.yeyiangaming.com/media/catalog/product/cache/63abef889f4ceaaa568fc4cf6e7149cb/y/c/ycm-apdra-01_dragoon_001c.jpg";



  return (
    <div className="propocitoeleccion">
      <Navbar />

      <div className="propositos">
        {propositos.map((proposito) => (
          <button
            key={proposito}
            className="proposito-btn"
            onClick={() => handlePropositoChange(proposito)}
          >
            {proposito}
          </button>
        ))}
      </div>

      {propositoSeleccionado && opciones.length > 0 && (
  <div className="options-container">
    {opciones.map((opcion, index) => (
      <div
        key={index}
        className={`option-card ${seleccionadas.includes(opcion) ? 'option-card-selected' : ''}`}
        onClick={() => handleOptionChange(opcion)}
      >
        <span>{opcion}</span>
        <div className="check-icon">
          <i className="fa fa-check"></i> {/* Icono de check usando FontAwesome */}
        </div>
      </div>
    ))}
  </div>
)}




      {error && <p className="error-message">{error}</p>}

      <div className="categorias">
        {categorias.map((categoria) => (
          <button
            key={categoria}
            className="categoria-btn"
            onClick={() => seleccionarCategoria(categoria)}
          >
            {categoria}
          </button>
        ))}
      </div>
      <div>
  {categoriaSeleccionada && (
    <h3 style={{ color: 'white' }}>Productos en la categoria {categoriaSeleccionada}</h3>
  )}
</div>

      <div className="productos">
        {productos.length > 0 ? (
          productos.map((producto, index) => (
            <div
              key={index}
              className="producto"
              onClick={() => mostrarDetallesProducto(producto)}
            >
                <img
  src={getImageUrl(producto.imagen)}
  alt={producto.nombre}
  className="imagen-producto"
  onError={(e) => e.target.src = defaultImage} // Si la imagen no se carga, usa la predeterminada
/>
              <h4>{producto.nombre}</h4>
              <p>{producto.descripcion}</p>
              <p>Precio: ${producto.precio}</p>
            </div>
          ))
        ) : (
          <p></p>
        )}
      </div>

      {mostrarDetalles && (
        <div className="popup">
          <div className="popup-content">
            <h4>{mostrarDetalles.nombre}</h4>
            <p>{mostrarDetalles.descripcion}</p>
            <p>Precio: ${mostrarDetalles.precio}</p>
            <div className="especificaciones">
              <h5>Especificaciones:</h5>
              <ul>
                {Object.entries(mostrarDetalles.especificaciones).map(([key, value]) => (
                  <li key={key}>
                    <strong>{key}:</strong> {value}
                  </li>
                ))}
              </ul>
            </div>
            <button className="btn-agregar-carrito" onClick={() => agregarAlCarrito(mostrarDetalles)}>
              Agregar al carrito
            </button>
            <button className="btn-cerrar" onClick={cerrarDetalles}>Cerrar</button>
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
  );
};

export default PropocitoSeleccion;
