import React, { useState, useEffect } from "react";
import axios from "axios";
import "./SurtirComponentes.css"; // Estilos personalizados
import Navbar from "../navBarAdmins/navbar";

const SurtirComponentes = () => {
  const [componentes, setComponentes] = useState([]);
  const [formulario, setFormulario] = useState({});

  // Función para obtener los componentes
  const fetchComponentes = async () => {
    try {
      const response = await axios.get("http://localhost:3002/catego");
      const sinStock = response.data.filter(
        (comp) => comp.stock === 0 && comp.estado === "Agotado"
      );
      setComponentes(sinStock);
    } catch (error) {
      console.error("Error al obtener los componentes:", error);
    }
  };

  useEffect(() => {
    fetchComponentes();
  }, []);

  // Manejar cambios en el formulario
  const handleChange = (e, id) => {
    const { name, value } = e.target;
    setFormulario((prev) => ({
      ...prev,
      [id]: { ...prev[id], [name]: value },
    }));
  };

  // Verificar y mostrar confirmación
  const handleConfirmarSolicitud = async (id) => {
    const componente = componentes.find((comp) => comp._id === id);

    if (!componente) {
      alert("Componente no encontrado");
      return;
    }

    const data = {
      id: componente._id,
      nombre: componente.nombre,
      categoria: componente.categoria,
      cantidad: formulario[id]?.cantidad,
      correoProveedor: formulario[id]?.correoProveedor,
    };

    // Verificar stock en el backend antes de confirmar
    try {
      const response = await axios.post(
        "http://localhost:3002/auth/verificarStock",
        { id: componente._id }
      );
      if (response.data.necesitaConfirmacion === true) {
        const confirmacion = window.confirm(
          `El stock de ${componente.nombre} es cero. ¿Deseas solicitar el resurtido?`
        );
        if (confirmacion) {
          // Si el usuario confirma, enviar la solicitud
          handleSurtir(data);
        }
      } else {
        alert("El stock ya ha sido actualizado, no es necesario resurtir.");
      }
    } catch (error) {
      console.error("Error al verificar stock:", error);
      alert("Hubo un error al verificar el stock");
    }
  };

  // Enviar solicitud para surtir un componente
  const handleSurtir = async (data) => {
    try {
      // Verificar que los campos estén completos
      if (!data.cantidad || !data.correoProveedor) {
        alert("Por favor, ingrese la cantidad y el correo del proveedor.");
        return;
      }

      // Enviar solicitud para surtir
      await axios.post(
        "http://localhost:3002/auth/enviarSolicitudSurtir",
        data
      ); // Ajusta la ruta según tu backend
      alert(
        "Solicitud enviada exitosamente para el componente: " + data.nombre
      );

      // Limpiar formulario y refrescar componentes
      setFormulario({});
      fetchComponentes(); // Refrescar componentes después de enviar la solicitud
    } catch (error) {
      console.error("Error al surtir el componente:", error);
      alert("Hubo un error al enviar la solicitud");
    }
  };

  return (
    <div className="surtir-componentes-container">
      <Navbar />
      <h1 className="titulo">Surtir Componentes</h1>
      <div className="componentes-grid">
        {componentes.length > 0 ? (
          componentes.map((componente) => (
            <div className="componente-card" key={componente._id}>
              <img
                src={componente.imagen || "/placeholder.png"}
                alt={componente.nombre}
                className="componente-imagen"
              />
              <div className="componente-info">
                <h2>{componente.nombre}</h2>
                <p>{componente.descripcion}</p>
                <p>
                  <strong>Categoría:</strong> {componente.categoria}
                </p>

                <p>
                  <strong>Propósitos:</strong>{" "}
                  {componente.propositos.join(", ")}
                </p>
                <div>
                  <strong>Especificaciones:</strong>
                  <ul>
                    {Object.entries(componente.especificaciones).map(
                      ([key, value]) => (
                        <li key={key}>
                          <strong>{key}:</strong>{" "}
                          {Array.isArray(value) ? value.join(", ") : value}
                        </li>
                      )
                    )}
                  </ul>
                </div>
              </div>
              <div className="componente-acciones">
                <label>
                  Cantidad a solicitar:
                  <input
                    type="number"
                    name="cantidad"
                    min="1"
                    onChange={(e) => handleChange(e, componente._id)}
                  />
                </label>
                <label>
                  Correo del proveedor:
                  <input
                    type="email"
                    name="correoProveedor"
                    placeholder="correo@ejemplo.com"
                    onChange={(e) => handleChange(e, componente._id)}
                  />
                </label>
                <button
                  className="btn-surtir"
                  onClick={() => handleConfirmarSolicitud(componente._id)} // Verificar stock y pedir confirmación
                >
                  Confirmar Solicitud
                </button>
              </div>
            </div>
          ))
        ) : (
          <p style={{ color: "red" }}>No hay componentes con stock agotado.</p>
        )}
      </div>
    </div>
  );
};

export default SurtirComponentes;
