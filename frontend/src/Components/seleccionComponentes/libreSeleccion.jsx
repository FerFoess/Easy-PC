import React, { useState, useEffect } from 'react';
import './css/libreSeleccion.css';

const LibreSeleccion = () => {
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');
  const [filtros, setFiltros] = useState({});
  const [productos, setProductos] = useState([]);
  const [filtrosDisponibles, setFiltrosDisponibles] = useState([]);

  // Lista de categorías
  const categorias = [
    'Procesador',
    'Tarjeta Madre',
    'Tarjeta de Video',
    'Memoria RAM',
    'Almacenamiento Principal',
    'Disipador',
    'Gabinete',
    'Fuente de Poder',
    'Ventiladores',
    'Tarjetas y Módulos de Red',
    'Windows'
  ];

  // Manejador para seleccionar una categoría
  const seleccionarCategoria = (categoria) => {
    setCategoriaSeleccionada(categoria);
    setFiltros({});
    cargarFiltros(categoria); 
    cargarProductos(categoria); 
  };

  // Cargar filtros por categoría
  const cargarFiltros = (categoria) => {
    fetch(`http://localhost:3002/filter/filtros/categoria?categoria=${categoria}`)
      .then((response) => response.json())
      .then((data) => {
        console.log("Filtros cargados:", data); // Para depuración
        setFiltrosDisponibles(data.filtros || {}); // Asegúrate de que data tenga la estructura correcta
      })
      .catch((error) => console.error('Error fetching filters:', error));
  };

  // Cargar productos por categoría
  const cargarProductos = (categoria) => {
    fetch(`/api/productos?categoria=${categoria}`)
      .then((response) => response.json())
      .then((data) => {
        console.log("Productos cargados:", data); // Para depuración
        setProductos(data);
      })
      .catch((error) => console.error('Error fetching products:', error));
  };

  // Manejador para aplicar filtros
  const aplicarFiltros = () => {
    console.log("Filtros aplicados:", filtros); // Para depuración
    const queryParams = new URLSearchParams({
      categoria: categoriaSeleccionada,
      ...filtros // Expande los filtros en parámetros de consulta
    });

    fetch(`/api/productos?${queryParams}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error en la respuesta del servidor');
        }
        return response.json();
      })
      .then((data) => {
        console.log("Productos filtrados:", data); // Para depuración
        setProductos(data); // Actualiza la lista de productos filtrados
      })
      .catch((error) => console.error('Error fetching filtered products:', error));
  };

  return (
    <div className="libreSeleccion">
      <nav className="navbar">
        <div className="logo">
          <h1 className="logo-text">Easy-PC</h1>
        </div>
      </nav>

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

      {categoriaSeleccionada && (
        <div className="filtros">
          <h3>Filtros para {categoriaSeleccionada}</h3>
          {Object.entries(filtrosDisponibles).length > 0 ? (
            Object.entries(filtrosDisponibles).map(([filtro, opciones]) => (
              <div key={filtro} className="filtro-item">
                <label>{filtro}:</label>
                {opciones.map((opcion, index) => (
                  <div key={index}>
                    <input
                      type="checkbox"
                      onChange={(e) => {
                        const { checked } = e.target;
                        setFiltros((prev) => ({
                          ...prev,
                          [filtro]: {
                            ...(prev[filtro] || {}),
                            [opcion]: checked,
                          }
                        }));
                      }}
                    />
                    <label>{opcion}</label>
                  </div>
                ))}
              </div>
            ))
          ) : (
            <p>No hay filtros disponibles para esta categoría.</p>
          )}
          <button className="btn-aplicar-filtros" onClick={aplicarFiltros}>Aplicar Filtros</button>
        </div>
      )}

      <div className="productos">
        <h3>Productos en {categoriaSeleccionada}</h3>
        {productos.length > 0 ? (
          productos.map((producto, index) => (
            <div key={index} className="producto">
              <img src={producto.imagen} alt={producto.nombre} className="producto-imagen" />
              <div className="producto-info">
                <h4>{producto.nombre}</h4>
                <p>{producto.descripcion}</p>
                <p>Precio: ${producto.precio}</p>
                <button className="btn-detalle">Ver detalles</button>
              </div>
            </div>
          ))
        ) : (
          <p>No hay productos disponibles para esta categoría.</p>
        )}
      </div>
    </div>
  );
};

export default LibreSeleccion;
