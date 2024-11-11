import React, { useState, useEffect } from 'react';
import ProductForm from './ProductoForm';
import './estilos.css';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Cargar productos desde la base de datos
  useEffect(() => {
    fetch('http://localhost:3002/catego')
      .then((respuesta) => respuesta.json())
      .then((datos) => setProducts(datos))
      .catch((error) => console.error('Error al obtener productos:', error));
  }, []);

  // Función para agregar o actualizar un producto
  const addOrUpdateProduct = (product) => {
    if (selectedProduct) {
      // Si estamos editando, actualizamos el producto en la lista
      setProducts(products.map((p) => (p.id === product.id ? product : p)));
    } else {
      // Si estamos agregando, creamos un nuevo producto
      setProducts([...products, product]);
    }
    setSelectedProduct(null); // Reset selected product after save
  };

  // Función para eliminar un producto
  const handleDelete = (id) => {
    console.log("ID enviado para eliminación:", id); // Depurar el ID que se pasa
    
    fetch(`http://localhost:3002/catego/${id}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error al eliminar la categoría');
        }
        return response.json();
      })
      .then((data) => {
        console.log('Categoría eliminada:', data);
        setProducts(products.filter((product) => product._id !== id));
      })
      .catch((error) => {
        console.error('Error al eliminar la categoría:', error);
        alert('Hubo un error al eliminar la categoría. Inténtalo de nuevo.');
      });
  };
  
  
  

  // Función para editar un producto
  const handleEdit = (product) => {
    setSelectedProduct(product);
  };

  return (
    <div className="container">
      <h1>Lista de Productos</h1>
      <ProductForm onProductSaved={addOrUpdateProduct} selectedProduct={selectedProduct} />
      <div className="card-container">
        {products.map((product) => (
          <div className="card" key={product.id}>
            <div className="card-image">
            {product.imagen && (
              <img
                src={`http://localhost:3002/${product.imagen}`}
                alt={product.nombre}
                width="100"
              />
            )}
          </div>


            <div className="card-content">
              <h3>{product.nombre}</h3>
              <p><strong>Categoría:</strong> {product.categoria}</p>
              <p><strong>Precio:</strong> ${product.precio}</p>
              <p><strong>Descripción:</strong> {product.descripcion}</p>
            </div>
            <div className="card-actions">
              <button className="button" onClick={() => handleEdit(product)}>Editar</button>
              <button className='button' onClick={() => handleDelete(product._id)}>Eliminar</button>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
