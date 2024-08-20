import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import logo from "../assets/img/logoums.png";
import '../assets/css/Register.css';
import { RiEyeCloseLine, RiEyeLine, RiLockLine } from 'react-icons/ri';

function Register() {
  const { signup, errors, loading } = useAuth(); // Asegurarse de que loading es una variable booleana
  const [formData, setFormData] = useState({
    usuario: '',
    email: '',
    contraseña: '',
    confirmarContraseña: '',
    tipo: 'Donador',
  });
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleTogglePasswordVisibility = () => {
    setPasswordVisible(prev => !prev);
  }

  const [localErrors, setLocalErrors] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (errors.length > 0) {
      setLocalErrors(errors);
      const timer = setTimeout(() => {
        setLocalErrors([]);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [errors]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const validatePassword = (contraseña) => {
    return contraseña.length >= 6; // Ejemplo de validación, mínimo 6 caracteres
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { usuario, email, contraseña, confirmarContraseña, tipo } = formData;

    if (!validateEmail(email)) {
      setLocalErrors(["Correo electrónico no válido"]);
      return;
    }

    if (!validatePassword(contraseña)) {
      setLocalErrors(["La contraseña debe tener al menos 6 caracteres"]);
      return;
    }

    if (contraseña !== confirmarContraseña) {
      setLocalErrors(["Las contraseñas no coinciden"]);
      return;
    }

    try {
      await signup({usuario, email, contraseña, tipo});
      navigate('/login');
    } catch (error) {
      console.error('Error al registrar', error);
    }
  };

  return (
    <div className="register-body">
      <div className="register-box">
        <img src={logo} className="avatar" alt="Avatar" />
        <h1>Registro</h1>
        <form onSubmit={handleSubmit}>
          <label htmlFor="usuario">Nombre</label>
          <input type="text" name="usuario" placeholder="Ingrese su nombre" onChange={handleChange} value={formData.usuario} required />

          <label htmlFor="email">Correo Electrónico</label>
          <input type="email" name="email" placeholder="Ingrese su correo electrónico" onChange={handleChange} value={formData.email} required />
          
          <label htmlFor="contraseña">Contraseña
          <button
              type="button"
              onClick={handleTogglePasswordVisibility}
              className='absolute inset-y-a right-8 translate-y-10 '
            >
              {passwordVisible ? <RiEyeCloseLine/> :<RiEyeLine/>}   
            </button>
          </label>
          <input type={passwordVisible ? "text" : "password"}
            name="contraseña"
            placeholder="Ingrese su contraseña" 
            onChange={handleChange} 
            value={formData.contraseña} required
            icon={RiLockLine} />
          <label htmlFor="confirmarContraseña">Confirmar Contraseña</label>
          <input type={passwordVisible ? "text" : "password"} name="confirmarContraseña" placeholder="Confirme su contraseña" onChange={handleChange} value={formData.confirmarContraseña} required />
          <label htmlFor="tipo">Tipo</label>
          <select id="tipo" name="tipo" onChange={handleChange} value={formData.tipo} required>
            <option value="Donador">Donador</option>
            <option value="Beneficiario">Beneficiario</option>
          </select>
          <input type="submit" value="Registrar" disabled={loading} />
          {localErrors.length > 0 && <p>Error: {localErrors.join(', ')}</p>}
          <a href="/login">¿Ya tienes cuenta?</a>
        </form>
      </div>
    </div>
  );
}

export default Register;
