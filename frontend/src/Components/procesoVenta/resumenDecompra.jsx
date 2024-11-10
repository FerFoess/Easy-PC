import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './css/resumenCompra.css';

const ResumenCompra = () => {
  const location = useLocation();
  const { selecciones } = location.state || {};
  const navigate = useNavigate();
  const [total, setTotal] = useState(0);
  const [stockDisponible, setStockDisponible] = useState({});
  const [seleccionesState, setSeleccionesState] = useState(selecciones); // Estado para las selecciones

<<<<<<< HEAD
  const handleRedirect1 = () => {
    window.history.back();
  };

  const handleRedirect2 = () => {
    // Calcular el total de la compra
    const totalPrecio = Object.values(selecciones).reduce((total, productos) => {
      return total + productos.reduce((subtotal, producto) => {
        // Detecta si el producto es un prearmado (con 'price') o un producto regular (con 'precio')
        const precio = typeof producto.precio === 'number'
          ? producto.precio
          : typeof producto.price === 'number'
          ? producto.price
          : parseFloat(producto.precio || producto.price) || 0;
        return subtotal + precio;
      }, 0);
    }, 0);
    
    localStorage.setItem('totalCompra', totalPrecio); // Guardar el total en localStorage
    window.location.href = "http://localhost:3000/datosEnvio"; 
=======
  // Obtener el stock disponible para cada producto desde el backend
  const obtenerStock = async (productoId) => {
    console.log("Producto ID:", productoId); // Log para verificar el ID
    if (!productoId) return; // Validación extra para evitar enviar solicitudes sin ID
    try {
      const response = await fetch(`http://localhost:3002/components/${productoId}/existencia`);
      const data = await response.json();
      if (data.stockDisponible !== undefined) {
        setStockDisponible(prevStock => ({
          ...prevStock,
          [productoId]: data.stockDisponible,
        }));
      }
    } catch (error) {
      console.error('Error al obtener stock:', error);
    }
  };
  

  // Asegurarse de obtener el stock de todos los productos cuando se carga el componente
  useEffect(() => {
    if (seleccionesState) {
      Object.values(seleccionesState).forEach(productos => {
        productos.forEach(producto => {
          obtenerStock(producto.id); // Llamada para obtener el stock de cada producto
        });
      });
    }
  }, [seleccionesState]);

  const handleRedirect1 = () => {
    window.history.back(); // Regresar a la pantalla anterior
>>>>>>> fe356577f30430da49c6643d6667f067a36e6d53
  };

  const handleConfirmPurchase = () => {
    // Calcular el total de la compra
    const totalPrecio = Object.values(seleccionesState).reduce((total, productos) => {
      return total + productos.reduce((subtotal, producto) => {
        const precio = typeof producto.precio === 'number'
          ? producto.precio
          : typeof producto.price === 'number'
          ? producto.price
          : parseFloat(producto.precio || producto.price) || 0;
        return subtotal + precio * producto.cantidad;
      }, 0);
    }, 0);

    setTotal(totalPrecio); // Guardar el total en el estado

    // Guardar en localStorage (si es necesario para el backend o para el checkout)
    localStorage.setItem('totalCompra', totalPrecio);

    // Redirigir a la página de datos de envío
    navigate("/datosEnvio", { state: { totalPrecio, seleccionesState } });
  };

  if (!seleccionesState) {
    return <div>No hay selecciones disponibles.</div>;
  }

<<<<<<< HEAD
  // Calcular el total para mostrar en el resumen
  const totalPrecio = Object.values(selecciones).reduce((total, productos) => {
    return total + productos.reduce((subtotal, producto) => {
      const precio = typeof producto.precio === 'number'
        ? producto.precio
        : typeof producto.price === 'number'
        ? producto.price
        : parseFloat(producto.precio || producto.price) || 0;
      return subtotal + precio;
=======
  // Función para actualizar la cantidad de un producto
  const actualizarCantidad = (productoId, tipo) => {
    setSeleccionesState(prevSelecciones => {
      const productos = prevSelecciones[productoId] || [];
      const cantidadMaxima = stockDisponible[productoId];
      
      return {
        ...prevSelecciones,
        [productoId]: productos.map(producto => {
          if (producto.id === productoId) {
            const nuevaCantidad = tipo === 'incrementar'
              ? Math.min(cantidadMaxima, producto.cantidad + 1)
              : Math.max(1, producto.cantidad - 1);
            return { ...producto, cantidad: nuevaCantidad };
          }
          return producto;
        })
      };
    });
  };

  // Calcular el total para mostrar en el resumen
  const totalPrecio = Object.values(seleccionesState).reduce((total, productos) => {
    return total + productos.reduce((subtotal, producto) => {
      const precio = (producto.precio || producto.price).toFixed(2);
      return subtotal + precio * producto.cantidad;
>>>>>>> fe356577f30430da49c6643d6667f067a36e6d53
    }, 0);
  }, 0);

  return (
    <div className="resumen-compra">
<<<<<<< HEAD
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
                    <strong>
                      {/* Detecta si el producto es un prearmado (con 'name') o un producto regular (con 'nombre') */}
                      {producto.nombre || producto.name}
                    </strong> - $
                    {(producto.precio || producto.price).toFixed(2)}
                  </li>
                ))}
              </ul>
            </div>
          ))}
=======
      <h2 className="titulo-resumen">Carrito de Compra</h2>

      {Object.keys(seleccionesState).length > 0 ? (
        <div className="tabla-productos">
          <table>
            <thead>
              <tr>
                <th>Producto</th>
                <th>Imagen</th>
                <th>Cantidad</th>
                <th>Stock Disponible</th> {/* Nueva columna para el stock disponible */}
                <th>Precio Unitario</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(seleccionesState).map(([categoria, productos]) => (
                <React.Fragment key={categoria}>
                  <tr className="categoria-row">
                    <td colSpan="6"><strong>{categoria}</strong></td> {/* Actualizamos a 6 columnas */}
                  </tr>
                  {productos.map(producto => {
                    console.log("Producto:", producto); // Verifica si el producto tiene un ID
                    const precio = (producto.precio || producto.price).toFixed(2);
                    const subtotal = (producto.cantidad * precio).toFixed(2);
                    return (
                      <tr key={producto.id}>
                        <td>{producto.nombre || producto.name}</td>
                        <td><img src={producto.imagen} alt={producto.nombre || producto.name} className="imagen-producto" /></td>
                        <td>
                          <button onClick={() => actualizarCantidad(producto.id, 'decrementar')}>-</button>
                          {producto.cantidad}
                          <button onClick={() => actualizarCantidad(producto.id, 'incrementar')}>+</button>
                        </td>
                        <td>{stockDisponible[producto.id] || 0}</td> {/* Mostrar el stock disponible */}
                        <td>${precio}</td>
                        <td>${subtotal}</td>
                      </tr>
                    );
                  })}
                </React.Fragment>
              ))}
            </tbody>
          </table>
>>>>>>> fe356577f30430da49c6643d6667f067a36e6d53
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
        <button className="btn-confirmar" onClick={handleConfirmPurchase}>
          Confirmar Compra
        </button>
      </div>
    </div>
  );
};

export default ResumenCompra;
