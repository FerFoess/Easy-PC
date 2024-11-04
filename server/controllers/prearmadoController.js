const Prearmado = require('../models/prearmadoSchema');

// Controlador para obtener todos los prearmados
exports.obtenerPrearmados = async (req, res) => {
  try {
    const prearmados = await Prearmado.find();
    res.status(200).json(prearmados);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener los equipos pre-armados' });
  }
};

// Controlador para obtener un prearmado por su ID
exports.obtenerPrearmadoPorId = async (req, res) => {
  try {
    const prearmado = await Prearmado.findById(req.params.id);
    if (!prearmado) {
      return res.status(404).json({ error: 'Equipo pre-armado no encontrado' });
    }
    res.status(200).json(prearmado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener el equipo pre-armado' });
  }
};

// Controlador para crear un nuevo prearmado
exports.crearPrearmado = async (req, res) => {
  try {
    const { nombre, processor, ram, storage, graphics, price } = req.body;
    const nuevoPrearmado = new Prearmado({
      nombre,
      processor,
      ram,
      storage,
      graphics,
      price
    });
    const prearmadoGuardado = await nuevoPrearmado.save();
    res.status(201).json(prearmadoGuardado);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Error al crear el equipo pre-armado' });
  }
};

// Controlador para actualizar un prearmado existente
exports.actualizarPrearmado = async (req, res) => {
  try {
    const prearmado = await Prearmado.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!prearmado) {
      return res.status(404).json({ error: 'Equipo pre-armado no encontrado' });
    }
    res.status(200).json(prearmado);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Error al actualizar el equipo pre-armado' });
  }
};

// Controlador para eliminar un prearmado por su ID
exports.eliminarPrearmado = async (req, res) => {
  try {
    const prearmadoEliminado = await Prearmado.findByIdAndDelete(req.params.id);
    if (!prearmadoEliminado) {
      return res.status(404).json({ error: 'Equipo pre-armado no encontrado' });
    }
    res.status(200).json({ message: 'Equipo pre-armado eliminado' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar el equipo pre-armado' });
  }
};
