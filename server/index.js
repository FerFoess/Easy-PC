const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');


const app = express();
const PORT = 3002;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Rutas

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
