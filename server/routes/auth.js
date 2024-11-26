const express = require('express');
const { registerUser, loginUser, sendPurchaseConfirmation } = require('../controllers/authController');
const router = express.Router();

// Ruta para registrar un usuario
router.post('/register', registerUser);

// Ruta para iniciar sesión
router.post('/login', loginUser);

// Ruta para enviar la confirmación de pago
router.post('/send-payment-confirmation', sendPurchaseConfirmation);

module.exports = router;
