
import React, { useState } from "react";

const Notificaciones = ({ mostrarNotificaciones, toggleNotificaciones }) => {
  const [notificaciones, setNotificaciones] = useState([
    {
      id: 1,
      producto: "Procesador Intel i7",
      stock: 10,
      mensaje: "El stock del producto está bajo.",
      tipo: "Advertencia",
      fecha: "Hace 2 horas",
    },
    {
      id: 2,
      producto: "Tarjeta gráfica RTX 3060",
      stock: 0,
      mensaje: "El producto está agotado.",
      tipo: "Urgente",
      fecha: "Hace 1 día",
    },
  ]);

  const marcarComoLeido = (id) => {
    setNotificaciones((prev) =>
      prev.map((notif) =>
        notif.id === id ? { ...notif, leido: true } : notif
      )
    );
  };

  const eliminarNotificacion = (id) => {
    setNotificaciones((prev) => prev.filter((notif) => notif.id !== id));
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
                  <p style={notifTimeStyle}>
                    Stock disponible: {notif.stock}
                  </p>
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
          ) : (
            <p>No hay notificaciones nuevas.</p>
          )}
        </div>
      )}
    </>
  );
};

export default Notificaciones;
