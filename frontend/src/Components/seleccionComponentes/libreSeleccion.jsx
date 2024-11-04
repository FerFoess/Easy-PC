import React, { useState } from 'react';

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

  // Estilos en línea
  const appStyle = {
    fontFamily: "Arial, sans-serif",
    color: "#ffffff",
    backgroundColor: "#27293d",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "20px",
  };

  const navbarStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    backgroundColor: "#1e1f2b",
    padding: "1rem 0",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
  };

  const logoTextStyle = {
    fontSize: "2rem",
  };

  const categoriasStyle = {
    display: "flex",
    gap: "1rem",
    margin: "2rem 0",
  };

  const categoriaBtnStyle = {
    backgroundColor: "#3b3c50",
    color: "#ffffff",
    border: "none",
    padding: "10px 20px",
    borderRadius: "20px",
    cursor: "pointer",
    transition: "background-color 0.3s ease, transform 0.2s ease",
  };

  const categoriaSeleccionadaStyle = {
    backgroundColor: "#5c6bc0",
    transform: "scale(1.05)",
  };

  const filtrosStyle = {
    margin: "1.5rem 0",
    textAlign: "center",
  };

  const btnAplicarFiltrosStyle = {
    backgroundColor: "#5c6bc0",
    color: "#ffffff",
    border: "none",
    padding: "10px 20px",
    borderRadius: "20px",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  };

  const productosStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
  };

  const productoStyle = {
    backgroundColor: "#3b3c50",
    borderRadius: "10px",
    padding: "10px",
    margin: "10px 0",
    display: "flex",
    alignItems: "center",
    width: "80%",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
  };

  const productoImageStyle = {
    width: "100px",
    height: "auto",
    borderRadius: "10px",
    marginRight: "10px",
  };

  const detalleBtnStyle = {
    backgroundColor: "#5c6bc0",
    color: "#ffffff",
    border: "none",
    padding: "8px 16px",
    borderRadius: "20px",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  };

  return (
    <div style={appStyle}>
      <nav style={navbarStyle}>
        <div className="logo">
          <h1 style={logoTextStyle}>Easy-PC</h1>
        </div>
      </nav>

      <div style={categoriasStyle}>
        {categorias.map((categoria) => (
          <button
            key={categoria}
            style={{
              ...categoriaBtnStyle,
              ...(categoria === categoriaSeleccionada ? categoriaSeleccionadaStyle : {}),
            }}
            onClick={() => seleccionarCategoria(categoria)}
          >
            {categoria}
          </button>
        ))}
      </div>

      <div style={filtrosStyle}>
        <h3>Filtros para {categoriaSeleccionada}</h3>
        {/* Aquí va el código para mostrar filtros específicos de cada categoría */}
        <button style={btnAplicarFiltrosStyle} onClick={aplicarFiltros}>Aplicar Filtros</button>
      </div>

      <div style={productosStyle}>
        <h3>Productos en {categoriaSeleccionada}</h3>
        {productos.length > 0 ? (
          productos.map((producto, index) => (
            <div key={index} style={productoStyle}>
              <img src={producto.imagen} alt={producto.nombre} style={productoImageStyle} />
              <div>
                <h4>{producto.nombre}</h4>
                <p>{producto.descripcion}</p>
                <p>Precio: ${producto.precio}</p>
                <button style={detalleBtnStyle}>Ver detalles</button>
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
