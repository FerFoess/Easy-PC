// controllers/authController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/usersSchema');

// nodemailerConfig.js
const nodemailer = require('nodemailer');


// Función para registrar un nuevo usuario
const registerUser = async (req, res) => {
  const { firstName, lastName,email, phone, age, password,  } = req.body; // Asegúrate de incluir email en tu solicitud

  if (!firstName || !lastName || !password || !email) {
    return res.status(400).json({ message: 'Faltan campos requeridos.' });
  }

  try {
    const username = `${firstName.toLowerCase()}.${lastName.toLowerCase()}`;
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      firstName,
      lastName,
      phone,
      age,
      username,
      password: hashedPassword,
      email, 
    });

    await newUser.save();

    // Enviar correo electrónico al usuario
    const mailOptions = {
      from: 'easypc.companymx@gmail.com', // Dirección de correo electrónico desde la cual se envía el mensaje
      to: email, // Dirección de correo electrónico del destinatario
      subject: 'Registro Exitoso',
      text: `¡Hola ${firstName}! Tu nombre de usuario es: ${username}.`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error al enviar el correo:', error);
      } else {
        console.log('Correo enviado:', info.response);
      }
    });

    res.status(201).json({ message: 'Usuario registrado exitosamente.', username });
  } catch (error) {
    console.error('Error al registrar el usuario:', error);
    res.status(500).json({ message: 'Hubo un problema al registrar el usuario.' });
  }
};


const loginUser = async (req, res) => {
    
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    
    if (!user) {
      return res.status(400).json({ message: 'Usuario no encontrado' });
    }
    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log(isPasswordValid);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Contraseña incorrecta' });
    }
    const token = jwt.sign(
      { userId: user._id, role: user.role, firstName: user.firstName, lastName: user.lastName, email: user.email, phone: user.phone },
      'bkkcc6',
      { expiresIn: '1h' }
    );


    res.status(200).json({ message: 'Inicio de sesión exitoso', token });
  } catch (error) {
    res.status(500).json({ message: 'Error al iniciar sesión', error });
  }
};

module.exports = { registerUser, loginUser };
