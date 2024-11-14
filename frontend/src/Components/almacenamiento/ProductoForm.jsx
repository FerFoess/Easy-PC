import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./estilos.css";

const API_URL = process.env.REACT_APP_BACKEND_URL;

const ProductForm = ({ selectedProduct, onProductSaved }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;
  const selectedProductFromState = state?.product;

  const [formData, setFormData] = useState({
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

  const [categorias, setCategorias] = useState([]);
  const [detallesCategoria, setDetallesCategoria] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Obtener las categorías al cargar el componente
  useEffect(() => {
    fetch(`http://localhost:3002/catego`) // Corregido a /categorias
      .then((respuesta) => respuesta.json())
      .then((datos) => {
        // Asegúrate de que 'datos' sea un array antes de actualizar el estado
        if (Array.isArray(datos)) {
          setCategorias(datos);
        } else {
          console.error("Los datos recibidos no son un array");
          setCategorias([]);  // Establecer un array vacío si los datos no son válidos
        }
      })
      .catch((error) => {
        console.error("Error al obtener categorías:", error);
        setCategorias([]);  // Establecer un array vacío en caso de error
      });
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
        especificaciones: selectedProductFromState.especificaciones || {},
        tipo: selectedProductFromState.tipo || "",
        stock: selectedProductFromState.stock || "",
      });

      const categoria = categorias.find(
        (c) => c.categoria === selectedProductFromState.categoria
      );
      setDetallesCategoria(
        categoria?.especificaciones ? Object.entries(categoria.especificaciones) : []
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
  
    // Validación de los campos obligatorios
    if (!formData.nombre || !formData.categoria || !formData.precio || !formData.tipo || !formData.proposito || !formData.stock || Object.keys(formData.especificaciones).length === 0) {
      alert("Por favor, completa todos los campos obligatorios.");
      setIsLoading(false);
      return;
    }
  
    const requestData = new FormData();
    requestData.append('nombre', formData.nombre);
    requestData.append('categoria', formData.categoria);
    requestData.append('precio', formData.precio);
    requestData.append('descripcion', formData.descripcion);
    requestData.append('proposito', formData.proposito);
    requestData.append('tipo', formData.tipo);
    requestData.append('stock', formData.stock);
    
    // Verifica si 'especificaciones' está vacío y lo maneja
    requestData.append('especificaciones', Object.keys(formData.especificaciones).length > 0 ? JSON.stringify(formData.especificaciones) : '{}');
    
    if (formData.imagen && formData.imagen instanceof File) {
      requestData.append('imagen', formData.imagen);
    }
    
  
    console.log([...requestData]);  // Verifica que el contenido sea el esperado.
  
    const url = selectedProductFromState
      ? `${API_URL}/catego/${selectedProductFromState._id}` // PATCH para actualizar
      : `${API_URL}/catego/`; // POST para crear un nuevo producto
  
    try {
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
        const errorData = await response.json();
        console.error("Error en la respuesta:", errorData);  // Mostrar el error
        throw new Error(errorData.error || "Error al guardar el producto");
      }
    } catch (error) {
      console.error("Error al guardar el producto:", error);  // Mostrar error completo
      alert("Hubo un error al guardar el producto. Inténtalo de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };
  
  
  

  return (
    <div style={{ paddingTop: '120px' }}>
      {/* Navbar */}
      <nav style={{
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
        zIndex: 1000
      }}>
        <div className="logo">
          <img src="/assets/logo.png" alt="Logo" style={{ width: '90px', height: '90px', borderRadius: '50%' }} />
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            style={{
              color: '#ffffff',
              backgroundColor: 'transparent',
              border: '2px solid #5c6bc0',
              padding: '0.6rem 1.2rem',
              borderRadius: '20px',
              fontSize: '1rem',
              cursor: 'pointer',
              transition: 'background-color 0.3s ease, transform 0.2s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#5c6bc0')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            onClick={() => navigate('/estadisticas')}
          >
            Estadisticas
          </button>
          <button
            style={{
              color: '#ffffff',
              backgroundColor: 'transparent',
              border: '2px solid #5c6bc0',
              padding: '0.6rem 1.2rem',
              borderRadius: '20px',
              fontSize: '1rem',
              cursor: 'pointer',
              transition: 'background-color 0.3s ease, transform 0.2s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#5c6bc0')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            onClick={() => navigate('/almacen')}
          >
            Almacen
          </button>
          <button
            style={{
              color: '#ffffff',
              backgroundColor: 'transparent',
              border: '2px solid #5c6bc0',
              padding: '0.6rem 1.2rem',
              borderRadius: '20px',
              fontSize: '1rem',
              cursor: 'pointer',
              transition: 'background-color 0.3s ease, transform 0.2s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#5c6bc0')}
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

          {detallesCategoria.map(([detalleNombre]) => (
            <div key={detalleNombre}>
              <label htmlFor={detalleNombre}>{detalleNombre}</label>
              <input
                id={detalleNombre}
                type="text"
                value={formData.especificaciones[detalleNombre] || ""}
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
