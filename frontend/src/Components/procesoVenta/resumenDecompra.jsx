import React from 'react';
import { useLocation } from 'react-router-dom';
import './css/resumenCompra.css'; 
import { useCompra } from './CompraContext'; 
const ResumenCompra = () => {
  const location = useLocation();
  const { selecciones } = location.state || {};
  const { setTotalPrecio } = useCompra();

  const handleRedirect1 = () => {
    window.location.href = "http://localhost:3000/propocitoSeleccion"; 
  };


  const handleRedirect2 = () => {
    const totalPrecio = Object.values(selecciones).reduce((total, productos) => {
      return total + productos.reduce((subtotal, producto) => {
        const precio = typeof producto.precio === 'number' ? producto.precio : parseFloat(producto.precio) || 0;
        return subtotal + precio;
      }, 0);
    }, 0);
    
    setTotalPrecio(totalPrecio); // Guardar el total en el contexto
    window.location.href = "http://localhost:3000/datosEnvio"; 
  };


  if (!selecciones) {
    return <div>No hay selecciones disponibles.</div>;
  }

  // Calcular el precio total
  const totalPrecio = Object.values(selecciones).reduce((total, productos) => {
    return total + productos.reduce((subtotal, producto) => {
      // Asegúrate de que el precio sea un número
      const precio = typeof producto.precio === 'number' ? producto.precio : parseFloat(producto.precio) || 0;
      return subtotal + precio;
    }, 0);
  }, 0);

  return (
    <div className="resumen-compra">
      <div className="barra-proceso">
        <div className="paso activo">Seleccionar Productos</div>
        <div className="paso activo">Resumen de Compra</div>
        <div className="paso">Datos de Envío</div>
        <div className="paso">Realizar pago</div>
      </div>
      
      <h2 className="titulo-resumen">Resumen de Compra</h2>
      
      {Object.keys(selecciones).length > 0 ? (
        <div className="productos-resumen">
          {Object.entries(selecciones).map(([categoria, productos]) => (
            <div key={categoria} className="categoria-resumen">
              <h3>{categoria}</h3>
              <ul>
                {productos.map(producto => (
                  <li key={producto.id}>
                    <strong>{producto.nombre}</strong> - ${producto.precio.toFixed(2)}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ) : (
        <p>No hay productos seleccionados.</p>
      )}

      <div className="total-precio">
        <h3>Total a Pagar: ${totalPrecio.toFixed(2)}</h3>
      </div>

      <div className="botones">
        <button className="btn-cancelar" onClick={handleRedirect1}>
          Cancelar
        </button>
        <button className="btn-confirmar" onClick={handleRedirect2}>
          Confirmar Compra
        </button>
      </div>
    </div>
  );
};

export default ResumenCompra;
