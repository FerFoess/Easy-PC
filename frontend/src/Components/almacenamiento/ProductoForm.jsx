import React, { useState, useEffect } from "react";
import "./estilos.css";

const ProductForm = ({ selectedProduct, onProductSaved }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    categoria: "",
    precio: "",
    descripcion: "",
    imagen: null,
    detalles: {}, // Almacenará los detalles específicos de la categoría seleccionada
  });
  const [categorias, setCategorias] = useState([]);
  const [detallesCategoria, setDetallesCategoria] = useState([]);

  // Cargar datos del producto seleccionado (si se está editando)
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

  // Cargar las categorías desde el backend al montar el componente
  useEffect(() => {
    fetch("http://localhost:3002/catego")
      .then((respuesta) => respuesta.json())
      .then((datos) => setCategorias(datos))
      .catch((error) => console.error("Error al obtener categorías:", error));
  }, []);

  // Maneja el cambio de la categoría seleccionada
  const handleCategoriaChange = (e) => {
    const categoriaSeleccionada = e.target.value;
    setFormData({
      ...formData,
      categoria: categoriaSeleccionada,
      detalles: {},
    });

    // Encuentra la categoría seleccionada y carga sus detalles
    const categoria = categorias.find(
      (c) => c.categoria === categoriaSeleccionada
    );
    setDetallesCategoria(
      categoria?.detalles ? Object.entries(categoria.detalles) : []
    );
  };

  // Maneja cambios en los campos de formulario
  const handleChange = async (e) => {
    const { name, value, files } = e.target;

    if (name === "imagen" && files && files[0]) {
      const file = files[0];
      const base64 = await convertToBase64(file);
      setFormData((prevData) => ({
        ...prevData,
        [name]: base64, // Almacena la imagen como base64 en formData
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  // Función para convertir un archivo a base64
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  // Maneja cambios en los campos de detalles específicos
  // Maneja cambios en los campos de detalles específicos
  const handleDetalleChange = (e, detalleNombre) => {
    setFormData((prevData) => ({
      ...prevData,
      detalles: {
        ...prevData.detalles,
        [detalleNombre]: e.target.value, // Ahora los detalles se almacenan como un objeto
      },
    }));
  };

  // Enviar formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    const producto = {
      nombre: formData.nombre,
      categoria: formData.categoria, // Incluye la categoría
      precio: formData.precio, // Incluye el precio
      descripcion: formData.descripcion,
      detalles: formData.detalles, // Ya es un objeto plano
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
        if (onProductSaved) onProductSaved(resultado); // Actualiza la lista de productos
      } else {
        throw new Error("Error al guardar el producto");
      }
    } catch (error) {
      console.error("Error al guardar el producto:", error);
      alert("Hubo un error al guardar el producto. Inténtalo de nuevo.");
    }
  };

  return (
    <div className="">
      <form onSubmit={handleSubmit}>
        <h2>{selectedProduct ? "Editar Producto" : "Agregar Producto"}</h2>

        {/* Campo de selección de categoría */}
        <select
          name="categoria"
          value={formData.categoria}
          onChange={handleCategoriaChange}
          required
        >
          <option value="">Selecciona una categoría</option>
          {categorias.map((categoria) => (
            <option key={categoria._id} value={categoria.categoria}>
              {categoria.categoria}
            </option>
          ))}
        </select>
        <br />

        {/* Campo de nombre */}
        <input
          type="text"
          name="nombre"
          placeholder="Nombre del producto"
          value={formData.nombre}
          onChange={handleChange}
          required
        />

        {/* Campo de precio */}
        <input
          type="number"
          name="precio"
          placeholder="Precio"
          value={formData.precio}
          onChange={handleChange}
          required
        />
        <br />

        {/* Campo de descripción */}
        <textarea
          name="descripcion"
          placeholder="Descripción"
          value={formData.descripcion}
          onChange={handleChange}
        ></textarea>
        <br />

        {/* Campo de imagen */}
        <input type="file" name="imagen" onChange={handleChange} />
        <br />

        {/* Campos de detalles específicos según la categoría */}
        {detallesCategoria.length > 0 && (
          <div className="detalles-categoria">
            <h3>Detalles específicos de {formData.categoria}</h3>
            {detallesCategoria.map(([detalleNombre, tipo]) => (
              <div key={detalleNombre}>
                <label>{detalleNombre}:</label>
                <input
                  type={tipo === "number" ? "number" : "text"}
                  name={`detalle-${detalleNombre}`}
                  placeholder={detalleNombre}
                  value={formData.detalles[detalleNombre] || ""}
                  onChange={(e) => handleDetalleChange(e, detalleNombre)}
                />
              </div>
            ))}
          </div>
        )}

        {/* Botón de submit */}
        <button type="submit">
          {selectedProduct ? "Actualizar Producto" : "Agregar Producto"}
        </button>
      </form>
    </div>
  );
};

export default ProductForm;
