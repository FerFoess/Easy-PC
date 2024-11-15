import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/libreSeleccion.css';
import axios from "axios";
import { jwtDecode } from 'jwt-decode';
import Navbar from '../inicio/Navbar.js';

const CategoriaSelector = ({ categorias, categoriaSeleccionada, seleccionarCategoria }) => (
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
  </div>
);

const Filtros = ({ categoria, filtrosDisponibles, filtros, manejarFiltroCambio, aplicarFiltros }) => (
  <div className="filtros">
    <h3>Filtros para {categoria}</h3>
    {Object.keys(filtrosDisponibles).length > 0 ? (
      Object.entries(filtrosDisponibles).map(([filtro, opciones]) => (
        <div key={filtro} className="filtro-dropdown">
          <label>{filtro}:</label>
          <select
            value={filtros[filtro] || ''}
            onChange={(e) => manejarFiltroCambio(filtro, e.target.value)}
          >
            <option value="">Selecciona una opción</option>
            {(Array.isArray(opciones) ? opciones : []).map((opcion) => (
              <option key={opcion} value={opcion}>
                {opcion}
              </option>
            ))}
          </select>
        </div>
      ))
    ) : (
      <p>No hay filtros disponibles para esta categoría.</p>
    )}
    <button className="btn-aplicar-filtros" onClick={aplicarFiltros}>Aplicar Filtros</button>
  </div>
);

const defaultImage = "https://mx.yeyiangaming.com/media/catalog/product/cache/63abef889f4ceaaa568fc4cf6e7149cb/y/c/ycm-apdra-01_dragoon_001c.jpg";

const getImageUrl = (imagePath) => {
  if (imagePath) {
    return `http://localhost:3002/${imagePath.replace(/\\/g, '/')}`; // Convierte las barras invertidas en barras normales
  }
  return defaultImage; // Si no hay imagen, usa la predeterminada
};


const ProductoCard = ({ producto, seleccionarProducto, mostrarDetallesProducto }) => (
  <div className="producto" onClick={() => mostrarDetallesProducto(producto)}>
    <div className="producto-imagen">
      {/* Asegúrate de que la propiedad 'imagen' esté correctamente definida en el objeto producto */}
      <img
  src={getImageUrl(producto.imagen)}
  alt={producto.nombre}
  className="imagen-producto"
  onError={(e) => e.target.src = defaultImage} // Si la imagen no se carga, usa la predeterminada
/>

    </div>
    <h4>{producto.nombre}</h4>
    <p>{producto.descripcion}</p>
    <p>Precio: ${producto.precio}</p>
  </div>
);

const LibreSeleccion = () => {
  const navigate = useNavigate();
  const categorias = [
    'Procesador', 'Tarjeta Madre', 'Tarjeta de Video', 'Memoria RAM',
    'Almacenamiento Principal', 'Disipador', 'Gabinete', 'Fuente de Poder',
    'Ventiladores', 'Tarjetas y Módulos de Red', 'Windows'
  ];

  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(categorias[0]); // Inicia en la primera categoría
  const [filtros, setFiltros] = useState({});
  const [productos, setProductos] = useState([]);
  const [filtrosDisponibles, setFiltrosDisponibles] = useState({});
  const [userId, setUserId] = useState(null);
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupMensaje, setPopupMensaje] = useState('');
  const [mostrarDetalles, setMostrarDetalles] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(token);
      setUserId(decoded.userId);
    } else {
      window.location.href = 'http://localhost:3000';
    }

    seleccionarCategoria(categorias[0]); // Carga la primera categoría al montar el componente
  }, []);

  const seleccionarCategoria = (categoria) => {
    setCategoriaSeleccionada(categoria);
    setFiltros({});
    setProductos([]);
    cargarFiltros(categoria);
    cargarProductos(categoria);
  };

  const cargarFiltros = (categoria) => {
    fetch(`http://localhost:3002/components/filtros/categoria?categoria=${categoria}`)
      .then((response) => response.json())
      .then((data) => {
        console.log('Filtros disponibles:', data); // Agrega un log para ver la respuesta
        setFiltrosDisponibles(data || {});
      })
      .catch((error) => console.error('Error fetching filters:', error));
  };
  

  const cargarProductos = (categoria) => {
    fetch(`/api/productos?categoria=${categoria}`)
      .then((response) => response.json())
      .then((data) => setProductos(data || []))
      .catch((error) => console.error('Error fetching products:', error));
  };

  const manejarFiltroCambio = (filtro, valor) => {
    setFiltros((prev) => ({
      ...prev,
      [filtro]: valor,
    }));
  };

  const aplicarFiltros = () => {
    const queryParams = new URLSearchParams({
      categoria: categoriaSeleccionada,
      ...filtros
    });

    fetch(`http://localhost:3002/components/buscar/filtros?${queryParams}`)
      .then((response) => response.json())
      .then((data) => {
        setProductos(data || []);
      })
      .catch((error) => console.error('Error fetching filtered products:', error));
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

  const mostrarDetallesProducto = (producto) => {
    setMostrarDetalles(producto);
  };



  const cerrarPopups = () => {
    setMostrarDetalles(null);
    setPopupVisible(false);
  };

  return (
    <div className="libreSeleccion">
      <Navbar />
      <CategoriaSelector
        categorias={categorias}
        categoriaSeleccionada={categoriaSeleccionada}
        seleccionarCategoria={seleccionarCategoria}
      />

      {categoriaSeleccionada && (
        <Filtros
          categoria={categoriaSeleccionada}
          filtrosDisponibles={filtrosDisponibles}
          filtros={filtros}
          manejarFiltroCambio={manejarFiltroCambio}
          aplicarFiltros={aplicarFiltros}
        />
      )}
         <div>
  {categoriaSeleccionada && (
    <h3 style={{ color: 'white' }}>Productos en la categoria {categoriaSeleccionada}</h3>
  )}
</div>

      <div className="productos">
        {productos.length > 0 ? (
          productos.map((producto) => (
            <ProductoCard
              key={producto.id}
              producto={producto}
              seleccionarProducto={agregarAlCarrito}
              mostrarDetallesProducto={mostrarDetallesProducto}
            />
          ))
        ) : (
          <p className="centro-texto"></p>
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
            <button className="btn-cerrar" onClick={cerrarPopups}>Cerrar</button>
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

      {error && <p style={{ color: 'red' }}>{error}</p>}
      
    </div>
    
  );
};

export default LibreSeleccion;
