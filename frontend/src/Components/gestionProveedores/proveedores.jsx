import React, { useState, useEffect } from 'react';
import './css/styles.css';

const GestionProveedores = () => {
  const [categorias, setCategorias] = useState([
    { id: 1, nombre: 'CPU' },
    { id: 2, nombre: 'RAM' },
    { id: 3, nombre: 'Almacenamiento' },
    { id: 4, nombre: 'Placa Madre' },
    { id: 5, nombre: 'GPU' },
    { id: 6, nombre: 'Fuente de poder' },
    { id: 7, nombre: 'Gabinete' }
  ]);
  const [productos, setProductos] = useState([]);
  const [filtroCategoria, setFiltroCategoria] = useState('RAM');
  const [filtroProducto, setFiltroProducto] = useState('');
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);

  // Estado para manejar el filtro de proveedores
  const [filtroProveedor, setFiltroProveedor] = useState('');
  
  // Estado para manejar la cantidad seleccionada por cada proveedor
  const [cantidadSeleccionada, setCantidadSeleccionada] = useState({});
  const [totalPagar, setTotalPagar] = useState(0);

  useEffect(() => {
    const obtenerProductos = async () => {
      try {
        const respuesta = await fetch('http://localhost:3002/produ');
        const datos = await respuesta.json();
        console.log('Productos obtenidos:', datos);  // Agrega este console log
        setProductos(datos);
      } catch (error) {
        console.error('Error al cargar los productos:', error);
      }
    };   

    obtenerProductos();
  }, []);

  // Filtrar productos por categoría seleccionada y por nombre
  const productosFiltrados = productos.filter(producto => 
    producto.categoria?.toLowerCase() === filtroCategoria.toLowerCase() && 
    producto.nombre?.toLowerCase().includes(filtroProducto.toLowerCase())
  );
  

  // Filtrar proveedores por el filtro de búsqueda
  const proveedoresFiltrados = productoSeleccionado
    ? productoSeleccionado.proveedores.filter(proveedor =>
        proveedor.proveedor.toLowerCase().includes(filtroProveedor.toLowerCase())
      )
    : [];

  // Función para actualizar la cantidad seleccionada de stock y calcular el total a pagar
  const manejarCambioCantidad = (proveedor, cantidad) => {
    const nuevaCantidad = { ...cantidadSeleccionada, [proveedor.proveedor]: parseInt(cantidad) || 0 };
    setCantidadSeleccionada(nuevaCantidad);

    // Calcular el total a pagar sumando el precio de cada proveedor multiplicado por la cantidad seleccionada
    const nuevoTotal = proveedoresFiltrados.reduce((total, proveedor) => {
      const cantidadProveedor = nuevaCantidad[proveedor.proveedor] || 0;
      return total + (cantidadProveedor * proveedor.precio_proveedor);
    }, 0);

    setTotalPagar(nuevoTotal);
  };

  // Función para mostrar detalles del producto seleccionado
  const mostrarDetalles = (detalles) => {
    if (!detalles || typeof detalles !== 'object') return null;
  
    return Object.entries(detalles).map(([clave, valor]) => (
      <li key={clave}><strong>{clave.replace(/_/g, ' ')}:</strong> {valor}</li>
    ));
  };
  

  return (
    <div className="contenedor">
      {/* Barra lateral de categorías */}
      <div className="sidebar">
        <h2 style={{ color: 'white' }}>Categorías</h2>
        <ul>
          {categorias.map(categoria => (
            <li
              key={categoria.id}
              style={{ color: 'white' }}
              className={filtroCategoria === categoria.nombre ? 'active' : ''}
              onClick={() => setFiltroCategoria(categoria.nombre)}
            >
              {categoria.nombre}
            </li>
          ))}
        </ul>
      </div>

      {/* Área principal de productos */}
      <div className="main-content">
        <h1 style={{ color: 'white' }}>Gestión productos/proveedores</h1>

        {/* Barra de búsqueda de productos */}
        <div className="search-bar">
          <input
            type="text"
            placeholder="Buscar productos"
            value={filtroProducto}
            onChange={(e) => setFiltroProducto(e.target.value)}
          />
          <select value={filtroCategoria} onChange={(e) => setFiltroCategoria(e.target.value)}>
            {categorias.map(categoria => (
              <option key={categoria.id} value={categoria.nombre}>
                {categoria.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* Productos en formato de tarjeta */}
        <div className="grid-productos">
          {productosFiltrados.map(producto => (
            <div key={producto._id} className="producto-card" onClick={() => setProductoSeleccionado(producto)}>
              <img src={producto.imagen || 'https://via.placeholder.com/150'} alt={producto.nombre} />
              <h3>{producto.nombre}</h3>
              <p>Modelo: {producto.modelo}</p>
              <p>Marca: {producto.marca}</p>
              <p>Stock: {producto.proveedores ? producto.proveedores.reduce((total, prov) => total + prov.stock, 0) : 'No disponible'}</p>
              <p>Precio: ${producto.precio_base}</p>
            </div>
          ))}
        </div>

        {/* Detalles del producto seleccionado */}
        {productoSeleccionado && (
          <div className="detalle-producto">
            <h2>{productoSeleccionado.nombre}</h2>
            <img src={productoSeleccionado.imagen || 'https://via.placeholder.com/150'} alt={productoSeleccionado.nombre} />
            <p><strong>Precio:</strong> ${productoSeleccionado.precio_base}</p>
            <p><strong>Stock:</strong> {productoSeleccionado.proveedores ? productoSeleccionado.proveedores.reduce((total, prov) => total + prov.stock, 0) : 'No disponible'}</p>
            <h3>Detalles:</h3>
            <ul>
              {mostrarDetalles(productoSeleccionado.detalles)}
            </ul>

            {/* Barra de búsqueda de proveedores */}
            <div className="search-bar-proveedores">
              <input
                type="text"
                placeholder="Buscar proveedores"
                value={filtroProveedor}
                onChange={(e) => setFiltroProveedor(e.target.value)}
              />
            </div>

            {/* Proveedores en formato de tarjeta */}
            <div className="grid-proveedores">
              {proveedoresFiltrados.map(proveedor => (
                <div key={proveedor.proveedor} className="proveedor-card">
                  <h4>{proveedor.proveedor}</h4>
                  <p>Stock disponible: {proveedor.stock}</p>
                  <p>Precio del proveedor: ${proveedor.precio_proveedor}</p>

                  {/* Selección de stock para solicitar */}
                  <div className="cantidad-stock">
                    <label htmlFor={`cantidad-${proveedor.proveedor}`}>Cantidad:</label>
                    <input
                      type="number"
                      id={`cantidad-${proveedor.proveedor}`}
                      min="0"
                      max={proveedor.stock}
                      value={cantidadSeleccionada[proveedor.proveedor] || 0}
                      onChange={(e) => manejarCambioCantidad(proveedor, e.target.value)}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Mostrar el total a pagar */}
            <div className="total-pagar">
              <h3>Total a pagar: ${totalPagar.toFixed(2)}</h3>
            </div>

            <button className="btn-request">Solicitar producto</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GestionProveedores;
