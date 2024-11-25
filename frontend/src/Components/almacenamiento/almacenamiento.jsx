import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./estilos.css";
import Navbar from '../navBarAdmins/navbar';

const ProductList = () => {
  const [productos, setProductos] = useState([]);
  const [filtroCategoria, setFiltroCategoria] = useState("");
  const [filtroProposito, setFiltroProposito] = useState("");
  const [categorias, setCategorias] = useState([]);
  const [propositos, setPropositos] = useState([]);
  const navigate = useNavigate();

  // Obtener productos desde el servidor
  useEffect(() => {
    fetch("http://localhost:3002/catego")
      .then((respuesta) => respuesta.json())
      .then((datos) => {
        setProductos(datos);

        // Obtener listas únicas de categorías y propósitos
        const categoriasUnicas = [...new Set(datos.map((producto) => producto.categoria))];
        const propositosUnicos = [...new Set(datos.map((producto) => producto.propositos))];

        setCategorias(categoriasUnicas);
        setPropositos(propositosUnicos);
      })
      .catch((error) => console.error("Error al obtener productos:", error));
  }, []);

  // Manejo de eliminación de producto
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

  // Función para obtener la URL de la imagen
  const getImageUrl = (imagePath) => {
    if (imagePath) {
      // Reemplazar las barras invertidas por barras normales y generar la URL
      return `http://localhost:3002/${imagePath.replace(/\\/g, '/')}`;
    }
    return '/assets/default-image.png'; // Imagen predeterminada si no hay imagen
  };

  // Filtrar productos en función de la categoría y el propósito seleccionados
  const productosFiltrados = productos.filter((producto) => {
    const coincideCategoria = filtroCategoria
      ? producto.categoria === filtroCategoria
      : true;
  
    const coincideProposito = filtroProposito
      ? producto.propositos.some((proposito) =>
          proposito.toLowerCase().includes(filtroProposito.toLowerCase())
        )
      : true;
  
    return coincideCategoria && coincideProposito;
  });
  
  


  return (
    <div>
      <Navbar />
      <div className="foess-product-product-list-container">
        <h2 style={{ color: "white" }}>Lista de Productos</h2>

        {/* Filtros */}
        <div className="foess-product-filters">
          <label style={{ color: "white", marginRight: "10px" }}>
            Filtrar por categoría:
            <select
              value={filtroCategoria}
              onChange={(e) => setFiltroCategoria(e.target.value)}
            >
              <option value="">Todas</option>
              {categorias.map((categoria, index) => (
                <option key={index} value={categoria}>
                  {categoria}
                </option>
              ))}
            </select>
          </label>

          <label style={{ color: "white", marginLeft: "20px" }}>
  Filtrar por propósito:
  <select
    value={filtroProposito}
    onChange={(e) => setFiltroProposito(e.target.value)}
  >
    <option value="">Todos</option>
    {propositos.map((proposito, index) => (
      <option key={index} value={proposito}>
        {proposito}
      </option>
    ))}
  </select>
</label>

        </div>

        {/* Lista de productos */}
        <div className="foess-product-product-card-container">
          {productosFiltrados.map((producto) => (
            <div key={producto._id} className="foess-product-product-card">
              <div className="foess-product-product-card-image">
                <img 
                  src={getImageUrl(producto.imagen)} 
                  alt={producto.nombre} 
                  style={{ width: '100%', height: 'auto', objectFit: 'cover' }} 
                />
              </div>
              <div className="foess-product-product-card-content">
                <h3>{producto.nombre}</h3>
                <p>{producto.descripcion}</p>
                <p>Precio: ${producto.precio}</p>
                <p>Categoría: {producto.categoria}</p>
                <p>Tipo: {producto.name}</p>
                <p>Propósito: {producto.propositos}</p>
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
