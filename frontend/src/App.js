import './App.css';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from './Components/inicioSesion/login';
import Proveedores from './Components/gestionProveedores/proveedores';
import Inicio from './Components/inicio/inicio';
import Tipoequipo from './Components/filtrosPrevios/tipoequipo';
import Propocito from './Components/filtrosPrevios/propocito';
import Estadisticas from './Components/estadisticas/index'; 
import PropocitoSeleccion from './Components/seleccionComponentes/propocitoSeleccion';
import CheckoutForm from './Components/procesoVenta/CheckoutForm';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="proveedores" element={<Proveedores />} />
          <Route path="ventas" element={<Estadisticas />} /> 
          <Route path="inicio" element={<Inicio />} />
          <Route path="tipoequipo" element={<Tipoequipo />} />
          <Route path="propocito" element={<Propocito />} />
          <Route path="estadisticas" element={<Estadisticas />} />
          <Route path="propocitoSeleccion" element={<PropocitoSeleccion/>} />
          <Route path="checkoutForm" element={<CheckoutForm/>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
