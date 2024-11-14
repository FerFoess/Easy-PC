import React, { useEffect, useState } from 'react';
import './css/index.css';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement } from 'chart.js';
import Navbar from '../navBarAdmins/navbar';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

const Corte = () => {
  const [paginaActual, setPaginaActual] = useState(1);
  const [cortes, setCortes] = useState([]); // Estado para almacenar los cortes obtenidos
  const [cortesFiltrados, setCortesFiltrados] = useState([]);
  const [ventas, setVentas] = useState([]); // Estado para almacenar las ventas
  const [ventasDelDia, setVentasDelDia] = useState([]); // Ventas filtradas por el día actual
  const [busqueda, setBusqueda] = useState('');
  const registrosPorPagina = 10;

  const realizarCorte = async () => {
    const fechaActual = new Date().toISOString().split('T')[0]; // Obtener la fecha actual en formato YYYY-MM-DD
    const totalVentasDelDia = ventasDelDia.reduce((acc, venta) => acc + venta.total, 0); // Sumar el total mostrado en <h3>
  
    try {
      const response = await fetch('http://localhost:3002/cortes/crearCorte', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fecha: fechaActual, total: totalVentasDelDia }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        alert('Corte realizado con éxito');
        obtenerCortes(); // Actualizar la lista de cortes si tienes una función para eso
      } else if (response.status === 409) {
        alert(data.error || 'El corte ya se ha realizado para esta fecha.');
      } else {
        alert(data.error || 'Error al realizar el corte');
      }
    } catch (error) {
      console.error('Error al realizar el corte:', error);
      alert('Error al realizar el corte');
    }
  };
  
  

  // Obtener la fecha actual en formato YYYY-MM-DD
  const obtenerFechaActual = () => {
    const hoy = new Date();
    return hoy.toISOString().split('T')[0]; // Formato: 'YYYY-MM-DD'
  };

  // Función para obtener las ventas
  const obtenerVentas = async () => {
    try {
      const response = await fetch('http://localhost:3002/ventas/obtenerVentas');
      const data = await response.json();
      const ventasOrdenadas = data.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

      // Filtrar las ventas para mostrar solo las del día actual
      const ventasHoy = ventasOrdenadas.filter(
        (venta) => venta.fecha.split('T')[0] === obtenerFechaActual()
      );

      setVentas(ventasOrdenadas);
      setVentasDelDia(ventasHoy);
    } catch (error) {
      console.error('Error al obtener las ventas:', error);
    }
  };

  // Función para obtener los cortes
  const obtenerCortes = async () => {
    try {
      const response = await fetch('http://localhost:3002/cortes/obtenerCortesVentas');
      const data = await response.json();
      setCortes(data);
      setCortesFiltrados(data); // Inicializar con todos los cortes
    } catch (error) {
      console.error('Error al obtener los cortes:', error);
    }
  };

  // Llamar a obtenerVentas y obtenerCortes al cargar la página
  useEffect(() => {
    obtenerVentas();
    obtenerCortes();
  }, []);

  // Filtrar cortes por búsqueda
  useEffect(() => {
    const resultadosFiltrados = cortes.filter((corte) =>
      corte.fecha.toLowerCase().includes(busqueda.toLowerCase())
    );
    setCortesFiltrados(resultadosFiltrados);
    setPaginaActual(1); // Reiniciar a la primera página al buscar
  }, [busqueda, cortes]);

  const totalPaginas = Math.ceil(cortesFiltrados.length / registrosPorPagina);

  const cambiarPagina = (numeroPagina) => {
    setPaginaActual(numeroPagina);
  };

  const registrosAPresentar = cortesFiltrados.slice(
    (paginaActual - 1) * registrosPorPagina,
    paginaActual * registrosPorPagina
  );

  // Función para formatear la fecha a 'YYYY-MM-DD'
const formatearFecha = (valor) => {
    // Eliminar cualquier carácter que no sea un dígito
    valor = valor.replace(/\D/g, '');
    
    // Formatear automáticamente a 'YYYY-MM-DD'
    if (valor.length >= 4) {
      valor = valor.slice(0, 4) + '-' + valor.slice(4);
    }
    if (valor.length >= 7) {
      valor = valor.slice(0, 7) + '-' + valor.slice(7);
    }
    
    // Limitar a 'YYYY-MM-DD'
    return valor.slice(0, 10);
  };

  return (
    <div className='contenedor'>
      <Navbar />
      <div className='rectangulo-gris'>
        <div className='columna-izquierda'>
          <h2>Cortes</h2>
<input
  type='text'
  placeholder='Buscar corte por fecha'
  className='search-input'
  value={busqueda}
  onChange={(e) => setBusqueda(formatearFecha(e.target.value))}
/>

          <table className='ventas-table'>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {registrosAPresentar.length > 0 ? (
                registrosAPresentar.map((corte) => (
                  <tr key={corte.fecha}>
                    <td>{corte.fecha}</td>
                    <td>{corte.total}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan='2'>No se encontraron resultados</td>
                </tr>
              )}
            </tbody>
          </table>

          <div className='paginacion'>
            {Array.from({ length: totalPaginas }, (_, index) => (
              <button
                key={index + 1}
                onClick={() => cambiarPagina(index + 1)}
                className={`pagina-button ${paginaActual === index + 1 ? 'active' : ''}`}
              >
                {index + 1}
              </button>
            ))}
          </div>
          <br></br>
        </div>

        <div className='columna-derecha'>
          <div className='fila-inter'>
            <h3>Total de ventas del día: ${ventasDelDia.reduce((acc, venta) => acc + venta.total, 0)}</h3>
            <button className='botoneslocos22' onClick={realizarCorte}>Realizar corte</button>
            <h2>Ventas de hoy:</h2>
            <table className='ventas-table'>
              <thead>
                <tr>
                  <th>ID Venta</th>
                  <th>Cliente</th>
                  <th>Total</th>
                  <th>Fecha</th>
                </tr>
              </thead>
              <tbody>
                {ventasDelDia.length > 0 ? (
                  ventasDelDia.map((venta) => (
                    <tr key={venta.idVenta}>
                      <td>{venta.idVenta}</td>
                      <td>{venta.idUsuario}</td>
                      <td>${venta.total}</td>
                      <td>{venta.fecha.split('T')[0]}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan='4'>No hay ventas para hoy</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Corte;
