import './App.css';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from './Components/inicioSesion/login';
import Inicio from './Components/inicio/inicio';
import Tipoequipo from './Components/filtrosPrevios/tipoequipo';
import Propocito from './Components/filtrosPrevios/propocito';
import Estadisticas from './Components/estadisticas/index'; 
import PropocitoSeleccion from './Components/seleccionComponentes/propocitoSeleccion';
import CheckoutForm from './Components/procesoVenta/CheckoutForm';
import CrearCuenta from './Components/controlUsuarios/crearCuenta';
import Prearmados from './Components/seleccionComponentes/prearmados';
import LibreSeleccion from './Components/seleccionComponentes/libreSeleccion';
import DatosEnvio from './Components/procesoVenta/DatosEnvio';
import CarritoCompra from './Components/procesoVenta/carritoCompra';
import Almacen from './Components/almacenamiento/almacenamiento'


function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="inicio" element={<Inicio />} />
          <Route path="tipoequipo" element={<Tipoequipo />} />
          <Route path="propocito" element={<Propocito />} />
          <Route path="estadisticas" element={<Estadisticas />} />
          <Route path="propocitoSeleccion" element={<PropocitoSeleccion/>} />
          <Route path="checkoutForm" element={<CheckoutForm/>} />
          <Route path="crearCuenta" element={<CrearCuenta/>} />
          <Route path="prearmados" element={<Prearmados/>} />
          <Route path="libreSeleccion" element={<LibreSeleccion/>} />
          <Route path="datosEnvio" element={<DatosEnvio/>} />
          <Route path="carritoCompra" element={<CarritoCompra/>} />
          <Route path="almace" element={<Almacen/>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
