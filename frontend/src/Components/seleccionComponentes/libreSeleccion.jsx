import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/libreSeleccion.css';
import { jwtDecode } from 'jwt-decode'; // Importamos jwtDecode

const CategoriaSelector = ({ categorias, categoriaSeleccionada, seleccionarCategoria, finalizarSeleccion }) => (
  <div className="categorias">
    {categorias.map((categoria) => (
      <button
        key={categoria}
        className={`categoria-btn ${categoria === categoriaSeleccionada ? 'seleccionada' : ''}`}
        onClick={() => seleccionarCategoria(categoria)}
      >
        {categoria}
      </button>
    ))}
    <button className="btn-finalizar" onClick={finalizarSeleccion}>Finalizar Selección</button>
  </div>
);

const Filtros = ({ categoria, filtrosDisponibles, filtros, manejarFiltroCambio, aplicarFiltros }) => (
  <div className="filtros">
    <h3>Filtros para {categoria}</h3>
    {Object.keys(filtrosDisponibles).length > 0 ? (
      Object.entries(filtrosDisponibles).map(([filtro, opciones]) => (
        <div key={filtro} className="filtro-dropdown">
          <label>{filtro}:</label>
          <select
            value={filtros[filtro] || ''}
            onChange={(e) => manejarFiltroCambio(filtro, e.target.value)}
          >
            <option value="">Selecciona una opción</option>
            {opciones.map((opcion) => (
              <option key={opcion} value={opcion}>
                {opcion}
              </option>
            ))}
          </select>
        </div>
      ))
    ) : (
      <p>No hay filtros disponibles para esta categoría.</p>
    )}
    <button className="btn-aplicar-filtros" onClick={aplicarFiltros}>Aplicar Filtros</button>
  </div>
);

const ProductoCard = ({ producto, isSelected, seleccionarProducto, mostrarDetallesProducto }) => (
  <div
    className={`producto ${isSelected ? 'seleccionado' : ''}`}
    onClick={() => seleccionarProducto(producto)}
  >
    <h4>{producto.nombre}</h4>
    <p>{producto.descripcion}</p>
    <p>Precio: ${producto.precio}</p>
    <button
      className="btn-detalle"
      onClick={(e) => { e.stopPropagation(); mostrarDetallesProducto(producto); }}
    >
      {isSelected ? '✔ Seleccionado' : 'Seleccionar'}
    </button>
  </div>
);

