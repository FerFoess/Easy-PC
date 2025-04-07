const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const User = require("../models/usersSchema");
const Order = require("../models/orderSchema");

class AuthService {
  constructor(mediador = null) {
    this.mediador = mediador;

    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "easypc.companymx@gmail.com",
        pass: "ceao hocb dxri cnsr",
      },
    });
  }

  // Función para registrar un nuevo usuario
  async registerUser(firstName, lastName, email, phone, age, password) {
    if (!firstName || !lastName || !password || !email) {
      throw new Error("Faltan campos requeridos.");
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
        from: "easypc.companymx@gmail.com",
        to: email,
        subject: "Registro Exitoso",
        text: `¡Hola ${firstName}! Tu nombre de usuario es: " ${username} " .`,
      };

      this.transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Error al enviar el correo:", error);
        } else {
          console.log("Correo enviado:", info.response);
        }
      });

      return { message: "Usuario registrado exitosamente.", username };
    } catch (error) {
      console.error("Error al registrar el usuario:", error);
      throw new Error("Hubo un problema al registrar el usuario.");
    }
  }

  async loginUser(username, password) {
    console.log("Intentando iniciar sesión con:", { username, password }); // Log inicial
    try {
      const user = await User.findOne({ username });
      if (!user) {
        throw new Error("Usuario no encontrado");
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new Error("Contraseña incorrecta");
      }

      const token = jwt.sign(
        {
          userId: user._id,
          role: user.role,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
        },
        "bkkcc6",
        { expiresIn: "1h" }
      );

      const result = { message: "Inicio de sesión exitoso", token };
      console.log("Resultado del servicio:", result); // Log de resultado del servicio
      return result;
    } catch (error) {
      console.error("Error en el servicio de login:", error.message);
      throw new Error("Error al iniciar sesión: " + error.message);
    }
  }

  // Función para enviar la confirmación de compra por correo
  async sendPurchaseConfirmation(email, amount) {
    const mailOptions = {
      from: "easypc.companymx@gmail.com",
      to: email,
      subject: "Confirmación de Compra",
      text: `¡Gracias por tu compra! El monto total es: $${(amount / 1).toFixed(
        2
      )} MXN. Tus datos de envío han sido recibidos.`,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log("Correo enviado a:", email);
      return { message: "Correo enviado exitosamente" };
    } catch (error) {
      console.error("Error al enviar el correo:", error);
      throw new Error("Error al enviar el correo");
    }
  }

  // Función para enviar la solicitud de surtido de componentes por correo
  async surtirComponente(id, nombre, categoria, cantidad, correoProveedor) {
    const mailOptions = {
      from: "easypc.companymx@gmail.com",
      to: correoProveedor,
      subject: `Solicitud de Surtido: ${nombre}`,
      text: `Detalles de la solicitud de surtido:
      
  Producto: ${nombre}
  Categoría: ${categoria}
  Cantidad solicitada: ${cantidad}
  
  Por favor, confirme la disponibilidad y el tiempo de entrega para este componente.
  
  Gracias por su atención.`,
    };
  
    try {
      // Guardar la orden en la base de datos
      const nuevaOrden = new Order({
        productoId: id,
        nombre,
        categoria,
        cantidad,
        correoProveedor,
      });
      await nuevaOrden.save();
  
      // Enviar el correo con la solicitud
      await this.transporter.sendMail(mailOptions);
  
      // Actualizar el estado del componente
      await this.actualizarEstadoComponente(id);
  
      return {
        message: "Solicitud enviada, estado actualizado y orden registrada",
      };
    } catch (error) {
      console.error("Error al procesar la solicitud de surtido:", error);
      throw new Error(
        "Error al enviar la solicitud de surtido o actualizar el estado"
      );
    }
  }
  

  // Función para actualizar el estado del componente en la base de datos
  async actualizarEstadoComponente(id) {
    try {
      const Components = require("../models/components"); // Importar el modelo del componente
      const componente = await Components.findById(id);

      if (!componente) {
        throw new Error("Componente no encontrado");
      }

      // Actualizar el estado del componente
      componente.estado = "En proceso de resurtido"; // Cambia esto según el estado deseado
      await componente.save();
      return { message: "Estado actualizado exitosamente" };
    } catch (error) {
      console.error("Error al actualizar el estado del componente:", error);
      throw new Error("Error al actualizar el estado del componente");
    }
  }

  // Verificación de stock
  async verificarStock(id) {
    try {
      const componente = await Components.findById(id);
      if (!componente) {
        throw new Error("Componente no encontrado");
      }

      // Verificar si el stock está en 0
      if (componente.stock === 0) {
        return { stock: 0};
      }

      return { stock: componente.stock, mensaje: "Stock disponible" };
    } catch (error) {
      console.error("Error al verificar el stock:", error);
      throw new Error("Error al verificar el stock");
    }
  }
}

module.exports = AuthService;
