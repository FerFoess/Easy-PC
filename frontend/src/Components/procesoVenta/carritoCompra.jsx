import React, { useState, useEffect } from 'react';
import './css/ShoppingCart.css';
import { jwtDecode } from 'jwt-decode';

const ShoppingCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [error, setError] = useState(null);
  const handleGoBack = () => {
    window.history.back();
  };

 

  // Obtener el userId desde el JWT token almacenado en localStorage
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(token);
      setUserId(decoded.userId);
    } else {
      window.location.href = 'http://localhost:3000';
    }
  }, []);

  useEffect(() => {
    if (userId) {
      const fetchCartData = async () => {
        try {
          // Obtener los items del carrito con sus IDs
          const response = await fetch(`http://localhost:3002/cart/${userId}`);
          const data = await response.json();

          if (response.ok) {
            // Solicitar los detalles de cada componente en una solicitud POST
            const productosConDetalles = await obtenerDetallesComponentes(data.cartItems);
            setCartItems(productosConDetalles);
          } else {
            throw new Error(data.message || 'Error al obtener el carrito');
          }
        } catch (error) {
          console.error('Error al obtener el carrito:', error);
          setError('Hubo un problema al obtener los productos del carrito');
        } finally {
          setLoading(false);
        }
      };
      fetchCartData();
    }
  }, [userId]);

  const obtenerDetallesComponentes = async (cartItems) => {
    try {
      const response = await fetch(`http://localhost:3002/components/getCartItems`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cartItems }),
      });
      const productosConDetalles = await response.json();

      if (response.ok) {
        // Asigna directamente la cantidad como 1 para cada producto
        return productosConDetalles.map(producto => ({
          ...producto,
          cantidad: 1  // Aquí la cantidad se asigna como 1 sin comprobar nada
        }));
      } else {
        throw new Error('Error al obtener detalles de los componentes');
      }
    } catch (error) {
      console.error('Error al obtener los detalles de los componentes:', error);
      return [];
    }
  };

  const handleRemoveItem = async (componentId) => {
    try {
      const response = await fetch(`http://localhost:3002/cart/cart/${userId}/removeComponent`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ componentId }),
      });
  
      if (!response.ok) {
        throw new Error('Error al eliminar el producto');
      }
  
      // Obtener los datos actualizados del carrito después de la eliminación
      const updatedCartResponse = await fetch(`http://localhost:3002/cart/${userId}`);
      const updatedCartData = await updatedCartResponse.json();
  
      if (updatedCartResponse.ok) {
        const productosConDetalles = await obtenerDetallesComponentes(updatedCartData.cartItems);
        setCartItems(productosConDetalles);  // Actualiza los productos en el carrito
      } else {
        throw new Error(updatedCartData.message || 'Error al obtener el carrito actualizado');
      }
    } catch (error) {
      console.error('Error al eliminar el producto:', error);
    }
  };
  
  
  // Limpiar el carrito
  const handleClearCart = async () => {
    try {
      const response = await fetch(`http://localhost:3002/cart/cart/${userId}/clearCart`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Error al limpiar el carrito');
      }

      setCartItems([]);
    } catch (error) {
      console.error('Error al limpiar el carrito:', error);
    }
  };

  // Calcular el subtotal
  const calculateSubtotal = () => {
    return cartItems.reduce((acc, item) => acc + item.precio * item.cantidad, 0).toFixed(2);
  };

  // Función para manejar el cambio de la cantidad localmente
  const handleQuantityChange = (componentId, newQuantity) => {
    if (newQuantity < 1) return;  // No permitir cantidades menores a 1

    // Actualiza la cantidad localmente
    setCartItems(cartItems.map(item => 
      item.id === componentId ? { ...item, cantidad: newQuantity } : item
    ));
  };

  const handleCheckout = async () => {
    try {
      const subtotal = calculateSubtotal(); // Calcula el subtotal directamente
      const response = await fetch(`http://localhost:3002/cart/cart/${userId}/updateTotal`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ total: subtotal }), // Enviar el total calculado
      });
  
      if (!response.ok) {
        throw new Error('Error al actualizar el total');
      }
  
      // Aquí directamente guardamos el total en localStorage
      localStorage.setItem('totalCompra', subtotal);
      alert(subtotal)
      // Después de guardar el total, rediriges a la siguiente pantalla
      window.location.href = "http://localhost:3000/datosenvio"; 
    } catch (error) {
      console.error('Error al hacer el checkout:', error);
    }
  };
  

  // Imagen por defecto
  const defaultImage = 'https://via.placeholder.com/150';

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="shopping-cart">
      <h1>Tu Carrito de compra</h1>
      <table className="cart-table">
        <thead>
          <tr>
            <th>Imagen</th>
            <th>Producto</th>
            <th>Precio unitario</th>
            <th>Cantidad</th>
            <th>Stock</th>
            <th>Subtotal</th>
            <th>Remover</th>
          </tr>
        </thead>
        <tbody>
          {cartItems.length === 0 ? (
            <tr>
              <td colSpan="7" style={{ textAlign: 'center' }}>
                Aún no tienes productos en tu carrito de compras. Agrega productos para empezar a verlos aquí.
              </td>
            </tr>
          ) : (
            cartItems.map(item => {
              const imageSrc = item.imagen || defaultImage;

              return (
                <tr key={item.id}>
                  <td><img src={imageSrc} alt={item.nombre} className="product-image" /></td>
                  <td className="product-info">{item.nombre}</td>
                  <td>${item.precio.toFixed(2)}</td>
                  <td>
                    <input
                      type="number"
                      value={item.cantidad}
                      min="1"
                      max={item.stock}
                      onChange={e => handleQuantityChange(item.id, parseInt(e.target.value, 10))}
                    />
                  </td>
                  <td>{item.stock}</td>
                  <td>${(item.precio * item.cantidad).toFixed(2)}</td>
                  <td>
                    <button onClick={() => handleRemoveItem(item.id)}>Remover</button>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>

      {cartItems.length > 0 && (
        <button onClick={handleClearCart} className="clear-cart-button">
          Limpiar carrito
        </button>
      )}

      <div className="cart-totals">
        <div>
          <span>Subtotal:</span>
          <span>${calculateSubtotal()}</span>
        </div>
        <div>
          <span>Total:</span>
          <span>${calculateSubtotal()}</span>
        </div>
      </div>

      <div className="buttons-container">
        <button className="go-back-button" onClick={handleGoBack}>
          Regresar
        </button>
        <button className="checkout-button" onClick={handleCheckout}>
          Comprar
        </button>
      </div>
    </div>
  );
};

export default ShoppingCart;
