import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./estilos.css";
import { useLocation } from "react-router-dom";



const API_URL = process.env.REACT_APP_BACKEND_URL

const location = useLocation();
const { state } = location;
const selectedProduct = state?.product;

const ProductForm = ({ selectedProduct, onProductSaved }) => {
  const navigate = useNavigate();

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
    detalles: {},
    tipo: "",
    stock: "", // Nuevo campo stock
  });
  const [categorias, setCategorias] = useState([]);
  const [detallesCategoria, setDetallesCategoria] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // Estado para controlar el spinner

  useEffect(() => {
    fetch(`${API_URL}/catego`)
      .then((respuesta) => respuesta.json())
      .then((datos) => setCategorias(datos))
      .catch((error) => console.error("Error al obtener categorías:", error));
  }, []);

  useEffect(() => {
    if (selectedProduct) {
      setFormData({
        nombre: selectedProduct.nombre,
        categoria: selectedProduct.categoria,
        precio: selectedProduct.precio,
        descripcion: selectedProduct.descripcion,
        proposito: selectedProduct.proposito || "",
        imagen: selectedProduct.imagen,
        detalles: selectedProduct.detalles || {},
        tipo: selectedProduct.tipo || "",
        stock: selectedProduct.stock || "",
      });

      const categoria = categorias.find(
        (c) => c.categoria === selectedProduct.categoria
      );
      setDetallesCategoria(categoria?.detalles ? Object.entries(categoria.detalles) : []);
    }
  }, [selectedProduct, categorias]);

  const handleCategoriaChange = (e) => {
    const categoriaSeleccionada = e.target.value;
    setFormData({
      ...formData,
      categoria: categoriaSeleccionada,
      detalles: {},
    });

    const categoria = categorias.find(
      (c) => c.categoria === categoriaSeleccionada
    );
    setDetallesCategoria(
      categoria?.detalles ? Object.entries(categoria.detalles) : []
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
      detalles: {
        ...prevData.detalles,
        [detalleNombre]: e.target.value,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
  
    // Excluir la propiedad 'imagen' del objeto 'producto' que se envía al backend
    const { imagen, ...producto } = {
      nombre: formData.nombre,
      categoria: formData.categoria,
      precio: formData.precio,
      descripcion: formData.descripcion,
      proposito: formData.proposito,
      detalles: formData.detalles,
      tipo: formData.tipo,
      stock: formData.stock,
      id: selectedProduct ? selectedProduct.id : Date.now(),
    };
  
    console.log("Producto enviado (sin imagen):", producto);
  
    try {
      const response = await fetch("http://localhost:3002/catego", {
        method: selectedProduct ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(producto),
      });
  
      if (response.ok) {
        const resultado = await response.json();
        alert(`Producto ${selectedProduct ? "actualizado" : "agregado"} con éxito.`);
  
        // Reiniciar el formulario sin agregar categorías nuevas
        setFormData({
          nombre: "",
          categoria: "",
          precio: "",
          descripcion: "",
          proposito: "",
          imagen: null, // Restablecer la imagen también
          detalles: {},
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
            {selectedProduct ? "Editar Producto" : "Agregar Producto"}
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
            placeholder="Nombre del producto"
            value={formData.nombre}
            onChange={handleChange}
            required
            className="input-field"
          />

          <input
            type="number"
            name="precio"
            placeholder="Precio"
            value={formData.precio}
            onChange={handleChange}
            required
            className="input-field"
          />
          <br />

          <textarea
            name="descripcion"
            placeholder="Descripción"
            value={formData.descripcion}
            onChange={handleChange}
            className="input-field"
          ></textarea>
          <br />

          <textarea
            name="proposito"
            placeholder="Propósito (¿Para qué funciona?)"
            value={formData.proposito}
            onChange={handleChange}
            className="input-field"
          ></textarea>
          <br />

          {/* Nuevo campo de Stock */}
          <input
            type="number"
            name="stock"
            placeholder="Cantidad de Stock"
            value={formData.stock}
            onChange={handleChange}
            required
            className="input-field"
          />
          <br />

          <input
            type="file"
            name="imagen"
            onChange={handleChange}
            className="input-file"
          />
          <br />

          {detallesCategoria.length > 0 && (
            <div className="foess-categoria-details-container">
              <h3>Detalles específicos de {formData.categoria}</h3>
              {detallesCategoria.map(([detalleNombre, tipo]) => (
                <div key={detalleNombre} className="detail-input-container">
                  <label>{detalleNombre}:</label>
                  <input
                    type={tipo === "number" ? "number" : "text"}
                    name={`detalle-${detalleNombre}`}
                    placeholder={detalleNombre}
                    value={formData.detalles[detalleNombre] || ""}
                    onChange={(e) => handleDetalleChange(e, detalleNombre)}
                    className="input-field"
                  />
                </div>
              ))}
            </div>
          )}

          <button type="submit" className="submit-button">
            {isLoading ? "Guardando..." : selectedProduct ? "Actualizar Producto" : "Agregar Producto"}
          </button>
          {isLoading && (
            <div className="spinner">
              <div className="spinner-circle"></div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
