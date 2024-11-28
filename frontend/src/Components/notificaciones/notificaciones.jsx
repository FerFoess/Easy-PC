import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Notificaciones = ({ mostrarNotificaciones, toggleNotificaciones, onNuevaNotificacion }) => {
  const [notificaciones, setNotificaciones] = useState([]);
  const STOCK_BAJO = 10;
  const navigate = useNavigate();
  const [productosProcesados, setProductosProcesados] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3002/catego")
      .then((respuesta) => respuesta.json())
      .then((productos) => {
        generarNotificaciones(productos);
      })
      .catch((error) => console.error("Error al obtener productos:", error));
  }, []);

  const generarNotificaciones = (productos) => {
    const nuevasNotificaciones = productos
      .filter(
        (producto) =>
          producto.stock <= STOCK_BAJO && !productosProcesados.includes(producto._id)
      )
      .map((producto) => ({
        _id: producto._id,
        producto: producto.nombre,
        stock: producto.stock,
        mensaje:
          producto.stock === 0
            ? "El producto está agotado."
            : "El stock del producto está bajo.",
        tipo: producto.stock === 0 ? "Urgente" : "Advertencia",
        fecha: new Date().toISOString(),
      }));

    if (nuevasNotificaciones.length > 0) {
      onNuevaNotificacion(nuevasNotificaciones.length); // Update the notification count in parent
    }

    nuevasNotificaciones.forEach((notificacion) => {
      fetch("http://localhost:3002/alertas/guardar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(notificacion),
      })
        .then((respuesta) => {
          if (!respuesta.ok) {
            throw new Error("Error al guardar la notificación en la base de datos");
          }
          return respuesta.json();
        })
        .then((nuevaAlerta) => {
          setNotificaciones((prevNotificaciones) => [
            ...prevNotificaciones,
            nuevaAlerta,
          ]);
          setProductosProcesados((prev) => [...prev, nuevaAlerta._id]);
        })
        .catch((error) => console.error("Error al guardar la notificación:", error));
    });
  };

  return (
    <>
      {mostrarNotificaciones && (
        <div style={{ position: "absolute", top: "60px", right: "10px", backgroundColor: "#1f1f2b", color: "#fff", borderRadius: "10px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)", padding: "1rem", width: "300px", zIndex: 1000 }}>
          <h3 style={{ margin: "0 0 1rem 0", fontSize: "1.2rem", borderBottom: "1px solid #444", paddingBottom: "0.5rem" }}>Notificaciones</h3>
          {notificaciones.length > 0 ? (
            <div style={{ maxHeight: "300px", overflowY: "auto", paddingRight: "10px" }}>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {notificaciones.map((notif) => (
                  <li key={notif._id} style={{ padding: "0.5rem 0", borderBottom: "1px solid #444", display: "flex", flexDirection: "column", borderLeft: `5px solid ${notif.tipo === "Urgente" ? "red" : notif.tipo === "Advertencia" ? "orange" : "green"}` }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem", marginBottom: "0.3rem" }}>
                      <strong>
                        {notif.producto} <span style={{ color: notif.tipo === "Urgente" ? "red" : notif.tipo === "Advertencia" ? "orange" : "green" }}> ({notif.tipo})</span>
                      </strong>
                      <span style={{ fontSize: "0.8rem", color: "#aaa" }}>{notif.fecha}</span>
                    </div>
                    <p style={{ fontSize: "0.9rem", margin: "0.5rem 0" }}>{notif.mensaje}</p>
                    <p style={{ fontSize: "0.8rem", color: "#aaa", margin: "0.2rem 0" }}>Stock disponible: {notif.stock}</p>
                    <div style={{ marginTop: "0.5rem", display: "flex", justifyContent: "space-between" }}>
                      <button style={{ backgroundColor: "#5c6bc0", color: "#fff", border: "none", borderRadius: "5px", padding: "0.3rem 0.6rem", cursor: "pointer", fontSize: "0.8rem" }} onClick={() => navigate("/surtir")}>Surtir</button>
                      <button style={{ backgroundColor: "red", color: "white" }} onClick={() => setNotificaciones(notificaciones.filter((item) => item._id !== notif._id))}>
                        X
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p>No hay notificaciones.</p>
          )}
        </div>
      )}
    </>
  );
};

export default Notificaciones;
