// controllers/optionsController.js
const Option = require('../models/optionSchema');

// Crear una nueva opción
const createOption = async (req, res) => {
  const { name, purpose } = req.body;
  if (!name || !purpose) {
    return res.status(400).json({ message: 'Nombre y propósito son obligatorios.' });
  }
  try {
    const newOption = new Option({ name, purpose });
    await newOption.save();
    res.status(201).json(newOption);
  } catch (error) {
    res.status(400).json({ message: 'Error al crear opción', error });
  }
};

// Obtener todas las opciones
const getOptions = async (req, res) => {
  try {
    const options = await Option.find();
    res.status(200).json(options);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener opciones', error });
  }
};

// Obtener una opción por ID
const getOptionById = async (req, res) => {
  const { id } = req.params;
  try {
    const option = await Option.findById(id);
    if (!option) {
      return res.status(404).json({ message: 'Opción no encontrada' });
    }
    res.status(200).json(option);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener opción', error });
  }
};

// Actualizar una opción por ID
const updateOption = async (req, res) => {
  const { id } = req.params;
  const { name, purpose } = req.body;
  if (!name || !purpose) {
    return res.status(400).json({ message: 'Nombre y propósito son obligatorios.' });
  }
  try {
    const updatedOption = await Option.findByIdAndUpdate(id, { name, purpose }, { new: true });
    if (!updatedOption) {
      return res.status(404).json({ message: 'Opción no encontrada' });
    }
    res.status(200).json(updatedOption);
  } catch (error) {
    res.status(400).json({ message: 'Error al actualizar opción', error });
  }
};

// Eliminar una opción por ID
const deleteOption = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedOption = await Option.findByIdAndDelete(id);
    if (!deletedOption) {
      return res.status(404).json({ message: 'Opción no encontrada' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar opción', error });
  }
};

// Obtener opciones por propósito
const getOptionsByPurpose = async (req, res) => {
  const { purpose } = req.params; // Obtiene el propósito de los parámetros
  try {
    const options = await Option.find({ purpose }); // Filtra las opciones por propósito
    if (options.length === 0) {
      return res.status(404).json({ message: 'No se encontraron opciones para el propósito dado.' });
    }
    res.status(200).json(options);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener opciones por propósito', error });
  }
};


module.exports = {
  createOption,
  getOptions,
  getOptionById,
  updateOption,
  deleteOption,
  getOptionsByPurpose,
};



