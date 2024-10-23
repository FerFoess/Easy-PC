// controllers/authController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/usersSchema');

// Controlador para registrar un usuario
const registerUser = async (req, res) => {
  try {
    const { password, role, firstName, lastName, address, phone, age } = req.body;

    // Generar el username concatenando firstName y lastName
    const username = `${firstName}${lastName}`.toLowerCase().replace(/\s+/g, '');

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear un nuevo usuario
    const newUser = new User({
      username,
      password: hashedPassword,
      role,
      firstName,
      lastName,
      address,
      phone,
      age,
    });

    await newUser.save();
    res.status(201).json({ message: 'Usuario creado exitosamente', username });
  } catch (error) {
    res.status(500).json({ message: 'Error al registrar usuario', error });
  }
};

const loginUser = async (req, res) => {
    
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    
    if (!user) {
      return res.status(400).json({ message: 'Usuario no encontrado' });
    }
    console.log(user.password);
    console.log(password);
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log(isPasswordValid);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Contraseña incorrecta' });
    }
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      'bkkcc6',
      { expiresIn: '1h' }
    );

    res.status(200).json({ message: 'Inicio de sesión exitoso', token });
  } catch (error) {
    res.status(500).json({ message: 'Error al iniciar sesión', error });
  }
};

module.exports = { registerUser, loginUser };
