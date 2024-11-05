import React from 'react';
import { useNavigate } from 'react-router-dom';



const Inicio = () => {
    const navigate = useNavigate();

    // Estilos en línea
    const containerStyle = {
        paddingTop: '120px', // espacio para el navbar fijo
    };

    const navbarStyle = {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0.5rem 2rem',
        backgroundColor: '#1e1f2b',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
        zIndex: 1000, // asegura que el navbar esté siempre encima
    };

    const logoImageStyle = {
        width: '90px',
        height: '90px',
        borderRadius: '50%',
    };

    const navButtonsStyle = {
        display: 'flex',
        gap: '1rem',
    };

    const navButtonStyle = {
        color: '#ffffff',
        backgroundColor: 'transparent',
        border: '2px solid #5c6bc0',
        padding: '0.6rem 1.2rem',
        borderRadius: '20px',
        fontSize: '1rem',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease, transform 0.2s ease',
    };

    const navButtonHoverStyle = {
        backgroundColor: '#5c6bc0',
        transform: 'scale(1.05)',
    };

    return (
        <div style={containerStyle}>
            <nav style={navbarStyle}>
                <div className="logo">
                    <img src="/assets/logo.png" alt="Logo" style={logoImageStyle} />
                </div>
                <div style={navButtonsStyle}>
                    <button
                        style={navButtonStyle}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = navButtonHoverStyle.backgroundColor)}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                        onClick={() => navigate('/inicio')}
                    >
                        Inicio
                    </button>
                    <button
                        style={navButtonStyle}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = navButtonHoverStyle.backgroundColor)}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                        onClick={() => navigate('/proveedores')}
                    >
                        Proveedores
                    </button>
                    <button
                        style={navButtonStyle}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = navButtonHoverStyle.backgroundColor)}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                        onClick={() => navigate('/sobre-nosotros')}
                    >
                        Más sobre nosotros
                    </button>
                    <button
                        style={navButtonStyle}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = navButtonHoverStyle.backgroundColor)}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                        onClick={() => navigate('/mi-cuenta')}
                    >
                        Mi cuenta
                    </button>
                </div>
            </nav>
        </div>
    );
};

export default Inicio;
