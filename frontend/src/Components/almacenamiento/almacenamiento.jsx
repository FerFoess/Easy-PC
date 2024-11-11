import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./estilos.css";
import ProductForm from "./ProductoForm"; // Manteniendo la importación de ProductForm

const ProductList = () => {
  const [productos, setProductos] = useState([]);

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
          // Actualiza el estado de las categorías en tu frontend (si es necesario)
        } else {
          alert("Hubo un error al eliminar la categoría");
        }
      } catch (error) {
        console.error("Error al eliminar la categoría:", error);
        alert("Hubo un error al eliminar la categoría");
      }
    }
  };
  
  

  const handleAddProduct = (nuevoProducto) => {
    setProductos((prevProductos) => [...prevProductos, nuevoProducto]);
  };

  return (
    <div className="foess-product-product-list-container">
      <h2 style={{ color: "white" }}>Lista de Productos</h2>
      {/* Formulario para agregar productos */}
      <div className="foess-product-form-container">
        <ProductForm onAddProduct={handleAddProduct} />
      </div>

      <div className="foess-product-product-card-container">
        {productos.map((producto) => (
          <div key={producto.id} className="foess-product-product-card">
            <div className="foess-product-product-card-image">
              <img src={producto.imagen} alt={producto.nombre} />
            </div>
            <div className="foess-product-product-card-content">
              <h3>{producto.nombre}</h3>
              <p>{producto.descripcion}</p>
              <p>Precio: ${producto.precio}</p>
              <p>Categoría: {producto.categoria}</p>
            </div>
            <div className="foess-product-product-card-actions">
              <Link
                to={`/editar-producto/${producto.id}`}
                className="foess-product-product-button"
              >
                Editar
              </Link>
              <br />
              <br />
              <button
                className="foessmalo-product-product-button"
                onClick={() => handleDelete(producto.id)}
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
