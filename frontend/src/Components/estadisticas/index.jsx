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
  const [totalDelCorte, setTotalDelCorte] = useState(0);
  const [paginaActual, setPaginaActual] = useState(1);
  const registrosPorPagina = 10;

  const obtenerVentas = async () => {
    try {
      const response = await fetch('http://localhost:3002/ventas/obtenerVentas');
      const data = await response.json();
      const ventasOrdenadas = data.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

      setVentas(ventasOrdenadas);
      setVentasFiltradas(ventasOrdenadas);
      calcularTotal(ventasOrdenadas);
      actualizarGrafica(ventasOrdenadas);
      calcularCorte(ventasOrdenadas);
    } catch (error) {
      console.error('Error al obtener las ventas:', error);
    }
  };

  const convertirASoloFecha = (fecha) => {
    const nuevaFecha = new Date(fecha);
    return nuevaFecha.toISOString().split('T')[0];
  };

  const calcularTotal = (ventas) => {
    let total = 0;
    const inicio = convertirASoloFecha(fechaInicio);
    const fin = convertirASoloFecha(fechaFin);

    const ventasFiltradasPorFecha = ventas.filter(venta => {
      const fechaVenta = convertirASoloFecha(venta.fecha);
      return fechaVenta >= inicio && fechaVenta <= fin;
    });

    total = ventasFiltradasPorFecha.reduce((sum, venta) => sum + venta.costo * venta.cantidad, 0);
    setTotalDelRango(total);
  };

  const calcularCorte = (ventas) => {
    const ayer = new Date();
    ayer.setDate(ayer.getDate());
    const ayerFecha = convertirASoloFecha(ayer);

    const ventasDeAyer = ventas.filter(venta => convertirASoloFecha(venta.fecha) === ayerFecha);

    const total = ventasDeAyer.reduce((sum, venta) => sum + venta.costo * venta.cantidad, 0);
    setTotalDelCorte(total);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setIdVentaBuscado(value);

    const filtered = ventas.filter(venta =>
      venta.idVenta.toString().includes(value)
    );
    setVentasFiltradas(filtered);
  };

  const handleFechaInicioChange = (e) => {
    setFechaInicio(e.target.value);
  };

  const handleFechaFinChange = (e) => {
    setFechaFin(e.target.value);
  };

  const filtrarPorRangoFechas = () => {
    const inicio = convertirASoloFecha(fechaInicio);
    const fin = convertirASoloFecha(fechaFin);

    if (fin < inicio) {
      alert("La fecha final no puede ser anterior a la fecha de inicio.");
      return;
    }

    const ventasFiltradasPorFecha = ventas.filter(venta => {
      const fechaVenta = convertirASoloFecha(venta.fecha);
      return fechaVenta >= inicio && fechaVenta <= fin;
    });

    setVentasFiltradas(ventasFiltradasPorFecha);
    calcularTotal(ventasFiltradasPorFecha);
    actualizarGrafica(ventasFiltradasPorFecha);
  };

  const getWeekNumber = (d) => {
    const date = new Date(d);
    const firstJanuary = new Date(date.getFullYear(), 0, 1);
    const days = Math.floor((date - firstJanuary) / (24 * 60 * 60 * 1000));
    return Math.ceil((days + firstJanuary.getDay() + 1) / 7);
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
        mapa[fecha] += venta.costo * venta.cantidad;
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

  useEffect(() => {
    obtenerVentas();
  }, []);

  const handleModoGraficaChange = (e) => {
    const nuevoModo = e.target.value;
    setModoGrafica(nuevoModo);
    actualizarGrafica(ventasFiltradas);
  };

  const totalPaginas = Math.ceil(ventasFiltradas.length / registrosPorPagina);

  const cambiarPagina = (numeroPagina) => {
    setPaginaActual(numeroPagina);
  };

  const registrosAPresentar = ventasFiltradas.slice(
    (paginaActual - 1) * registrosPorPagina,
    paginaActual * registrosPorPagina
  );

  const realizarCorte = async () => {
    const corteData = {
        total: totalDelCorte,
        fecha: convertirASoloFecha(new Date()),
    };

    console.log('Datos del corte:', corteData);

    try {
        const response = await fetch('http://localhost:3002/cortes/crearCorte', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(corteData),
        });

        if (response.ok) {
            const nuevoCorte = await response.json();
            alert('Corte realizado con éxito');
            console.log('Nuevo corte:', nuevoCorte);
        } else {
            const errorResponse = await response.text();
            console.error('Error al realizar el corte:', errorResponse);
            alert('Error al realizar el corte: ' + errorResponse);
        }
    } catch (error) {
        console.error('Error al realizar el corte:', error);
        alert('Error al realizar el corte. Inténtalo de nuevo.');
    }
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
                <th>Cantidad</th>
                <th>Costo</th>
                <th>Fecha</th>
              </tr>
            </thead>
            <tbody>
              {registrosAPresentar.map(venta => (
                <tr key={venta.idVenta}>
                  <td>{venta.idVenta}</td>
                  <td>{venta.idUsuario}</td>
                  <td>{venta.cantidad}</td>
                  <td>{venta.costo.toFixed(2)}</td>
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
            <select value={modoGrafica} onChange={handleModoGraficaChange}>
              <option value="diario">Diario</option>
              <option value="semanal">Semanal</option>
              <option value="mensual">Mensual</option>
              <option value="anual">Anual</option>
            </select>
            <Line data={graficaDatos} />
        </div>
      </div>
      <div className='fila-intermedia'>
      <h3>Total de ventas: ${totalDelRango.toFixed(2)} </h3>
        <input
          type="date"
          value={fechaInicio}
          onChange={handleFechaInicioChange}
          className='campof'
        />
        <input
          type="date"
          value={fechaFin}
          onChange={handleFechaFinChange}
          className='campof'
        />
        <button className='botoneslocos' onClick={filtrarPorRangoFechas}>Filtrar</button>
      </div>

      <div className='fila-inferior'>
      <h2>Corte</h2> 
      <h3>Total del corte: {totalDelCorte}</h3>
      <button className='botoneslocos2' onClick={realizarCorte}>Realizar corte</button>
      </div>
    </div>
  </div>
  </div>
  );
};

export default Ventas;
