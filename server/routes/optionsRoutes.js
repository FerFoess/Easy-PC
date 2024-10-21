// routes/optionsRoutes.js
const express = require('express');
const {
  createOption,
  getOptions,
  getOptionById,
  updateOption,
  deleteOption,
  getOptionsByPurpose,
} = require('../controllers/optionsController');

const router = express.Router();

router.post('/', createOption);
router.get('/', getOptions);
router.get('/:id', getOptionById);
router.put('/:id', updateOption);
router.delete('/:id', deleteOption);
router.get('/purpose/:purpose', getOptionsByPurpose); // Asegúrate de que la ruta sea diferente para evitar conflictos

module.exports = router;
