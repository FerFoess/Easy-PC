import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./estilos.css";

const ProductList = () => {
  const [productos, setProductos] = useState([]);
  const navigate = useNavigate();

  // Estilos en línea para el Navbar
  const containerStyle = {
    paddingTop: '120px', // espacio para el navbar fijo
  };

  const navbarStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.5rem 2rem',
    backgroundColor: '#1e1f2b',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
    zIndex: 1000, // asegura que el navbar esté siempre encima
  };

  const logoImageStyle = {
    width: '90px',
    height: '90px',
    borderRadius: '50%',
  };

  const navButtonsStyle = {
    display: 'flex',
    gap: '1rem',
  };

  const navButtonStyle = {
    color: '#ffffff',
    backgroundColor: 'transparent',
    border: '2px solid #5c6bc0',
    padding: '0.6rem 1.2rem',
    borderRadius: '20px',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease, transform 0.2s ease',
  };

  const navButtonHoverStyle = {
    backgroundColor: '#5c6bc0',
    transform: 'scale(1.05)',
  };

  useEffect(() => {
    fetch("http://localhost:3002/catego")
      .then((respuesta) => respuesta.json())
      .then((datos) => {
        console.log("Productos recibidos:", datos); // Verifica los datos recibidos
        setProductos(datos);
      })
      .catch((error) => console.error("Error al obtener productos:", error));
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar esta categoría?")) {
      try {
        const response = await fetch(`http://localhost:3002/catego/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          alert("Categoría eliminada correctamente");

          // Filtrar el producto eliminado de la lista
          setProductos((prevProductos) => prevProductos.filter((producto) => producto._id !== id));

        } else {
          alert("Hubo un error al eliminar la categoría");
        }
      } catch (error) {
        console.error("Error al eliminar la categoría:", error);
        alert("Hubo un error al eliminar la categoría");
      }
    }
  };

  return (
    <div>
      {/* Navbar */}
      <div style={containerStyle}>
        <nav style={navbarStyle}>
          <div className="logo">
            <img src="/assets/logo.png" alt="Logo" style={logoImageStyle} />
          </div>
          <div style={navButtonsStyle}>
            <button
              style={navButtonStyle}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = navButtonHoverStyle.backgroundColor)}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              onClick={() => navigate('/estadisticas')}
            >
              Estadisticas
            </button>
            <button
              style={navButtonStyle}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = navButtonHoverStyle.backgroundColor)}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              onClick={() => navigate('/productform')}
            >
              Agregar Productos
            </button>
            <button
              style={navButtonStyle}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = navButtonHoverStyle.backgroundColor)}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              onClick={() => navigate('/login')}
            >
              Cerrar sesión
            </button>
          </div>
        </nav>
      </div>

      {/* Lista de productos */}
      <div className="foess-product-product-list-container">
        <h2 style={{ color: "white" }}>Lista de Productos</h2>

        <div className="foess-product-product-card-container">
          {productos.map((producto) => (
            <div key={producto._id} className="foess-product-product-card">
              <div className="foess-product-product-card-image">
                {producto.imagen && typeof producto.imagen === "string" && producto.imagen.trim() !== "" ? (
                  <img src={producto.imagen} alt={producto.nombre} />
                ) : (
                  <p>Imagen no disponible</p>
                )}
              </div>
              <div className="foess-product-product-card-content">
                <h3>{producto.nombre}</h3>
                <p>{producto.descripcion}</p>
                <p>Precio: ${producto.precio}</p>
                <p>Categoría: {producto.categoria}</p>
                <p>Tipo: {producto.tipo}</p>
                <p>Propósito: {producto.proposito}</p>
                <p>Stock: {producto.stock}</p> {/* Mostrar el stock del producto */}
              </div>
              <div className="foess-product-product-card-actions">
              <button
  className="foess-product-product-button"
  onClick={() => navigate('/productform', { state: { product: producto } })}
>
  Editar
</button>
                <br />
                <br />
                <button
                  className="foessmalo-product-product-button"
                  onClick={() => handleDelete(producto._id)} // Usar _id
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductList;
