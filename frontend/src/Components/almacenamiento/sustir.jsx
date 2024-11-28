import React, { useState, useEffect } from "react";
import axios from "axios";
import "./SurtirComponentes.css";
import Navbar from "../navBarAdmins/navbar";

const SurtirComponentes = () => {
  const [componentes, setComponentes] = useState([]);
  const [ordenes, setOrdenes] = useState([]);
  const [formulario, setFormulario] = useState({});
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");
  const [mostrarOrdenes, setMostrarOrdenes] = useState(false);
  const [filtroEstado, setFiltroEstado] = useState("");  // Estado del filtro
  const [fechaInicio, setFechaInicio] = useState("");     // Fecha de inicio
  const [fechaFin, setFechaFin] = useState("");           // Fecha de fin

  const categorias = [
    "Procesador", "Tarjeta Madre", "Tarjeta de Video", "Memoria RAM", 
    "Almacenamiento Principal", "Disipador", "Gabinete", 
    "Fuente de Poder", "Ventiladores", "Tarjetas y Módulos de Red", "Windows"
  ];

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

  // Función para obtener las órdenes
  const fetchOrdenes = async () => {
    try {
      const response = await axios.get("http://localhost:3002/ordenes");
      let filtradas = response.data;

      // Filtrar por estado
      if (filtroEstado) {
        filtradas = filtradas.filter((orden) => orden.estado === filtroEstado);
      }

      // Filtrar por fecha de inicio (manteniendo todos los datos visibles)
      if (fechaInicio) {
        filtradas = filtradas.filter((orden) => {
          const fechaOrden = new Date(orden.fechaCreacion);
          return fechaOrden >= new Date(fechaInicio);
        });
      }

      setOrdenes(filtradas);
    } catch (error) {
      console.error("Error al obtener las órdenes:", error);
    }
  };

  useEffect(() => {
    if (!mostrarOrdenes) fetchComponentes();
    else fetchOrdenes();
  }, [mostrarOrdenes, filtroEstado, fechaInicio, fechaFin]);

  // Manejar cambios en el formulario
  const handleChange = (e, id) => {
    const { name, value } = e.target;
    setFormulario((prev) => ({
      ...prev,
      [id]: { ...prev[id], [name]: value },
    }));
  };

  // Cambiar estado de una orden
  const toggleEstadoOrden = async (id, estadoActual) => {
    let nuevoEstado;
    if (estadoActual === "Pendiente") {
      nuevoEstado = "En Proceso";
    } else if (estadoActual === "En Proceso") {
      nuevoEstado = "Terminada";
    } else {
      return; // No hacer nada si el estado no es válido
    }

    try {
      await axios.put(`http://localhost:3002/ordenes/${id}`, {
        estado: nuevoEstado,
      });
      fetchOrdenes();
    } catch (error) {
      console.error("Error al cambiar el estado de la orden:", error);
    }
  };

  // Eliminar una orden
  const eliminarOrden = async (id) => {
    try {
      await axios.delete(`http://localhost:3002/ordenes/${id}`);
      fetchOrdenes();
    } catch (error) {
      console.error("Error al eliminar la orden:", error);
    }
  };

  // Función para manejar los filtros de estado
  const handleEstadoChange = (e) => {
    setFiltroEstado(e.target.value);
  };

  // Función para manejar los filtros de fecha
  const handleFechaChange = (e) => {
    const { name, value } = e.target;
    if (name === "fechaInicio") {
      setFechaInicio(value);
    } else {
      setFechaFin(value);
    }
  };

  return (
    <div className="surtir-componentes-container">
      <Navbar />
      <div className="botones-superiores">
        <button onClick={() => setMostrarOrdenes(false)}>Levantar Orden</button>
        <button onClick={() => setMostrarOrdenes(true)}>Órdenes</button>
      </div>

      {!mostrarOrdenes ? (
        <>
          <h1 className="titulo">Surtir Componentes</h1>
          <div className="filtros">
            <label htmlFor="categoria">Filtrar por Categoría:</label>
            <select
              id="categoria"
              value={categoriaSeleccionada}
              onChange={(e) => setCategoriaSeleccionada(e.target.value)}
            >
              <option value="">Todas</option>
              {categorias.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <div className="componentes-grid">
            {componentes
              .filter(
                (componente) =>
                  !categoriaSeleccionada || componente.categoria === categoriaSeleccionada
              )
              .map((componente) => (
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
                      <strong>Propósitos:</strong> 
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
                    <button onClick={() => handleConfirmarSolicitud(componente._id)}>
                      Confirmar Solicitud
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </>
      ) : (
        <>
          <h1 className="titulo">Órdenes de Componentes</h1>
          <div className="filtros">
            <label htmlFor="estado">Filtrar por Estado:</label>
            <select id="estado" value={filtroEstado} onChange={handleEstadoChange}>
              <option value="">Todos</option>
              <option value="Pendiente">Pendiente</option>
              <option value="En Proceso">En Proceso</option>
              <option value="Terminada">Terminada</option>
            </select>
            <label htmlFor="fechaInicio">Fecha Inicio:</label>
            <input
              type="date"
              name="fechaInicio"
              value={fechaInicio}
              onChange={handleFechaChange}
            />
          </div>
          <div className="ordenes-grid">
            {ordenes.map((orden) => (
              <div className="orden-card" key={orden._id}>
                <h2>{orden.nombre}</h2>
                <p><strong>Categoría:</strong> {orden.categoria}</p>
                <p><strong>Cantidad:</strong> {orden.cantidad}</p>
                <p><strong>Correo Proveedor:</strong> {orden.correoProveedor}</p>
                <p><strong>Estado:</strong> {orden.estado}</p>
                <p><strong>Fecha:</strong> {new Date(orden.fechaCreacion).toLocaleDateString()}</p>
                <button onClick={() => toggleEstadoOrden(orden._id, orden.estado)}>
                  {orden.estado === "Pendiente"
                    ? "En Proceso"
                    : orden.estado === "En Proceso"
                    ? "Terminar"
                    : "Estado No Cambiable"
                  }
                </button>
                <button onClick={() => eliminarOrden(orden._id)}>Eliminar</button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default SurtirComponentes;
