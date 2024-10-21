import './App.css';
import {BrowserRouter as Router, Route, Routes} from "react-router-dom"
import Login from './Components/inicioSesion/login'
import Proveedores from './Components/gestionProveedores/proveedores';
import Ventas from './Components/procesoVenta/ventas';
import Inicio from './Components/inicio/inicio';
import Tipoequipo from './Components/filtrosPrevios/tipoequipo';
import Propocito from './Components/filtrosPrevios/propocito';
import PropocitoSeleccion from './Components/seleccionComponentes/propocitoSeleccion';

function App() {
  return (
    <div className="App">
        <Router>
          <Routes>
            <Route path="/" element={<Login/>} />
            <Route path="proveedores" element={<Proveedores/>} />
            <Route path="Ventas" element={<Ventas/>} />
            <Route path="inicio" element={<Inicio/>} />
            <Route path="tipoequipo" element={<Tipoequipo/>} />
            <Route path="propocito" element={<Propocito/>} />
            <Route path="propocitoSeleccion" element={<PropocitoSeleccion/>} />
            
          </Routes>
        </Router>
    </div>
  );
}

export default App;
