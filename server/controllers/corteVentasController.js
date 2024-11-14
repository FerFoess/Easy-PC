const CorteVentas = require('../models/corteVentasSchema');

// Controlador para obtener todos los cortes de ventas
exports.obtenerCortesVentas = async (req, res) => {
  try {
    const cortes = await CorteVentas.find();
    res.status(200).json(cortes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener los cortes de ventas' });
  }
};

// Controlador para obtener un corte de ventas por su ID (idCorte)
exports.obtenerCortePorId = async (req, res) => {
  try {
    const corte = await CorteVentas.findOne({ idCorte: req.params.idCorte });
    if (!corte) {
      return res.status(404).json({ error: 'Corte de ventas no encontrado' });
    }
    res.status(200).json(corte);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener el corte de ventas' });
  }
};

exports.crearCorteVenta = async (req, res) => {
  try {
    const { fecha, total } = req.body;

    // Validar que la fecha tenga el formato YYYY-MM-DD
    const fechaRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!fechaRegex.test(fecha)) {
      return res.status(400).json({ error: 'Formato de fecha inválido. Debe ser YYYY-MM-DD.' });
    }

    // Buscar si ya existe un corte con la misma fecha
    const corteExistente = await CorteVentas.findOne({ fecha: new Date(fecha).toISOString().split('T')[0] });

    if (corteExistente) {
      // Si ya existe un corte, retornar error
      return res.status(409).json({ error: 'El corte ya se ha realizado para esta fecha.' });
    }

    // Si no existe, proceder a crear un nuevo corte
    const nuevoCorte = new CorteVentas({
      fecha: new Date(fecha).toISOString().split('T')[0], // Asegurarnos de que la fecha se guarde en formato correcto
      total
    });

    const corteGuardado = await nuevoCorte.save();
    return res.status(201).json(corteGuardado);

  } catch (error) {
    console.error('Error en crearCorteVenta:', error);
    res.status(500).json({ error: `Error al crear el corte de ventas: ${error.message}` });
  }
};


  

// Controlador para actualizar un corte de ventas existente
exports.actualizarCorteVenta = async (req, res) => {
  try {
    const corte = await CorteVentas.findOneAndUpdate(
      { idCorte: req.params.idCorte },
      req.body,
      { new: true }
    );
    if (!corte) {
      return res.status(404).json({ error: 'Corte de ventas no encontrado' });
    }
    res.status(200).json(corte);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Error al actualizar el corte de ventas' });
  }
};

// Controlador para eliminar un corte de ventas por su ID (idCorte)
exports.eliminarCorteVenta = async (req, res) => {
  try {
    const corteEliminado = await CorteVentas.findOneAndDelete({ idCorte: req.params.idCorte });
    if (!corteEliminado) {
      return res.status(404).json({ error: 'Corte de ventas no encontrado' });
    }
    res.status(200).json({ message: 'Corte de ventas eliminado' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar el corte de ventas' });
  }
};
