import React, { useState, useEffect } from 'react';
import './css/libreSeleccion.css';

const LibreSeleccion = () => {
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');
  const [filtros, setFiltros] = useState({});
  const [productos, setProductos] = useState([]);
  const [filtrosDisponibles, setFiltrosDisponibles] = useState({});
  const [seleccionPorCategoria, setSeleccionPorCategoria] = useState({});
  const [mostrarDetalles, setMostrarDetalles] = useState(null);

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
    fetch(`http://localhost:3002/components/filtros/categoria?categoria=${categoria}`)
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
    if (!categoriaSeleccionada) {
      console.error('No se ha seleccionado una categoría.');
      return;
    }

    const queryParams = new URLSearchParams({
      categoria: categoriaSeleccionada,
      ...filtros
    });

    fetch(`http://localhost:3002/components/buscar/filtros?${queryParams}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (data.length > 0) {
          setProductos(data);
        } else {
          console.warn('No se encontraron productos con los filtros aplicados.');
          setProductos([]);
        }
      })
      .catch((error) => {
        console.error('Error fetching filtered products:', error);
      });
  };

  const seleccionarProducto = (producto) => {
    setSeleccionPorCategoria((prev) => ({
      ...prev,
      [categoriaSeleccionada]: producto,
    }));
  };

  const mostrarDetallesProducto = (producto) => {
    setMostrarDetalles(producto);
  };

  const cerrarDetalles = () => {
    setMostrarDetalles(null);
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
              <div onClick={() => seleccionarProducto(producto)}>
                <h4>{producto.nombre}</h4>
                <p>{producto.descripcion}</p>
                <p>Precio: ${producto.precio}</p>
                <button className="btn-detalle" onClick={() => mostrarDetallesProducto(producto)}>Ver detalles</button>
              </div>
            </div>
          ))
        ) : (
          <p>"Porfavor selecciona una categoria y selecciona los filtros para esta"</p>
        )}
      </div>

      {mostrarDetalles && (
        <div className="popup">
          <div className="popup-content">
            <h4>{mostrarDetalles.nombre}</h4>
            <p>{mostrarDetalles.descripcion}</p>
            <p>Precio: ${mostrarDetalles.precio}</p>
            <button className="btn-cerrar" onClick={cerrarDetalles}>Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LibreSeleccion;
