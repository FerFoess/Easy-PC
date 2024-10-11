import logo from './logo.svg';
import './App.css';
import Login from "./Components/login"
import Proveedores from "./Components/gestionProveedores"

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <Router path="/" element={<Login/>} />
        <Router path="proveedores" elemtent={<Proveedores/>} />
      </AuthProvider>
    </div>
  );
}

export default App;
