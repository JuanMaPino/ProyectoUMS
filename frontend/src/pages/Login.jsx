import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from "../assets/img/logoums.png"; // Importa la imagen utilizando import

import '../assets/css/Login.css';

function Login() {
  const { signin, errors, loading, user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ usernameOrEmail: '', contraseña: '' });

  useEffect(() => {
    document.body.classList.add('login-body');
    return () => {
      document.body.classList.remove('login-body');
    };
  }, []);

  useEffect(() => {
    if (user) {
      navigate('/main');
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await signin(formData);
  };

  return (
    <div className="login-box">
      <img src={logo} className="avatar" alt="Avatar Image" /> {/* Utiliza la imagen importada */}
      <h1>Inicia Sesión</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="usernameOrEmail">Usuario</label>
        <input type="text" name="usernameOrEmail" placeholder="Ingrese su usuario o email" onChange={handleChange} value={formData.usernameOrEmail} required />
        
        <label htmlFor="contraseña">Contraseña</label>
        <input type="password" name="contraseña" placeholder="Ingrese su contraseña" onChange={handleChange} value={formData.contraseña} required />
        
        <input type="submit" value="Ingresar" disabled={loading}/>
        {errors && errors.length > 0 && <p>Error: {errors.join(', ')}</p>}
        <a href="#">¿Olvidaste tu contraseña?</a><br />
        <Link to="/register">¿No tienes cuenta?</Link>
      </form>
    </div>
  );
}

export default Login;
