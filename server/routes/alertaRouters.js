const express = require('express');
const router = express.Router();
const { crearAlerta, obtenerAlertas, obtenerAlertasPorTipo, eliminarAlerta } = require('../controllers/alertaController');

// Ruta para obtener todas las alertas
router.get('/', obtenerAlertas);

// Ruta para obtener alertas por tipo
router.get('/:tipo', obtenerAlertasPorTipo);

// Ruta para crear una nueva alerta
router.post('/guardar', async (req, res) => {
  try {
    const nuevaAlerta = await crearAlerta(req.body);
    res.status(201).json(nuevaAlerta);
  } catch (error) {
    res.status(500).json({ error: 'Error al guardar la alerta' });
  }
});

// Ruta para eliminar una alerta por ID
router.delete('/:id', eliminarAlerta);

module.exports = router;
