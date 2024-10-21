import React from 'react';
import { useNavigate } from 'react-router-dom';
import './css/styles.css';

const Inicio = () => {
    const navigate = useNavigate();

    return (
        <div className="inicio-container">
            <nav className="navbar">
                <div className="logo">
                    <h1 className="logo-text">Easy-PC</h1>
                </div>
                <div className="nav-buttons">
                    <button className="nav-btn" onClick={() => navigate('/Tipoequipo')}>Arma tu pc</button>
                    <button className="nav-btn" onClick={() => navigate('/catalogo-componentes')}>Catálogo de componentes</button>
                    <button className="nav-btn" onClick={() => navigate('/sobre-nosotros')}>Más sobre nosotros</button>
                    <button className="nav-btn" onClick={() => navigate('/mi-cuenta')}>Mi cuenta</button>
                </div>
            </nav>
            <div className="content">
                {/* Aquí puedes agregar más información después */}
            </div>
        </div>
    );
};

export default Inicio;
