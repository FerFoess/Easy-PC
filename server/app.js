var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');


// Otras configuraciones del servidor...


var indexRouter = require('./routes/index');
var almacenRouter = require('./routes/almacenRoutes');
var ventasRouter = require('./routes/ventasRoutes');
var auth = require('./routes/auth');
const paymentRoutes = require('./routes/paymentRoutes');
const corteRoutes = require('./routes/corteVentasRoutes');
const componentsRoutes = require('./routes/componentsRoutes');
const almacenamientoRoutes = require('./routes/almacenamientoRoutes');
const cartRoutes = require ('./routes/cartRoutes');
const prearmadoRoutes = require ('./routes/prearmadoRoutes')
const alertaRoutes = require('./routes/alertaRouters');



var app = express();

let dotenv = require('dotenv');
dotenv.config();

let mongo = require('./config/dbconfig'); // Conexión a MongoDB

var app = express();

// view engine setup - solo si estás usando vistas
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middlewares
app.use(cors()); // Habilitar CORS para todas las rutas
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store');
  next();
});


// Asegúrate de agregar esto para servir las imágenes
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Rutas
app.use('/', indexRouter);
app.use('/catego', almacenRouter);
app.use('/auth', auth);
app.use('/ventas', ventasRouter);
app.use('/cortes', corteRoutes);
app.use('/components', componentsRoutes);
app.use('/payments', paymentRoutes);
app.use('/prearmado', prearmadoRoutes);
app.use('/cart', cartRoutes);
app.use('/alertas', alertaRoutes);


// Manejo de errores 404
app.use(function(req, res, next) {
  next(createError(404));
});

// Manejo de errores generales
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.json({ message: 'Error', error: res.locals.error });
});

module.exports = app;
