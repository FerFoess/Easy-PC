import React from 'react';
import './css/styles.css';
const Inicio = () => {
    return (
        <div className="inicio-container">
            <nav className="navbar">
            <div className="logo">
            <img src='src/assets/logo.png' alt="Logo" className="logo-image" />
                </div>

                <div className="nav-buttons">
                    <button className="nav-btn">P1</button>
                    <button className="nav-btn">P2</button>
                    <button className="nav-btn">P3</button>
                    <button className="nav-btn">P4</button>
                </div>
            </nav>
            <div className="content">
                {/* Aquí puedes agregar más información después */}
            </div>
        </div>
    );
};

export default Inicio;
