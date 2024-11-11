var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors'); // Importa el middleware cors

var indexRouter = require('./routes/index');
var productosRouter = require('./routes/productosRoutes');
var categoriasRouter = require('./routes/categoriasRoutes');
var ventasRouter = require('./routes/ventasRoutes')
var auth = require('./routes/auth');

const paymentRoutes = require('./routes/paymentRoutes');
const corteRoutes = require('./routes/corteVentasRoutes');
const componentsRoutes = require('./routes/componentsRoutes');
const prearmadoRoutes = require('./routes/prearmadoRoutes')
const cartRoutes = require ('./routes/cartRoutes');

var app = express();

let dotenv = require('dotenv');
dotenv.config();

let mongo = require('./config/dbconfig');

// Si no estás usando un motor de plantillas, elimina esta sección
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(cors()); // Usa el middleware cors una vez
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store');
  next();
});


app.use('/cart', cartRoutes)
app.use('/components', componentsRoutes)
app.use('/payments', paymentRoutes);
app.use('/', indexRouter);
app.use('/produ', productosRouter);
app.use('/catego', categoriasRouter);
app.use('/auth', auth);
app.use('/ventas', ventasRouter);
app.use('/cortes', corteRoutes);
app.use('/cortes', corteRoutes);
app.use('/prearmado', prearmadoRoutes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // En vez de renderizar una vista, puedes enviar un JSON de error
  res.status(err.status || 500);
  res.json({ message: 'Error', error: res.locals.error });
});

module.exports = app;
