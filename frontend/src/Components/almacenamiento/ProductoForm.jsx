import React, { useState, useEffect } from "react";
import "./estilos.css"; // Asegúrate de incluir los nuevos estilos en este archivo

const ProductForm = ({ selectedProduct, onProductSaved }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    categoria: "",
    precio: "",
    descripcion: "",
    imagen: null,
    detalles: {},
  });
  const [categorias, setCategorias] = useState([]);
  const [detallesCategoria, setDetallesCategoria] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // Estado para controlar el spinner

  useEffect(() => {
    if (selectedProduct) {
      setFormData({
        nombre: selectedProduct.nombre,
        categoria: selectedProduct.categoria,
        precio: selectedProduct.precio,
        descripcion: selectedProduct.descripcion,
        imagen: selectedProduct.imagen,
        detalles: selectedProduct.detalles || {},
      });
    }
  }, [selectedProduct]);

  useEffect(() => {
    fetch("http://localhost:3002/catego")
      .then((respuesta) => respuesta.json())
      .then((datos) => setCategorias(datos))
      .catch((error) => console.error("Error al obtener categorías:", error));
  }, []);

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

  const handleChange = async (e) => {
    const { name, value, files } = e.target;

    if (name === "imagen" && files && files[0]) {
      const file = files[0];
      const base64 = await convertToBase64(file);
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
    setIsLoading(true); // Muestra el spinner mientras se guarda el producto

    const producto = {
      nombre: formData.nombre,
      categoria: formData.categoria,
      precio: formData.precio,
      descripcion: formData.descripcion,
      detalles: formData.detalles,
      id: selectedProduct ? selectedProduct.id : Date.now(),
    };

    console.log("Producto enviado:", producto);

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
        alert(
          `Producto ${selectedProduct ? "actualizado" : "agregado"} con éxito.`
        );
        setFormData({
          nombre: "",
          categoria: "",
          precio: "",
          descripcion: "",
          imagen: null,
          detalles: {},
        });
        if (onProductSaved) onProductSaved(resultado);
      } else {
        throw new Error("Error al guardar el producto");
      }
    } catch (error) {
      console.error("Error al guardar el producto:", error);
      alert("Hubo un error al guardar el producto. Inténtalo de nuevo.");
    } finally {
      setIsLoading(false); // Oculta el spinner después de completar la solicitud
    }
  };

  return (
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
  );
};

export default ProductForm;
