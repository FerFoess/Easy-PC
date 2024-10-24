import React from "react";
import { useNavigate } from "react-router-dom"; // Para volver a la pantalla principal

const HistorialProductos = ({ historial }) => {
  const navigate = useNavigate();

  return (
    <div className="historial-contenedor">
      <h1>Historial de Productos Confirmados</h1>
      {historial.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Proveedor</th>
              <th>Cantidad</th>
              <th>Precio</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {historial.map((producto, index) => (
              <tr key={index}>
                <td>{producto.nombre}</td>
                <td>{producto.proveedor}</td>
                <td>{producto.cantidad}</td>
                <td>${producto.precio}</td>
                <td>${producto.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No hay productos confirmados en el historial.</p>
      )}
      <button onClick={() => navigate("/")}>Volver a gestión de productos</button>
    </div>
  );
};

export default HistorialProductos;
