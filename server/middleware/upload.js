// middleware/upload.js
const multer = require('multer');
const path = require('path');

// Configuración de Multer para manejar las cargas de archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Directorio donde se guardarán las imágenes
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Agregar un prefijo con la fecha para evitar nombres duplicados
  }
});

// Crear una instancia de multer
const upload = multer({ storage });

// Exportar el middleware
module.exports = upload;
