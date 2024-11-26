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
    const result = await mediador.notificar('authService', 'loginUser', { username, password });
    console.log('Resultado del mediador en el controlador:', result);  // Verifica lo que recibe el controlador

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
    const result = await mediador.notificar('authService', 'sendPurchaseConfirmation', {
      email,
      amount,
    });

    res.status(200).json(result);
  } catch (error) {
    console.error('Error al enviar el correo:', error);
    res.status(500).json({ message: 'Error al enviar el correo' });
  }
};
