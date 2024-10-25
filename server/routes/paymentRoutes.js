const express = require('express');
const { createPaymentIntent } = require('../controllers/paymentController');
const router = express.Router();

// Ruta para crear el Payment Intent
router.post('/create-payment-intent', createPaymentIntent);

module.exports = router;
