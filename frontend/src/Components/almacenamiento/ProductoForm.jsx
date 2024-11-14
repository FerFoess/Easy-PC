import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./estilos.css";

const API_URL = process.env.REACT_APP_BACKEND_URL;

const ProductForm = ({ selectedProduct, onProductSaved }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;
  const selectedProductFromState = state?.product;

  // Estilos en línea
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

  const [formData, setFormData] = useState({
    nombre: "",
    categoria: "",
    precio: "",
    descripcion: "",
    proposito: "", // Nuevo campo proposito
    imagen: null,
    especificaciones: {}, // Cambiado de 'detalles' a 'especificaciones'
    tipo: "",
    stock: "", // Nuevo campo stock
  });
  
  const [categorias, setCategorias] = useState([]);
  const [detallesCategoria, setDetallesCategoria] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/catego`)
      .then((respuesta) => respuesta.json())
      .then((datos) => setCategorias(datos))
      .catch((error) => console.error("Error al obtener categorías:", error));
  }, []);

  useEffect(() => {
    if (selectedProductFromState) {
      setFormData({
        nombre: selectedProductFromState.nombre,
        categoria: selectedProductFromState.categoria,
        precio: selectedProductFromState.precio,
        descripcion: selectedProductFromState.descripcion,
        proposito: selectedProductFromState.proposito || "",
        imagen: selectedProductFromState.imagen,
        especificaciones: selectedProductFromState.especificaciones || {}, // Cambio aquí
        tipo: selectedProductFromState.tipo || "",
        stock: selectedProductFromState.stock || "",
      });

      const categoria = categorias.find(
        (c) => c.categoria === selectedProductFromState.categoria
      );
      setDetallesCategoria(
        categoria?.especificaciones ? Object.entries(categoria.especificaciones) : [] // Cambiado de detalles a especificaciones
      );
    }
  }, [selectedProductFromState, categorias]);

  const handleCategoriaChange = (e) => {
    const categoriaSeleccionada = e.target.value;
    setFormData({
      ...formData,
      categoria: categoriaSeleccionada,
      especificaciones: {},
    });

    const categoria = categorias.find(
      (c) => c.categoria === categoriaSeleccionada
    );
    setDetallesCategoria(
      categoria?.especificaciones ? Object.entries(categoria.especificaciones) : []
    );
  };

  const handleTipoChange = (e) => {
    setFormData({
      ...formData,
      tipo: e.target.value,
    });
  };

  const handleChange = async (e) => {
    const { name, value, files } = e.target;
  
    if (name === "imagen" && files && files[0]) {
      const file = files[0];
      const base64 = await convertToBase64(file); // Convertir a base64 solo para mostrar
      setFormData((prevData) => ({
        ...prevData,
        [name]: base64,
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  // Convertir un archivo a base64
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleDetalleChange = (e, detalleNombre) => {
    setFormData((prevData) => ({
      ...prevData,
      especificaciones: {
        ...prevData.especificaciones,
        [detalleNombre]: e.target.value,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
  
    const requestData = new FormData();
    requestData.append('nombre', formData.nombre);
    requestData.append('categoria', formData.categoria);
    requestData.append('precio', formData.precio);
    requestData.append('descripcion', formData.descripcion);
    requestData.append('proposito', formData.proposito);
    requestData.append('tipo', formData.tipo);
    requestData.append('stock', formData.stock);
    requestData.append('especificaciones', JSON.stringify(formData.especificaciones));
  
    // Si hay una imagen nueva, agregarla a la solicitud
    if (formData.imagen && formData.imagen instanceof File) {
      requestData.append('imagen', formData.imagen); // Enviar la imagen como archivo
    }
  
    try {
      const url = selectedProductFromState
        ? `${API_URL}/catego/${selectedProductFromState._id}` // PATCH para actualizar
        : `${API_URL}/catego`; // POST para crear un nuevo producto
  
      const response = await fetch(url, {
        method: selectedProductFromState ? "PATCH" : "POST", // PATCH para actualizar
        body: requestData,
      });
  
      if (response.ok) {
        const resultado = await response.json();
        alert(`Producto ${selectedProductFromState ? "actualizado" : "agregado"} con éxito.`);
        setFormData({
          nombre: "",
          categoria: "",
          precio: "",
          descripcion: "",
          proposito: "",
          imagen: null,
          especificaciones: {},
          tipo: "",
          stock: "",
        });
        if (onProductSaved) onProductSaved(resultado);
      } else {
        throw new Error("Error al guardar el producto");
      }
    } catch (error) {
      console.error("Error al guardar el producto:", error);
      alert("Hubo un error al guardar el producto. Inténtalo de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };
  
  
  
  

  return (
    <div style={containerStyle}>
      {/* Navbar */}
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
            onClick={() => navigate('/almacen')}
          >
            Almacen
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

      {/* Product Form */}
      <div className="foess-product-form-container">
        <form onSubmit={handleSubmit} className="product-form">
          <h2 style={{ color: "black", fontSize: "24px" }}>
            {selectedProductFromState ? "Editar Producto" : "Agregar Producto"}
          </h2>
          <select
            name="categoria"
            value={formData.categoria}
            onChange={handleCategoriaChange}
            required
            className="input-select"
          >
            <option value="">Selecciona una categoría</option>
            {categorias.map((categoria) => (
              <option key={categoria._id} value={categoria.categoria}>
                {categoria.categoria}
              </option>
            ))}
          </select>
          <br />

          <select
            name="tipo"
            value={formData.tipo}
            onChange={handleTipoChange}
            required
            className="input-select"
          >
            <option value="">Selecciona un tipo</option>
            <option value="VideoJuegos">VideoJuegos</option>
            <option value="Trabajo">Trabajo</option>
            <option value="Ocio">Ocio</option>
            <option value="Estudio">Estudio</option>
          </select>
          <br />

          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            placeholder="Nombre del producto"
            required
            className="input-text"
          />
          <br />

          <input
            type="number"
            name="precio"
            value={formData.precio}
            onChange={handleChange}
            placeholder="Precio del producto"
            required
            className="input-text"
          />
          <br />

          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            placeholder="Stock disponible"
            required
            className="input-text"
          />
          <br />

          <textarea
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            placeholder="Descripción del producto"
            required
            className="input-textarea"
          />
          <br />

          {detallesCategoria.map(([detalleNombre, detalleOpciones]) => (
            <div key={detalleNombre}>
              <label htmlFor={detalleNombre}>{detalleNombre}</label>
              <input
                id={detalleNombre}
                type="text"
                value={formData.especificaciones[detalleNombre] || ""} // Cambiado a especificaciones
                onChange={(e) => handleDetalleChange(e, detalleNombre)}
              />
            </div>
          ))}

          <br />

          <input
            type="text"
            name="proposito"
            value={formData.proposito}
            onChange={handleChange}
            placeholder="Propósito del producto"
            className="input-text"
          />
          <br />

          <input
            type="file"
            name="imagen"
            accept="image/*"
            onChange={handleChange}
          />
          <br />

          <button type="submit" className="submit-button">
            {selectedProductFromState ? "Actualizar Producto" : "Agregar Producto"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
