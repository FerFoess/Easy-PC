import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./estilos.css";
import Navbar from "../navBarAdmins/navbar"; // Navbar

const ProductList = () => {
  const [productos, setProductos] = useState([]);
  const [filtroCategoria, setFiltroCategoria] = useState("");
  const [filtroProposito, setFiltroProposito] = useState("");
  const [categorias, setCategorias] = useState([]);
  const [propositos, setPropositos] = useState([]);

  // Estados para manejar la edición del producto y visibilidad del modal
  const [productoAEditar, setProductoAEditar] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const STOCK_BAJO = 10; // Umbral para stock bajo

  // Obtener productos desde el servidor
  useEffect(() => {
    fetch("http://localhost:3002/catego")
      .then((respuesta) => respuesta.json())
      .then((datos) => {
        setProductos(datos);
        const categoriasUnicas = [...new Set(datos.map((producto) => producto.categoria))];
        const propositosUnicos = [...new Set(datos.map((producto) => producto.propositos))];

        setCategorias(categoriasUnicas);
        setPropositos(propositosUnicos);
      })
      .catch((error) => console.error("Error al obtener productos:", error));
  }, []);

  // Filtrar productos
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

  // Función para obtener la URL de la imagen
  const getImageUrl = (imagePath) => {
    if (imagePath) {
      return `http://localhost:3002/${imagePath.replace(/\\/g, "/")}`;
    }
    return "/assets/default-image.png"; // Imagen predeterminada si no hay imagen
  };

  // Función para abrir el modal de edición
  const abrirModal = (producto) => {
    setProductoAEditar(producto); // Configura el producto a editar
    setModalVisible(true); // Muestra el modal
    console.log("Producto a editar: ", producto); // Verifica que el producto esté correcto
  };

  // Función para cerrar el modal
  const cerrarModal = () => {
    setModalVisible(false); // Oculta el modal
    setProductoAEditar(null); // Resetea el producto a editar
  };

  // Función para manejar la actualización del producto
  const actualizarProducto = async (formData) => {
    // Aquí actualizamos el precio y stock con los valores del formulario
    const updatedProductData = {
      precio: productoAEditar.precio, // Precio actualizado desde el input
      stock: productoAEditar.stock,   // Stock actualizado desde el input
    };
  
    const response = await fetch(`http://localhost:3002/catego/${formData._id}`, {
      method: 'PATCH', // Cambiado a PATCH
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedProductData),
    });
  
    if (response.ok) {
      console.log('Producto actualizado');
      setModalVisible(false); // Cierra el modal tras la actualización
      // Actualiza el estado de los productos si es necesario
      const updatedProduct = await response.json();
      setProductos((prevProductos) =>
        prevProductos.map((producto) =>
          producto._id === updatedProduct._id ? updatedProduct : producto
        )
      );
    } else {
      console.error('Error al actualizar el producto');
    }
  };
  

  // Eliminar producto
  const handleDelete = (id) => {
    const productosActualizados = productos.filter((producto) => producto._id !== id);
    setProductos(productosActualizados);
  };

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
                  style={{ width: "100%", height: "auto", objectFit: "cover" }}
                />
              </div>
              <div className="foess-product-product-card-content">
                <h3>{producto.nombre}</h3>
                <p>{producto.descripcion}</p>
                <p>Precio: ${producto.precio}</p>
                <p>Categoría: {producto.categoria}</p>
                <p>Tipo: {producto.name}</p>
                <p>Propósito: {producto.propositos}</p>
                <p>Stock: {producto.stock}</p>
              </div>
              <div className="foess-product-product-card-actions">
                <button
                  className="foess-product-product-button"
                  onClick={() => abrirModal(producto)} // Abrir modal con el producto
                >
                  Editar
                </button>
                <button
                  className="foessmalo-product-product-button"
                  onClick={() => handleDelete(producto._id)}
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal de edición */}
      {modalVisible && productoAEditar && (
        <div className="modal" style={{ display: modalVisible ? 'block' : 'none' }}>
          <div className="modal-content">
            <h2>Editar Producto</h2>
            <form
  onSubmit={(e) => {
    e.preventDefault();
    actualizarProducto(productoAEditar);
  }}
>
  <label>Nombre:</label>
  <input
    type="text"
    value={productoAEditar.nombre}
    onChange={(e) =>
      setProductoAEditar({ ...productoAEditar, nombre: e.target.value })
    }
  />
  
  <label>Precio:</label>
  <input
    type="number"
    value={productoAEditar.precio}
    onChange={(e) =>
      setProductoAEditar({ ...productoAEditar, precio: parseFloat(e.target.value) })
    }
  />

  <label>Stock:</label>
  <input
    type="number"
    value={productoAEditar.stock}
    onChange={(e) =>
      setProductoAEditar({ ...productoAEditar, stock: parseInt(e.target.value) })
    }
  />

  <button type="submit">Actualizar</button>
  <button type="button" onClick={cerrarModal}>Cancelar</button>
</form>

          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;
