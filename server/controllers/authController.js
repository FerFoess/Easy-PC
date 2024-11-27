const mediador = require('../services/index'); // Cargar el mediador global

// Controlador para registrar un usuario
exports.registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, age, password } = req.body;

    // Usar el mediador para manejar el registro
    const result = await mediador.notificar('authService', 'registerUser', {
      firstName,
      lastName,
      email,
      phone,
      age,
      password,
    });

    res.status(201).json(result);
  } catch (error) {
    console.error('Error al registrar el usuario:', error);
    res.status(500).json({ message: 'Hubo un problema al registrar el usuario.' });
  }
};

exports.loginUser = async (req, res) => {

  try {
    const { username, password } = req.body;
    console.log('Datos recibidos:', { username, password });

    // Usar el mediador para manejar el inicio de sesión
    const result = await mediador.notificar('authService', 'iniciarSesion', { username, password });

    // Verificar si el resultado es válido
    if (result && result.token) {
      console.log('Resultado del login:', result);
      return res.status(200).json(result);  // Devuelve la respuesta adecuada
    } else {
      return res.status(400).json({ message: 'Error en el inicio de sesión' });
    }
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    return res.status(500).json({ message: 'Error al iniciar sesión' });
  }
};


// Controlador para enviar la confirmación de pago
exports.sendPurchaseConfirmation = async (req, res) => {
  try {
    const { email, amount } = req.body;

    // Usar el mediador para manejar el envío de confirmación
    const result = await mediador.notificar('authService', 'enviarConfirmacionCompra', {
      email,
      amount,
    });

    res.status(200).json(result);
  } catch (error) {
    console.error('Error al enviar el correo:', error);
    res.status(500).json({ message: 'Error al enviar el correo' });
  }
};

// Controlador para enviar la solicitud de surtir
exports.enviarSolicitudSurtir = async (req, res) => {
  try {
    // Desestructuramos los datos del cuerpo de la solicitud
    const {id, nombre, categoria, cantidad, correoProveedor } = req.body;

    // Validar los datos recibidos
    if (!nombre || !categoria || !cantidad || !correoProveedor) {
      return res.status(400).json({ message: "Faltan datos obligatorios" });
    }

    // Usar el mediador para manejar el envío de la solicitud de surtir
    // Este podría ser un ejemplo de cómo podrías usar el mediador
    const result = await mediador.notificar('almacenService', 'surtirComponente', {
      id,
      nombre,
      categoria,
      cantidad,
      correoProveedor
    });

    // Enviar una respuesta exitosa
    res.status(200).json({ message: 'Solicitud de surtido enviada correctamente', data: result });
  } catch (error) {
    console.error('Error al enviar la solicitud de surtir:', error);
    res.status(500).json({ message: 'Hubo un error al enviar la solicitud de surtir' });
  }
};

// Controlador para verificar si el stock está en cero
exports.verificarStock = async (req, res) => {
  try {
    const { id } = req.body;  // Obtener el ID del componente

    // Usar el mediador para verificar el stock
    const result = await mediador.notificar('almacenService', 'verificarStock', { id });

    // Verificar si el stock está en cero
    if (result.stock === 0) {
      return res.status(200).json({ necesitaConfirmacion: true });
    }

    return res.status(200).json({ mensaje: "Stock disponible", necesitaConfirmacion: false });

  } catch (error) {
    console.error("Error al verificar el stock:", error);
    return res.status(500).json({ mensaje: 'Error al verificar el stock' });
  }
};