const LibreSeleccion = () => {
  const navigate = useNavigate();
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');
  const [filtros, setFiltros] = useState({});
  const [productos, setProductos] = useState([]);
  const [filtrosDisponibles, setFiltrosDisponibles] = useState({});
  const [seleccionPorCategoria, setSeleccionPorCategoria] = useState({});
  const [mostrarDetalles, setMostrarDetalles] = useState(null);
  const [error, setError] = useState('');
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token'); // Obtenemos el token
    if (token) {
      const decoded = jwtDecode(token); // Decodificamos el token
      setUserId(decoded.userId); // Suponiendo que el userId está en el token
    } else {
      // Si no hay token, redirigir al login o hacer alguna acción
      window.location.href = 'http://localhost:3000';
    }
  }, []);

  const categorias = [
    'Procesador', 'Tarjeta Madre', 'Tarjeta de Video', 'Memoria RAM',
    'Almacenamiento Principal', 'Disipador', 'Gabinete', 'Fuente de Poder',
    'Ventiladores', 'Tarjetas y Módulos de Red', 'Windows'
  ];

  const seleccionarCategoria = (categoria) => {
    setCategoriaSeleccionada(categoria);
    setFiltros({});
    setProductos(seleccionPorCategoria[categoria] || []);
    cargarFiltros(categoria);
    cargarProductos(categoria);
  };

  const cargarFiltros = (categoria) => {
    fetch(`http://localhost:3002/components/filtros/categoria?categoria=${categoria}`)
      .then((response) => response.json())
      .then((data) => setFiltrosDisponibles(data || {}))
      .catch((error) => console.error('Error fetching filters:', error));
  };

  const cargarProductos = (categoria) => {
    fetch(`/api/productos?categoria=${categoria}`)
      .then((response) => response.json())
      .then((data) => setProductos([...data, ...(seleccionPorCategoria[categoria] || [])]))
      .catch((error) => console.error('Error fetching products:', error));
  };

  const manejarFiltroCambio = (filtro, valor) => {
    setFiltros((prev) => ({
      ...prev,
      [filtro]: valor,
    }));
  };

  const aplicarFiltros = () => {
    const queryParams = new URLSearchParams({
      categoria: categoriaSeleccionada,
      ...filtros
    });

    fetch(`http://localhost:3002/components/buscar/filtros?${queryParams}`)
      .then((response) => response.json())
      .then((data) => {
        const seleccionados = seleccionPorCategoria[categoriaSeleccionada] || [];
        setProductos([...data, ...seleccionados]);
      })
      .catch((error) => console.error('Error fetching filtered products:', error));
  };

  const seleccionarProducto = (producto) => {
    setSeleccionPorCategoria((prev) => {
      const seleccionActual = prev[categoriaSeleccionada] || [];
      const yaSeleccionado = seleccionActual.some(p => p.id === producto.id);
      if (!yaSeleccionado) {
        agregarAlCarrito(producto); // Llamada para agregar el producto al carrito
      }
      return {
        ...prev,
        [categoriaSeleccionada]: yaSeleccionado
          ? seleccionActual.filter(p => p.id !== producto.id)
          : [...seleccionActual, producto],
      };
    });
  };

  // Función para agregar el producto al carrito
  const agregarAlCarrito = (producto) => {
    fetch(`http://localhost:3002/cart/cart/${userId}/addComponentToCart`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        componentId: producto.id,
        quantity: 1, // Aquí ajustamos la cantidad a 1
        price: producto.precio, // Agregamos el precio del producto
      }),
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Error al agregar el producto al carrito');
      }
    })
    .catch((error) => console.error('Error al agregar producto al carrito:', error));
  };

  const mostrarDetallesProducto = (producto) => {
    setMostrarDetalles(producto);
  };

  const cerrarDetalles = () => {
    setMostrarDetalles(null);
  };

  const finalizarSeleccion = () => {
    if (Object.keys(seleccionPorCategoria).length === 0) {
      setError("No has seleccionado ningún componente.");
      return;
    }
    navigate('/resumenCompra', { state: { selecciones: seleccionPorCategoria } });
  };

  return (
    <div className="libreSeleccion">
      <nav className="navbar">
        <div className="logo-text">Easy-PC</div>
      </nav>

      <CategoriaSelector
        categorias={categorias}
        categoriaSeleccionada={categoriaSeleccionada}
        seleccionarCategoria={seleccionarCategoria}
        finalizarSeleccion={finalizarSeleccion}
      />

      {categoriaSeleccionada && (
        <Filtros
          categoria={categoriaSeleccionada}
          filtrosDisponibles={filtrosDisponibles}
          filtros={filtros}
          manejarFiltroCambio={manejarFiltroCambio}
          aplicarFiltros={aplicarFiltros}
        />
      )}

      <div className="productos">
        <h3>Productos en {categoriaSeleccionada}</h3>
        {productos.length > 0 ? (
          productos.map((producto) => (
            <ProductoCard
              key={producto.id}
              producto={producto}
              isSelected={!!seleccionPorCategoria[categoriaSeleccionada]?.find(p => p.id === producto.id)}
              seleccionarProducto={seleccionarProducto}
              mostrarDetallesProducto={mostrarDetallesProducto}
            />
          ))
        ) : (
          <p>Por favor selecciona una categoría y aplica los filtros correspondientes.</p>
        )}
      </div>

      {mostrarDetalles && (
        <div className="popup">
          <div className="popup-content">
            <h4>{mostrarDetalles.nombre}</h4>
            <p>{mostrarDetalles.descripcion}</p>
            <p>Precio: ${mostrarDetalles.precio}</p>
            <button className="btn-seleccionar" onClick={() => seleccionarProducto(mostrarDetalles)}>
              {seleccionPorCategoria[categoriaSeleccionada]?.some(p => p.id === mostrarDetalles.id) ? 'Quitar Selección' : 'Seleccionar'}
            </button>
            <button className="btn-cerrar" onClick={cerrarDetalles}>Cerrar</button>
          </div>
        </div>
      )}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default LibreSeleccion;
