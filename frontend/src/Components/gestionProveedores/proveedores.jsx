import React, { useState } from 'react';
import './css/styles.css'; // Importa los estilos CSS que definiremos a continuación

const GestionProveedores = () => {
  // Datos simulados de categorías y proveedores
  const categoriasIniciales = [
    { id: 1, nombre: 'Componentes' },
    { id: 2, nombre: 'Periféricos' },
    { id: 3, nombre: 'Almacenamiento' }
  ];

  const proveedoresIniciales = [
    { id: 1, nombre: 'Proveedor 1' },
    { id: 2, nombre: 'Proveedor 2' },
    { id: 3, nombre: 'Proveedor 3' }
  ];

  // Estado para manejar productos, categorías, stock, y filtro
  const [productos, setProductos] = useState([]);
  const [categorias] = useState(categoriasIniciales);
  const [proveedores] = useState(proveedoresIniciales);
  const [filtro, setFiltro] = useState('');
  const [nuevoProducto, setNuevoProducto] = useState({
    nombre: '',
    categoria: '',
    proveedor: '',
    stock: 0
  });

  // Filtrar productos por categoría
  const filtrarProductos = () => {
    if (filtro === '') return productos;
    return productos.filter(producto => producto.categoria === filtro);
  };

  // Manejar cambios en el formulario para agregar un producto
  const manejarCambio = (e) => {
    setNuevoProducto({ ...nuevoProducto, [e.target.name]: e.target.value });
  };

  // Agregar un nuevo producto al estado
  const agregarProducto = (e) => {
    e.preventDefault();
    const productoConId = { ...nuevoProducto, id: productos.length + 1 };
    setProductos([...productos, productoConId]);
    setNuevoProducto({ nombre: '', categoria: '', proveedor: '', stock: 0 });
  };

  return (
    <div className="container">
      <h1 className="main-title">Gestión de Proveedores</h1>

      {/* Filtro por categoría */}
      <div className="filter-container">
        <label className="filter-label">Filtrar por categoría: </label>
        <select className="filter-select" value={filtro} onChange={(e) => setFiltro(e.target.value)}>
          <option value="">Todas</option>
          {categorias.map(categoria => (
            <option key={categoria.id} value={categoria.nombre}>
              {categoria.nombre}
            </option>
          ))}
        </select>
      </div>

      {/* Mostrar lista de productos filtrados */}
      <h2 className="section-title">Lista de Productos</h2>
      <div className="grid">
        {filtrarProductos().map(producto => (
          <div key={producto.id} className="grid-item">
            <h3>{producto.nombre}</h3>
            <p>Stock: {producto.stock}</p>
            <p>Proveedor: {producto.proveedor}</p>
          </div>
        ))}
      </div>

      {/* Formulario para agregar un nuevo producto */}
      <h2 className="section-title">Agregar Producto</h2>
      <form className="form-container" onSubmit={agregarProducto}>
        <div className="form-group">
          <label>Nombre del Producto:</label>
          <input
            type="text"
            name="nombre"
            value={nuevoProducto.nombre}
            onChange={manejarCambio}
            required
          />
        </div>

        <div className="form-group">
          <label>Categoría:</label>
          <select name="categoria" value={nuevoProducto.categoria} onChange={manejarCambio} required>
            <option value="">Seleccione una categoría</option>
            {categorias.map(categoria => (
              <option key={categoria.id} value={categoria.nombre}>
                {categoria.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Proveedor:</label>
          <select name="proveedor" value={nuevoProducto.proveedor} onChange={manejarCambio} required>
            <option value="">Seleccione un proveedor</option>
            {proveedores.map(proveedor => (
              <option key={proveedor.id} value={proveedor.nombre}>
                {proveedor.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Stock:</label>
          <input
            type="number"
            name="stock"
            value={nuevoProducto.stock}
            onChange={manejarCambio}
            required
          />
        </div>

        <button className="submit-button" type="submit">Agregar Producto</button>
      </form>
    </div>
  );
};

export default GestionProveedores;
