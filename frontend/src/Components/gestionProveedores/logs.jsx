import React, { useState } from 'react';

// Componente para solicitar productos
const SolicitarProductos = ({ historialPedidos, setHistorialPedidos }) => {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [proveedores] = useState([
    { id: 1, nombre: 'Proveedor 1' },
    { id: 2, nombre: 'Proveedor 2' },
    { id: 3, nombre: 'Proveedor 3' }
  ]);
  const [nuevoProducto, setNuevoProducto] = useState({
    nombre: '',
    categoria: '',
    proveedor: '',
    stock: 0
  });

  // Manejar cambios en el formulario para solicitar un producto
  const manejarCambio = (e) => {
    setNuevoProducto({ ...nuevoProducto, [e.target.name]: e.target.value });
  };

  // Solicitar un nuevo producto, confirmando el pedido y guardando en el historial
  const solicitarProducto = (e) => {
    e.preventDefault();
    const productoSolicitado = { ...nuevoProducto, id: productos.length + 1 };
    // Actualizar el historial de pedidos
    setHistorialPedidos([...historialPedidos, productoSolicitado]);
    setNuevoProducto({ nombre: '', categoria: '', proveedor: '', stock: 0 });
    
    // Mostrar confirmación del pedido
    alert('Pedido confirmado.');
  };

  return (
    <div className="container">
      <h1 className="main-title">Solicitud de Productos</h1>

      {/* Formulario para solicitar un nuevo producto */}
      <h2 className="section-title">Solicitar Producto</h2>
      <form className="form-container" onSubmit={solicitarProducto}>
        <div className="form-group">
          <label>Nombre del Producto:</label>
          <select
            name="nombre"
            value={nuevoProducto.nombre}
            onChange={manejarCambio}
            required
          >
            <option value="">Seleccione un producto</option>
            {productos.map(producto => (
              <option key={producto._id} value={producto.nombre}>
                {producto.nombre}
              </option>
            ))}
          </select>
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
          <label>Cantidad solicitada:</label>
          <input
            type="number"
            name="stock"
            value={nuevoProducto.stock}
            onChange={manejarCambio}
            required
          />
        </div>

        <button className="submit-button" type="submit">Solicitar Producto</button>
      </form>
    </div>
  );
};

// Componente para mostrar el historial de pedidos
const HistorialPedidos = ({ historialPedidos }) => {
  return (
    <div className="container">
      <h1 className="main-title">Historial de Pedidos</h1>
      {historialPedidos.length > 0 ? (
        <table className="log-table">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Categoría</th>
              <th>Proveedor</th>
              <th>Cantidad</th>
            </tr>
          </thead>
          <tbody>
            {historialPedidos.map((pedido, index) => (
              <tr key={index}>
                <td>{pedido.nombre}</td>
                <td>{pedido.categoria}</td>
                <td>{pedido.proveedor}</td>
                <td>{pedido.stock}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No hay pedidos en el historial.</p>
      )}
    </div>
  );
};

// Componente principal con navegación entre SolicitarProductos y HistorialPedidos
const App = () => {
  const [pantallaActual, setPantallaActual] = useState('solicitar'); // Controlar pantalla actual
  const [historialPedidos, setHistorialPedidos] = useState([]); // Historial de pedidos

  return (
    <div>
      <nav>
        <button onClick={() => setPantallaActual('solicitar')}>Solicitar Productos</button>
        <button onClick={() => setPantallaActual('historial')}>Historial de Pedidos</button>
      </nav>

      {pantallaActual === 'solicitar' && (
        <SolicitarProductos historialPedidos={historialPedidos} setHistorialPedidos={setHistorialPedidos} />
      )}
      {pantallaActual === 'historial' && <HistorialPedidos historialPedidos={historialPedidos} />}
    </div>
  );
};

export default App;
