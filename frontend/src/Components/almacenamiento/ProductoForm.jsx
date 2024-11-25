import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./estilos.css";
import Navbar from '../navBarAdmins/navbar';

const API_URL = process.env.REACT_APP_BACKEND_URL;


const ProductForm = ({ selectedProduct, onProductSaved }) => {
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
    name: "",
    stock: "",
  });

  const [categorias, setCategorias] = useState([]);
  const [detallesCategoria, setDetallesCategoria] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Obtener las categorías al cargar el componente
  useEffect(() => {
    fetch(`${API_URL}/catego`) // Aquí apuntamos a la ruta de categorías
      .then((respuesta) => respuesta.json())
      .then((datos) => {
        if (Array.isArray(datos)) {
          setCategorias(datos);
        } else {
          console.error("Los datos recibidos no son un array");
          setCategorias([]);
        }
      })
      .catch((error) => {
        console.error("Error al obtener categorías:", error);
        setCategorias([]);
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
        name: selectedProductFromState.name || "",
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
      name: e.target.value,
    });
  };

  const handleChange = async (e) => {
    const { name, value, files } = e.target;

    if (name === "imagen" && files && files[0]) {
      setFormData((prevData) => ({
        ...prevData,
        [name]: files[0], // Guardar el archivo directamente
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
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
    const formDataToSend = new FormData();
    formDataToSend.append('nombre', formData.nombre);
    formDataToSend.append('descripcion', formData.descripcion);
    formDataToSend.append('categoria', formData.categoria);
    formDataToSend.append('precio', formData.precio);
    formDataToSend.append('especificaciones', JSON.stringify(formData.especificaciones));
    formDataToSend.append('propositos', formData.proposito);
    formDataToSend.append('stock', formData.stock);
    formDataToSend.append('name', formData.name);

    // Si hay una imagen, agregarla también
    if (formData.imagen) {
      formDataToSend.append('imagen', formData.imagen);
    }

    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:3002/catego', {
        method: 'POST',
        body: formDataToSend,
      });

      const result = await response.json();
      if (response.ok) {
        console.log("Categoría guardada correctamente", result);
        onProductSaved && onProductSaved(result);

        // Limpiar el formulario después de guardar el producto
        resetForm();
      } else {
        console.error("Error al guardar la categoría", result);
      }
    } catch (error) {
      console.error("Error al hacer la solicitud:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Función para resetear los campos del formulario
  const resetForm = () => {
    setFormData({
      nombre: "",
      categoria: "",
      precio: "",
      descripcion: "",
      proposito: "",
      imagen: null,
      especificaciones: {},
      name: "",
      stock: "",
    });
  };

  return (
    <div style={{ paddingTop: "120px" }}>
      <Navbar />
      {/* Product Form */}
      <div className="foess-product-form-container">
        <form onSubmit={handleSubmit} className="product-form">
          <h2 style={{ color: "black", fontSize: "24px" }}>
            {selectedProductFromState ? "Editar Producto" : "Agregar Producto"}
          </h2>

          {/* Categorías */}
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

          {/* Tipo */}
          <select
            name="tipo"
            value={formData.name}
            onChange={handleTipoChange}
            required
            className="input-select"
          >
            <option value="">Selecciona un tipo</option>
            <option value="VideoJuegos">VideoJuegos</option>
            <option value="Consolas">Consolas</option>
            <option value="Accesorios">Accesorios</option>
            <option value="Accesorios">Ocio</option>
            <option value="Accesorios">Escuela</option>
          </select>

          {/* Nombre */}
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            placeholder="Nombre"
            className="input-field"
            required
          />

          {/* Descripción */}
          <textarea
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            placeholder="Descripción"
            className="input-field"
            required
          />

          {/* Precio */}
          <input
            type="number"
            name="precio"
            value={formData.precio}
            onChange={handleChange}
            placeholder="Precio"
            className="input-field"
            required
          />

          {/* Stock */}
          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            placeholder="Stock"
            className="input-field"
            required
          />

          {/* Imagen */}
          <input
            type="file"
            name="imagen"
            accept="image/*"
            onChange={handleChange}
            className="input-file"
          />

          {/* Especificaciones */}
          {detallesCategoria.map(([nombre, tipo], index) => (
            <div key={index}>
              <label>{nombre}</label>
              <input
                type="text"
                name={nombre}
                value={formData.especificaciones[nombre] || ""}
                onChange={(e) => handleDetalleChange(e, nombre)}
                className="input-field"
              />
            </div>
          ))}


          {/* Propósito */}
          <textarea
            name="proposito"
            value={formData.proposito}
            onChange={handleChange}
            placeholder="Propósito"
            className="input-field"
          />

          <button type="submit" className="submit-button">
            {isLoading ? "Guardando..." : "Guardar"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
