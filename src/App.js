import './App.css';
import {BrowserRouter as Router, Route, Routes} from "react-router-dom"
import Login from './Components/inicioSesion/login'
import Proveedores from './Components/gestionProveedores/proveedores';
import Ventas from './Components/procesoVenta/ventas';

function App() {
  return (
    <div className="App">
        <Router>
          <Routes>
            <Route path="/" element={<Login/>} />
            <Route path="proveedores" element={<Proveedores/>} />
            <Route path="Ventas" element={<Ventas/>} />
          </Routes>
        </Router>
    </div>
  );
}

export default App;
