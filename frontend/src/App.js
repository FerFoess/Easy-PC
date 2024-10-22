import './App.css';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from './Components/inicioSesion/login';
import Proveedores from './Components/gestionProveedores/proveedores';
import Inicio from './Components/inicio/inicio';
import Tipoequipo from './Components/filtrosPrevios/tipoequipo';
import Propocito from './Components/filtrosPrevios/propocito';
import Estadisticas from './Components/estadisticas/index'; // Este es el componente que estás usando para Ventas

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="proveedores" element={<Proveedores />} />
          <Route path="ventas" element={<Estadisticas />} /> {/* Ahora la ruta "ventas" usa el componente Estadisticas */}
          <Route path="inicio" element={<Inicio />} />
          <Route path="tipoequipo" element={<Tipoequipo />} />
          <Route path="propocito" element={<Propocito />} />
          <Route path="estadisticas" element={<Estadisticas />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
