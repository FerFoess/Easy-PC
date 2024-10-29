import React, { useState } from 'react';
import './css/libreSeleccion.css';

const LibreSeleccion = () => {
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');
  const [filtros, setFiltros] = useState({});
  const [productos, setProductos] = useState([]);

  // Lista de categorías (ejemplo)
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
    // Aquí puedes cargar productos específicos según la categoría seleccionada
  };

  // Manejador para aplicar filtros
  const aplicarFiltros = () => {
    // Aquí simulas la aplicación de filtros y actualizas la lista de productos
    const productosFiltrados = []; // Debe ser la lista de productos después de aplicar filtros
    setProductos(productosFiltrados);
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

      <div className="filtros">
        <h3>Filtros para {categoriaSeleccionada}</h3>
        {/* Aquí va el código para mostrar filtros específicos de cada categoría */}
        <button className="btn-aplicar-filtros" onClick={aplicarFiltros}>Aplicar Filtros</button>
      </div>

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
