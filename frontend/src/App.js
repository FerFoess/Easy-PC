import './App.css';
import {BrowserRouter as Router, Route, Routes} from "react-router-dom"
import Login from './Components/inicioSesion/login'
import Proveedores from './Components/gestionProveedores/proveedores';
import Ventas from './Components/procesoVenta/ventas';
import Inicio from './Components/inicio/inicio';
import Logs from './Components/gestionProveedores/logs'

function App() {
  return (
    <div className="App">
        <Router>
          <Routes>
            <Route path="/" element={<Login/>} />
            <Route path="proveedores" element={<Proveedores/>} />
            <Route path="Ventas" element={<Ventas/>} />
            <Route path="inicio" element={<Inicio/>} />
            <Route path="logs" element={<Logs/>} />
          </Routes>
        </Router>
    </div>
  );
}

export default App;
