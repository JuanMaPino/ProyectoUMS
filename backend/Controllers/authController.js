const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/User');

exports.register = async (req, res) => {
  const { usuario, email, contraseña, tipo } = req.body;

  try {
    let user = await Usuario.findOne({ usuario });
    if (user) {
      return res.status(400).json({ message: 'El username ya está en uso' });
    }
    user = await Usuario.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'El email ya está en uso' });
    }

    const hashedPassword = await bcrypt.hash(contraseña, 12);
    user = new Usuario({ usuario, email, contraseña: hashedPassword, tipo });
    await user.save();

    res.status(201).json({ message: 'Usuario registrado exitosamente', user });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Error al registrar usuario' });
  }
};

exports.login = async (req, res) => {
  const { usernameOrEmail, contraseña } = req.body;

  try {
    const user = await Usuario.findOne({ 
      $or: [{ usuario: usernameOrEmail}, { email: usernameOrEmail }],
     });

    if (!user) {
      return res.status(404).json({ message: 'Usuario o contraseña incorrectos' });
    }

    if (!user.active) {
      return res.status(404).json({ message: 'Usuario inactivo' });
    }

    const isMatch = await bcrypt.compare(contraseña, user.contraseña);
    if (!isMatch) {
      return res.status(400).json({ message: 'Usuario o contraseña incorrectos' });
    }

    const payload = {
      usuario: {
          id: user.id,
          usuario: user.usuario,
          email: user.email,
          tipo: user.tipo,
      }
  };

  const token = jwt.sign(payload, process.env.JWT_CLAVE, { expiresIn: '2h' });

  res.cookie('token', token, {
      httpOnly: false,
      maxAge: 7200000, // 2 hours
      sameSite: 'Lax',
      secure: true,
  });

    res.status(200).json({ message: 'Inicio de sesión exitoso' });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Error al iniciar sesión', error });
  }
};

exports.logout = (req, res) => {
  res.clearCookie('token', {
      httpOnly: false,
      secure: true,
      sameSite: 'Lax'
  });

  res.json({ message: 'Sesión cerrada exitosamente' });
};