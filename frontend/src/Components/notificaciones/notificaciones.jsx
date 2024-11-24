import React, { useState, useEffect } from "react";

const Notificaciones = ({ mostrarNotificaciones, toggleNotificaciones }) => {
  const [notificaciones, setNotificaciones] = useState([]);
  const STOCK_BAJO = 10;

  // Simulación de obtener productos desde el servidor (puedes reemplazar con fetch o axios)
  useEffect(() => {
    fetch("http://localhost:3002/catego")
      .then((respuesta) => respuesta.json())
      .then((productos) => {
        // Generar notificaciones basadas en el stock bajo
        generarNotificaciones(productos);
      })
      .catch((error) => console.error("Error al obtener productos:", error));
  }, []);

  // Generar notificaciones de productos con stock bajo
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
        fecha: new Date().toISOString(),
      }));

    setNotificaciones(nuevasNotificaciones);
  };

  // Función para marcar como leído
  const marcarComoLeido = (id) => {
    setNotificaciones(notificaciones.filter((notif) => notif.id !== id));
    console.log("Marcando como leído:", id);
  };

  // Función para eliminar notificación
  const eliminarNotificacion = (id) => {
    setNotificaciones(notificaciones.filter((notif) => notif.id !== id));
    console.log("Eliminando notificación:", id);
  };

  const notificationPopupStyle = {
    position: "absolute",
    top: "60px",
    right: "10px",
    backgroundColor: "#1f1f2b",
    color: "#fff",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
    padding: "1rem",
    width: "300px",
    zIndex: 1000,
  };

  const notificationTitleStyle = {
    margin: "0 0 1rem 0",
    fontSize: "1.2rem",
    borderBottom: "1px solid #444",
    paddingBottom: "0.5rem",
  };

  const notificationListContainerStyle = {
    maxHeight: "300px", // Limitar la altura para el área de desplazamiento
    overflowY: "auto", // Habilitar el desplazamiento vertical
    paddingRight: "10px", // Agregar algo de espacio para la barra de desplazamiento
  };

  const notificationListStyle = {
    listStyle: "none",
    padding: 0,
    margin: 0,
  };

  const notificationItemStyle = {
    padding: "0.5rem 0",
    borderBottom: "1px solid #444",
    display: "flex",
    flexDirection: "column",
    borderLeft: "5px solid",
  };

  const notifHeaderStyle = {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "0.9rem",
    marginBottom: "0.3rem",
  };

  const notifMessageStyle = {
    fontSize: "0.9rem",
    margin: "0.5rem 0",
  };

  const notifTimeStyle = {
    fontSize: "0.8rem",
    color: "#aaa",
    margin: "0.2rem 0",
  };

  const notifButtonStyle = {
    marginTop: "0.5rem",
    display: "flex",
    justifyContent: "space-between",
  };

  const smallButtonStyle = {
    backgroundColor: "#5c6bc0",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    padding: "0.3rem 0.6rem",
    cursor: "pointer",
    fontSize: "0.8rem",
  };

  return (
    <>
      {mostrarNotificaciones && (
        <div style={notificationPopupStyle}>
          <h3 style={notificationTitleStyle}>Notificaciones</h3>
          {notificaciones.length > 0 ? (
            <div style={notificationListContainerStyle}>
              <ul style={notificationListStyle}>
                {notificaciones.map((notif) => (
                  <li
                    key={notif.id}
                    style={{
                      ...notificationItemStyle,
                      borderLeft: `5px solid ${
                        notif.tipo === "Urgente"
                          ? "red"
                          : notif.tipo === "Advertencia"
                          ? "orange"
                          : "green"
                      }`,
                    }}
                  >
                    <div style={notifHeaderStyle}>
                      <strong>
                        {notif.producto}
                        <span
                          style={{
                            color:
                              notif.tipo === "Urgente"
                                ? "red"
                                : notif.tipo === "Advertencia"
                                ? "orange"
                                : "green",
                          }}
                        >
                          {" "}
                          ({notif.tipo})
                        </span>
                      </strong>
                      <span style={notifTimeStyle}>{notif.fecha}</span>
                    </div>
                    <p style={notifMessageStyle}>{notif.mensaje}</p>
                    <p style={notifTimeStyle}>Stock disponible: {notif.stock}</p>
                    <div style={notifButtonStyle}>
                      <button
                        style={smallButtonStyle}
                        onClick={() => marcarComoLeido(notif.id)}
                      >
                        Marcar como leído
                      </button>
                      <button
                        style={{ ...smallButtonStyle, backgroundColor: "red" }}
                        onClick={() => eliminarNotificacion(notif.id)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p>No hay notificaciones nuevas.</p>
          )}
        </div>
      )}
    </>
  );
};

export default Notificaciones;
