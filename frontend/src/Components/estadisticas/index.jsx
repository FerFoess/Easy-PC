import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto'; // Necesario para los gráficos de Chart.js
import './css/styles.css'; // Importar el archivo CSS para el diseño
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement } from 'chart.js';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);


const Ventas = () => {
  const [ventas, setVentas] = useState([]);
  const [idVentaBuscado, setIdVentaBuscado] = useState('');
  const [ventasFiltradas, setVentasFiltradas] = useState([]);
  const [totalDelRango, setTotalDelRango] = useState(0);
  const [fechaInicio, setFechaInicio] = useState(new Date().toISOString().split('T')[0]); // Fecha actual por defecto para inicio
  const [fechaFin, setFechaFin] = useState(new Date().toISOString().split('T')[0]); // Fecha actual por defecto para fin
  const [graficaDatos, setGraficaDatos] = useState({ labels: [], datasets: [] });
  const [modoGrafica, setModoGrafica] = useState('diario'); // Estado para el tipo de gráfico: diario, semanal, mensual, anual
  const [totalDelCorte, setTotalDelCorte] = useState(0);

  // Función para obtener todas las ventas del backend
  const obtenerVentas = async () => {
    try {
      const response = await fetch('http://localhost:3002/ventas/obtenerVentas');
      const data = await response.json();
      setVentas(data);
      setVentasFiltradas(data); // Inicialmente mostrar todas las ventas
      calcularTotal(data); // Calcular el total de ventas para el rango de fechas inicial
      actualizarGrafica(data); // Actualizar la gráfica con todas las ventas
    } catch (error) {
      console.error('Error al obtener las ventas:', error);
    }
  };

  // Función para convertir la fecha a formato yyyy-mm-dd (ignorar la hora)
  const convertirASoloFecha = (fecha) => {
    const nuevaFecha = new Date(fecha);
    return nuevaFecha.toISOString().split('T')[0]; // Devolver solo la parte de la fecha (yyyy-mm-dd)
  };

  // Función para calcular el total de ventas basado en el rango de fechas
  const calcularTotal = (ventas) => {
    let total = 0;
    const inicio = convertirASoloFecha(fechaInicio);
    const fin = convertirASoloFecha(fechaFin);

    const ventasFiltradasPorFecha = ventas.filter(venta => {
      const fechaVenta = convertirASoloFecha(venta.fecha); // Convertir fecha de la venta a yyyy-mm-dd
      return fechaVenta >= inicio && fechaVenta <= fin; // Comparación solo con fechas, sin horas
    });

    total = ventasFiltradasPorFecha.reduce((sum, venta) => sum + venta.costo * venta.cantidad, 0);
    setTotalDelRango(total);
  };

  // Función para calcular el corte del día actual
  const calcularCorte = () => {
  const hoy = convertirASoloFecha(new Date()); // Obtener la fecha actual en formato yyyy-mm-dd
  const ventasDeHoy = ventas.filter(venta => convertirASoloFecha(venta.fecha) === hoy); // Filtrar ventas solo de hoy

  const total = ventasDeHoy.reduce((sum, venta) => sum + venta.costo * venta.cantidad, 0); // Calcular el total
  setTotalDelCorte(total); // Actualizar el estado con el total del corte
};


  // Función para manejar el cambio en el campo de búsqueda
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setIdVentaBuscado(value);

    // Filtrar las ventas por el idVenta ingresado
    const filtered = ventas.filter(venta =>
      venta.idVenta.toString().includes(value) // Comparación como cadena
    );
    setVentasFiltradas(filtered);
  };

  // Función para manejar el cambio de fecha inicial
  const handleFechaInicioChange = (e) => {
    setFechaInicio(e.target.value);
  };

  // Función para manejar el cambio de fecha final
  const handleFechaFinChange = (e) => {
    setFechaFin(e.target.value);
  };

  // Función para filtrar las ventas por el rango de fechas
  const filtrarPorRangoFechas = () => {
    const inicio = convertirASoloFecha(fechaInicio);
    const fin = convertirASoloFecha(fechaFin);

    if (fin < inicio) {
      alert("La fecha final no puede ser anterior a la fecha de inicio.");
      return;
    }

    const ventasFiltradasPorFecha = ventas.filter(venta => {
      const fechaVenta = convertirASoloFecha(venta.fecha); // Convertir fecha de la venta a yyyy-mm-dd
      return fechaVenta >= inicio && fechaVenta <= fin; // Comparación solo con fechas
    });

    setVentasFiltradas(ventasFiltradasPorFecha);
    calcularTotal(ventasFiltradasPorFecha); // Calcular el total de las ventas filtradas
    actualizarGrafica(ventasFiltradasPorFecha); // Actualizar la gráfica con las ventas filtradas
  };

  // Función para obtener el número de la semana
  const getWeekNumber = (d) => {
    const date = new Date(d);
    const firstJanuary = new Date(date.getFullYear(), 0, 1);
    const days = Math.floor((date - firstJanuary) / (24 * 60 * 60 * 1000));
    return Math.ceil((days + firstJanuary.getDay() + 1) / 7);
  };

  // Función para actualizar los datos de la gráfica según el modo seleccionado
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
      labels = Object.keys(datosAgrupados).sort(); // Ordenar las fechas
      data = labels.map(fecha => datosAgrupados[fecha]); // Obtener los valores según el orden de las etiquetas
    } else if (modoGrafica === 'semanal') {
      // Agrupar por semanas
      const semanas = {};
      Object.entries(datosAgrupados).forEach(([fecha, ganancia]) => {
        const fechaObj = new Date(fecha);
        const semana = `${fechaObj.getFullYear()}-W${getWeekNumber(fechaObj)}`; // Formato: año-semana
        if (!semanas[semana]) {
          semanas[semana] = 0;
        }
        semanas[semana] += ganancia;
      });
      labels = Object.keys(semanas).sort(); // Ordenar las semanas
      data = labels.map(semana => semanas[semana]); // Obtener los valores según el orden de las etiquetas
    } else if (modoGrafica === 'mensual') {
      // Agrupar por meses
      const meses = {};
      Object.entries(datosAgrupados).forEach(([fecha, ganancia]) => {
        const fechaObj = new Date(fecha);
        const mes = `${fechaObj.getFullYear()}-${fechaObj.getMonth() + 1}`; // Formato: año-mes
        if (!meses[mes]) {
          meses[mes] = 0;
        }
        meses[mes] += ganancia;
      });
      labels = Object.keys(meses).sort(); // Ordenar los meses
      data = labels.map(mes => meses[mes]); // Obtener los valores según el orden de las etiquetas
    } else if (modoGrafica === 'anual') {
      // Agrupar por años
      const anos = {};
      Object.entries(datosAgrupados).forEach(([fecha, ganancia]) => {
        const fechaObj = new Date(fecha);
        const anio = fechaObj.getFullYear();
        if (!anos[anio]) {
          anos[anio] = 0;
        }
        anos[anio] += ganancia;
      });
      labels = Object.keys(anos).sort(); // Ordenar los años
      data = labels.map(anio => anos[anio]); // Obtener los valores según el orden de las etiquetas
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

  // Hook para obtener las ventas al cargar el componente
  useEffect(() => {
    obtenerVentas();
  }, []);

  const handleModoGraficaChange = (e) => {
    const nuevoModo = e.target.value;
    setModoGrafica(nuevoModo);
    actualizarGrafica(ventasFiltradas); // Actualizar la gráfica con el nuevo modo
  };
  

return (
  <div className='contenedor'>
  <div className='rectangulo-gris'>
    <div className='columna-izquierda'>
  <h2>Ventas Filtradas</h2>
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
        <th>Cantidad</th>
        <th>Costo</th>
        <th>Fecha</th>
      </tr>
    </thead>
    <tbody>
      {ventasFiltradas.map(venta => (
        <tr key={venta.idVenta}>
          <td>{venta.idVenta}</td>
          <td>{venta.cantidad}</td>
          <td>{venta.costo.toFixed(2)}</td>
          <td>{convertirASoloFecha(venta.fecha)}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>



    <div className='columna-derecha'>
      <div className='fila-superior'>
        <div className="grafica-ganancias">
            <h2>Gráfica de Ganancias</h2>
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
        <h3>Total: {totalDelRango.toFixed(2)} </h3>
      </div>

      <div className='fila-inferior'>
      <h2>Corte</h2>
      <h3>Total del corte: {totalDelCorte.toFixed(2)} </h3>
      <button className='botoneslocos' onClick={calcularCorte}>Realizar corte</button>
      </div>
    </div>
  </div>
  </div>
);

};



export default Ventas;
