const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/User');
const crypto = require('crypto');
const {sendCode} = require ('../Mails/forgetpasswordmessage')

exports.login = async (req, res) => {
  const { usernameOrEmail, contraseña } = req.body;

  try {
    const user = await Usuario.findOne({
      $or: [{ usuario: usernameOrEmail }, { email: usernameOrEmail }],
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

const RandomCode = () => {
  return crypto.randomInt(100000, 999999).toString();
};


exports.SendCode = async (req, res) => {
  const { usernameOrEmail } = req.body;

  try {
    const usuario = await Usuario.findOne({
      $or: [{ usuario: usernameOrEmail }, { email: usernameOrEmail }],
    });

    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const SaveCode = RandomCode();
    const expirationTime = Date.now() + 30 * 60 * 1000; // 30 minutos desde ahora

    usuario.recoveryCode = {
      code: SaveCode,
      expiresAt: expirationTime,
    };

    await usuario.save();
    await sendCode(usuario, SaveCode);

    res.json({ message: 'Código de recuperación enviado', usuario });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Error al solicitar código de recuperación' });
  }
};

exports.ValidateSendCode = async (req, res) => {
  const {id, code} = req.body;

  try{
    const usuario = await Usuario.findById(id);

    if(!usuario){
      return res.status(404).json({message: 'Usuario no encontrado'});
    }

    const { recoveryCode } = usuario;
    if (!recoveryCode || recoveryCode.expiresAt < Date.now()){
      return res.status(400).json({message: 'Codigo de recuperacion expirado o inválido'});
    }

    if(recoveryCode.code !== code){
      return res.status(400).json({message: 'Código de recuperación incorrecto'})
    }

    res.json({message:'Código validado correctamente'});
  }catch(error){
    console.error(error.message);
    res.status(500).json({message: 'Error al validar código de recuperación'})
  }
}

//exports.newPassword =
exports.newPassword = async (req, res) => {
  const { id, newPassword } = req.body;

  try {
    const usuario = await Usuario.findById(id);

    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    usuario.contraseña = hashedPassword;
    usuario.recoveryCode = null; // Limpia el código de recuperación después de usarlo

    await usuario.save();

    res.json({ message: 'Contraseña cambiada exitosamente' });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Error al cambiar la contraseña' });
  }
};

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

exports.getUsers = async (req, res) => {
  try {
    const users = await Usuario.find().populate({
      path: 'tipo',
      populate:{
        path: 'permisos',
      }
    });
    console.log(users)
    res.status(200).json(users);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Error al obtener usuarios' });
  }
};

exports.updateUsuario = async (req, res) => {
  try {
    const usuario = await Usuario.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json(usuario);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.disableUsuario = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await Usuario.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    let status = user.active 
    user.active = !status;
    await user.save();

    res.status(200).json({ message: 'Usuario inhabilitado exitosamente', user });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Error al inhabilitar usuario' });
  }
};