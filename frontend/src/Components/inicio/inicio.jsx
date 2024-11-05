import React from 'react';
import { useNavigate } from 'react-router-dom';
import './css/styles.css';

const Inicio = () => {
    const navigate = useNavigate();

    // Estilos en línea
    const containerStyle = {
        fontFamily: 'Arial, sans-serif',
        color: '#ffffff',
        backgroundColor: '#27293d',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
    };

    const navbarStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0.5rem 2rem',
        backgroundColor: '#1e1f2b',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
        width: '100%',
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

    const contentStyle = {
        padding: '2rem',
        maxWidth: '800px',
        margin: '0 auto',
    };

    const introSectionStyle = {
        textAlign: 'center',
    };

    const ctaButtonsStyle = {
        display: 'flex',
        gap: '1rem',
        justifyContent: 'center',
        marginTop: '1.5rem',
    };

    const ctaButtonStyle = {
        padding: '0.8rem 1.5rem',
        fontSize: '1rem',
        border: 'none',
        borderRadius: '20px',
        color: '#ffffff',
        backgroundColor: '#5c6bc0',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease, transform 0.2s ease',
    };

    const ctaButtonOutlineStyle = {
        backgroundColor: 'transparent',
        border: '2px solid #5c6bc0',
        color: '#5c6bc0',
    };

    const gallerySectionStyle = {
        textAlign: 'center',
        marginTop: '2rem',
    };

    const galleryStyle = {
        display: 'flex',
        gap: '1rem',
        justifyContent: 'center',
        flexWrap: 'wrap',
    };

    const galleryImageStyle = {
        width: '200px',
        height: '150px',
        objectFit: 'cover',
        borderRadius: '10px',
        transition: 'transform 0.3s ease',
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
                        onClick={() => navigate('/Tipoequipo')}
                    >
                        Arma tu pc
                    </button>
                    <button
                        style={navButtonStyle}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = navButtonHoverStyle.backgroundColor)}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                        onClick={() => navigate('/catalogo-componentes')}
                    >
                        Catálogo de componentes
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
                    <button
                        style={navButtonStyle}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = navButtonHoverStyle.backgroundColor)}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'red')}
                        onClick={() => navigate('/login')}
                    >
                        Cerrar Sesión
                    </button>
                </div>
            </nav>

            <div style={contentStyle}>
                <section style={introSectionStyle}>
                    <h2>Bienvenido a Easy PC</h2>
                    <p>En Easy PC, puedes crear la computadora de tus sueños seleccionando cada componente que necesites. Nuestra herramienta de armado te permite elegir entre una gran variedad de procesadores, tarjetas gráficas, fuentes de poder, memorias y más, para que puedas construir una PC personalizada que se adapte a tus necesidades, ya sea para gaming, edición de video, programación o uso diario.</p>
                    <div style={ctaButtonsStyle}>
                        <button
                            style={ctaButtonStyle}
                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#7986cb')}
                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#5c6bc0')}
                            onClick={() => navigate('/Tipoequipo')}
                        >
                            Comienza a armar tu PC
                        </button>
                        <button
                            style={{ ...ctaButtonStyle, ...ctaButtonOutlineStyle }}
                            onMouseEnter={(e) => (e.currentTarget.style.color = '#7986cb')}
                            onMouseLeave={(e) => (e.currentTarget.style.color = '#5c6bc0')}
                            onClick={() => navigate('/catalogo-componentes')}
                        >
                            Explorar el catálogo
                        </button>
                    </div>
                </section>

                <section style={gallerySectionStyle}>
                    <h3>Inspiración para tu próxima PC</h3>
                    <div style={galleryStyle}>
                        <img src="https://www.adslzone.net/app/uploads-adslzone.net/2017/05/cuanto-cuesta-el-ordenador-de-elrubius-por-piezas.jpg" alt="PC de alto rendimiento" style={galleryImageStyle} />
                        <img src="https://vrlatech.com/wp-content/uploads/2021/12/Phoenix-4080-Main.jpg.webp" alt="PC para gaming" style={galleryImageStyle} />
                        <img src="https://m.media-amazon.com/images/I/612l8fBazlL._AC_SL1500_.jpg" alt="PC compacta y eficiente" style={galleryImageStyle} />
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Inicio;
