const Alerta = require('../models/alerta');

// Crear una nueva alerta
const crearAlerta = async (datosAlerta) => {
  try {
    // Asegúrate de que la fecha esté en el formato correcto
    if (datosAlerta.fecha) {
      datosAlerta.fecha = new Date(datosAlerta.fecha); // Convertir a objeto Date
    }

    const nuevaAlerta = new Alerta(datosAlerta);
    return await nuevaAlerta.save();
  } catch (error) {
    console.error('Error al guardar la alerta:', error);
    throw error;
  }
};


// Obtener todas las alertas
const obtenerAlertas = async (req, res) => {
  try {
    const alertas = await Alerta.find().sort({ fecha: -1 });
    res.json(alertas);
  } catch (error) {
    console.error('Error al obtener alertas:', error);
    res.status(500).json({ error: 'Error al obtener alertas' });
  }
};

// Obtener alertas por tipo
const obtenerAlertasPorTipo = async (req, res) => {
  try {
    const { tipo } = req.params;
    const alertas = await Alerta.find({ tipo }).sort({ fecha: -1 });
    res.json(alertas);
  } catch (error) {
    console.error('Error al obtener alertas por tipo:', error);
    res.status(500).json({ error: 'Error al obtener alertas por tipo' });
  }
};

// Eliminar una alerta por su ID
const eliminarAlerta = async (req, res) => {
  try {
    const { id } = req.params;
    const alertaEliminada = await Alerta.findByIdAndDelete(id);
    if (alertaEliminada) {
      res.status(200).json({ message: 'Alerta eliminada correctamente' });
    } else {
      res.status(404).json({ error: 'Alerta no encontrada' });
    }
  } catch (error) {
    console.error('Error al eliminar la alerta:', error);
    res.status(500).json({ error: 'Error al eliminar la alerta' });
  }
};

module.exports = { crearAlerta, obtenerAlertas, obtenerAlertasPorTipo, eliminarAlerta };
