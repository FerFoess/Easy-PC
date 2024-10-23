import React from 'react';

const HistorialSolicitudes = ({ historialSolicitudes, volver }) => {
  return (
    <div className="historial-solicitudes">
      <h1>Historial de Productos Solicitados</h1>

      <table>
        <thead>
          <tr>
            <th>Producto</th>
            <th>Proveedor</th>
            <th>Cantidad</th>
            <th>Total Pagado</th>
            <th>Fecha</th>
          </tr>
        </thead>
        <tbody>
          {historialSolicitudes.map((solicitud, index) => (
            <tr key={index}>
              <td>{solicitud.producto}</td>
              <td>{solicitud.proveedor}</td>
              <td>{solicitud.cantidad}</td>
              <td>${solicitud.totalPagado.toFixed(2)}</td>
              <td>{solicitud.fecha}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <button onClick={volver}>Volver</button>
    </div>
  );
};

export default HistorialSolicitudes;
