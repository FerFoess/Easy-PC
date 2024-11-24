const MainMediator = require('./MainMediator');
const CarritoService = require('./CarritoService');
const AlmacenService = require('./almacenService');
const AuthService = require('./authServicio');
const PaymentService = require('./pagosService');
const VentasService = require('./ventasService');
const CartMediator = require('./Mediators/CartMediator');  // Asegúrate de importar el CartMediator
const InventoryMediator = require('./Mediators/InventoryMediator'); // Importa el InventoryMediator
const AuthMediator = require('./Mediators/AuthMediator');  // Importa el AuthMediator
const PaymentMediator = require('./Mediators/PaymentMediator');  // Importa el PaymentMediator
const SalesMediator = require('./Mediators/SalesMediator');  // Importa el SalesMediator

// Crear instancias de los servicios
const carritoService = new CarritoService();
const almacenService = new AlmacenService();
const authService = new AuthService();
const paymentService = new PaymentService();
const ventasService = new VentasService();

// Crear instancias de los mediadores y pasar los servicios correspondientes
const cartMediator = new CartMediator(carritoService);
const inventoryMediator = new InventoryMediator(almacenService);
const authMediator = new AuthMediator(authService);
const paymentMediator = new PaymentMediator(paymentService);
const salesMediator = new SalesMediator(ventasService);

// Crear instancia del MainMediator y pasar los mediadores como parámetros
const mediador = new MainMediator({
  cartMediator: cartMediator,
  inventoryMediator: inventoryMediator,
  authMediator: authMediator,
  paymentMediator: paymentMediator,
  salesMediator: salesMediator,
});

module.exports = mediador;
