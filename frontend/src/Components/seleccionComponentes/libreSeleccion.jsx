import React, { useState, useEffect } from 'react';
import './css/libreSeleccion.css';

const LibreSeleccion = () => {
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');
  const [filtros, setFiltros] = useState({});
  const [productos, setProductos] = useState([]);
  const [filtrosDisponibles, setFiltrosDisponibles] = useState({});

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

  const seleccionarCategoria = (categoria) => {
    setCategoriaSeleccionada(categoria);
    setFiltros({});
    cargarFiltros(categoria);
    cargarProductos(categoria);
  };

  const cargarFiltros = (categoria) => {
    fetch(`http://localhost:3002/filter/filtros/categoria?categoria=${categoria}`)
      .then((response) => response.json())
      .then((data) => setFiltrosDisponibles(data || {}))
      .catch((error) => console.error('Error fetching filters:', error));
  };

  const cargarProductos = (categoria) => {
    fetch(`/api/productos?categoria=${categoria}`)
      .then((response) => response.json())
      .then((data) => setProductos(data))
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

    fetch(`/api/productos?${queryParams}`)
      .then((response) => response.json())
      .then((data) => setProductos(data))
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
          {Object.keys(filtrosDisponibles).length > 0 ? (
            Object.entries(filtrosDisponibles).map(([filtro, opciones]) => (
              <div key={filtro} className="filtro-dropdown">
                <label>{filtro}:</label>
                <select
                  value={filtros[filtro] || ''}
                  onChange={(e) => manejarFiltroCambio(filtro, e.target.value)}
                >
                  <option value="">Selecciona una opción</option>
                  {opciones.map((opcion) => (
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
      )}

      <div className="productos">
        <h3>Productos en {categoriaSeleccionada}</h3>
        {productos.length > 0 ? (
          productos.map((producto, index) => (
            <div key={index} className="producto">
              <img src={producto.imagen} alt={producto.nombre} />
              <div>
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
