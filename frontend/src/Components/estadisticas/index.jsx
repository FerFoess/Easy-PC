import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import './css/stylesEst.css';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement } from 'chart.js';
import Navbar from '../navBarAdmins/navbar';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

const Ventas = () => {
  const [ventas, setVentas] = useState([]);
  const [idVentaBuscado, setIdVentaBuscado] = useState('');
  const [ventasFiltradas, setVentasFiltradas] = useState([]);
  const [totalDelRango, setTotalDelRango] = useState(0);
  const [fechaInicio, setFechaInicio] = useState(() => {
    const fecha = new Date();
    fecha.setDate(fecha.getDate());
    return fecha.toISOString().split('T')[0];
  });
  const [fechaFin, setFechaFin] = useState(() => {
    const fecha = new Date();
    fecha.setDate(fecha.getDate());
    return fecha.toISOString().split('T')[0];
  });
  const [graficaDatos, setGraficaDatos] = useState({ labels: [], datasets: [] });
  const [modoGrafica, setModoGrafica] = useState('diario');
  const [paginaActual, setPaginaActual] = useState(1);
  const registrosPorPagina = 10;

  const obtenerVentas = async () => {
    try {
      const response = await fetch('http://localhost:3002/ventas/obtenerVentas');
      const data = await response.json();
      const ventasOrdenadas = data.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
      
      setVentas(ventasOrdenadas);
      actualizarGrafica(ventasOrdenadas);
      setVentasFiltradas(ventasOrdenadas); // Inicialmente todas las ventas
    } catch (error) {
      console.error('Error al obtener las ventas:', error);
    }
  };

  const actualizarGrafica = (ventasFiltradasPorFecha) => {
    let labels = [];
    let data = [];

    const agruparPorFecha = (ventas) => {
      const mapa = {};
      ventas.forEach(venta => {
        const fecha = convertirASoloFecha(venta.fecha);
        if (!mapa[fecha]) {
          mapa[fecha] = 0;
        }
        mapa[fecha] = venta.total;
      });
      return mapa;
    };

    const datosAgrupados = agruparPorFecha(ventasFiltradasPorFecha);

    if (modoGrafica === 'diario') {
      labels = Object.keys(datosAgrupados).sort();
      data = labels.map(fecha => datosAgrupados[fecha]);
    } else if (modoGrafica === 'semanal') {
      const semanas = {};
      Object.entries(datosAgrupados).forEach(([fecha, ganancia]) => {
        const fechaObj = new Date(fecha);
        const semana = `${fechaObj.getFullYear()}-W${getWeekNumber(fechaObj)}`;
        if (!semanas[semana]) {
          semanas[semana] = 0;
        }
        semanas[semana] += ganancia;
      });
      labels = Object.keys(semanas).sort();
      data = labels.map(semana => semanas[semana]);
    } else if (modoGrafica === 'mensual') {
      const meses = {};
      Object.entries(datosAgrupados).forEach(([fecha, ganancia]) => {
        const fechaObj = new Date(fecha);
        const mes = `${fechaObj.getFullYear()}-${fechaObj.getMonth() + 1}`;
        if (!meses[mes]) {
          meses[mes] = 0;
        }
        meses[mes] += ganancia;
      });
      labels = Object.keys(meses).sort();
      data = labels.map(mes => meses[mes]);
    } else if (modoGrafica === 'anual') {
      const anos = {};
      Object.entries(datosAgrupados).forEach(([fecha, ganancia]) => {
        const fechaObj = new Date(fecha);
        const anio = fechaObj.getFullYear();
        if (!anos[anio]) {
          anos[anio] = 0;
        }
        anos[anio] += ganancia;
      });
      labels = Object.keys(anos).sort();
      data = labels.map(anio => anos[anio]);
    }

    setGraficaDatos({
      labels,
      datasets: [
        {
          label: `Ganancias (${modoGrafica})`,
          data,
          backgroundColor: 'rgba(75,192,192,0.4)',
          borderColor: 'rgba(75,192,192,1)',
          borderWidth: 2
        }
      ]
    });
  };

  const handleModoGraficaChange = (e) => {
    const nuevoModo = e.target.value;
    setModoGrafica(nuevoModo);
    actualizarGrafica(ventasFiltradas);
  };

  const handleSearchChange = (e) => {
    setIdVentaBuscado(e.target.value);
  };

  const filtrarPorRangoFechas = () => {
    const ventasFiltradasPorFecha = ventas.filter(venta => {
      const fechaVenta = new Date(venta.fecha);
      return fechaVenta >= new Date(fechaInicio) && fechaVenta <= new Date(fechaFin);
    });
    setVentasFiltradas(ventasFiltradasPorFecha);
    actualizarGrafica(ventasFiltradasPorFecha);
    calcularTotalDelRango(ventasFiltradasPorFecha);
  };

  const calcularTotalDelRango = (ventasFiltradasPorFecha) => {
    const total = ventasFiltradasPorFecha.reduce((acumulado, venta) => acumulado + venta.total, 0);
    setTotalDelRango(total);
  };

  const totalPaginas = Math.ceil(ventasFiltradas.length / registrosPorPagina);

  const cambiarPagina = (numeroPagina) => {
    setPaginaActual(numeroPagina);
  };

  const registrosAPresentar = ventasFiltradas.slice(
    (paginaActual - 1) * registrosPorPagina,
    paginaActual * registrosPorPagina
  );

  useEffect(() => {
    obtenerVentas();
  }, []);

  // Función para convertir la fecha a solo fecha (sin hora)
  const convertirASoloFecha = (fecha) => {
    const fechaObj = new Date(fecha);
    return fechaObj.toISOString().split('T')[0];
  };

  // Función para obtener el número de semana de una fecha
  const getWeekNumber = (fecha) => {
    const date = new Date(fecha);
    const startDate = new Date(date.getFullYear(), 0, 1);
    const days = Math.floor((date - startDate) / (24 * 60 * 60 * 1000));
    return Math.ceil((days + startDate.getDay() + 1) / 7);
  };

  return (
    <div className='contenedor'>
      <Navbar />
      <div className='rectangulo-gris'>
        <div className='columna-izquierda'>
          <h2>Ventas</h2>
          <input
            type="text"
            value={idVentaBuscado}
            onChange={handleSearchChange}
            placeholder="Buscar por ID de venta"
            className="search-input"
          />
          <table className="ventas-table">
            <thead>
              <tr>
                <th>ID Venta</th>
                <th>Cliente</th>
                <th>Total</th>
                <th>Fecha</th>
              </tr>
            </thead>
            <tbody>
              {registrosAPresentar.filter(venta => venta.idVenta.toString().includes(idVentaBuscado)).map(venta => (
                <tr key={venta.idVenta}>
                  <td>{venta.idVenta}</td>
                  <td>{venta.idUsuario}</td>
                  <td>{venta.total.toFixed(2)}</td>
                  <td>{convertirASoloFecha(venta.fecha)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="paginacion">
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
        </div>

        <div className='columna-derecha'>
          <div className='fila-superior'>
            <div className="grafica-ganancias">
              <h2>Gráfica de Ventas</h2>
              <div className="grafica-selector">
                <label>Modo Gráfico:</label>
                <select value={modoGrafica} onChange={handleModoGraficaChange}>
                  <option value="diario">Diario</option>
                  <option value="semanal">Semanal</option>
                  <option value="mensual">Mensual</option>
                  <option value="anual">Anual</option>
                </select>
              </div>
              <Line data={graficaDatos} />
            </div>
          </div>

          <div className='fila-intermedia'>
            <h3>Total de ventas: ${totalDelRango.toFixed(2)}</h3>
            <label>Desde:</label>
            <input
              type="date"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              className='campof's
            />
            <label>Hasta:</label>
            <input
              type="date"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
              className='campof'
            />
            <button  className='botoneslocos' onClick={filtrarPorRangoFechas}>Filtrar</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ventas;
