const Mediador = require('./Mediator');
const CarritoService = require('./CarritoService');
const AlmacenService = require('./almacenService');
const AuthService = require('./authServicio');
const PaymentService = require('./pagosService');
const VentasService = require('./ventasService');

// Crear instancia del Mediador
const mediador = new Mediador();

// Registrar servicios
mediador.registrarServicio('carritoService', new CarritoService());
mediador.registrarServicio('almacenService', new AlmacenService());
mediador.registrarServicio('authService', new AuthService());
mediador.registrarServicio('paymentService', new PaymentService());
mediador.registrarServicio('ventasService', new VentasService());

module.exports = mediador;
