// Importa solo los componentes que necesitas
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./estilos.css";
import Navbar from "../navBarAdmins/navbar"; // Navbar
import Notificaciones from "../notificaciones/notificaciones"; // Aquí solo lo importas, pero no lo usas

const ProductList = () => {
  const [productos, setProductos] = useState([]);
  const [filtroCategoria, setFiltroCategoria] = useState("");
  const [filtroProposito, setFiltroProposito] = useState("");
  const [categorias, setCategorias] = useState([]);
  const [propositos, setPropositos] = useState([]);
  const [notificaciones, setNotificaciones] = useState([]);
  const [mostrarNotificaciones, setMostrarNotificaciones] = useState(false);
  const navigate = useNavigate();

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

        // Generar notificaciones por stock bajo o agotado
        generarNotificaciones(datos);
      })
      .catch((error) => console.error("Error al obtener productos:", error));
  }, []);

  // Generar notificaciones dinámicas
  const generarNotificaciones = (productos) => {
    const nuevasNotificaciones = productos
      .filter((producto) => producto.stock <= STOCK_BAJO)
      .map((producto) => ({
        id: producto._id,
        producto: producto.nombre,
        stock: producto.stock,
        mensaje:
          producto.stock === 0
            ? "El producto está agotado."
            : "El stock del producto está bajo.",
        tipo: producto.stock === 0 ? "Urgente" : "Advertencia",
        fecha: new Date().toISOString(), // Convierte la fecha a un formato ISO 8601
      }));
  
    setNotificaciones(nuevasNotificaciones);
    if (nuevasNotificaciones.length > 0) {
      setMostrarNotificaciones(true);
    }
  };

  // Función para obtener la URL de la imagen
  const getImageUrl = (imagePath) => {
    if (imagePath) {
      return `http://localhost:3002/${imagePath.replace(/\\/g, "/")}`;
    }
    return "/assets/default-image.png"; // Imagen predeterminada si no hay imagen
  };

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
                  onClick={() =>
                    navigate("/productform", { state: { product: producto } })
                  }
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
    </div>
  );
};

export default ProductList;
