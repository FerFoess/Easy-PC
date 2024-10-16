import React from 'react';
import './css/styles.css';
const Inicio = () => {
    return (
        <div className="inicio-container">
            <nav className="navbar">
            <div className="logo">
    <h1 className="logo-text">Easy-PC</h1>
</div>
                <div className="nav-buttons">
                    <button className="nav-btn">Arma tu pc</button>
                    <button className="nav-btn">Catalogo de componentes</button>
                    <button className="nav-btn">Mas sobre nosotros</button>
                    <button className="nav-btn">Mi cuenta</button>
                </div>
            </nav>
            <div className="content">
                {/* Aquí puedes agregar más información después */}
            </div>
        </div>
    );
};

export default Inicio;
