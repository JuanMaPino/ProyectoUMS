import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from "../assets/img/logoums.png";
import bosque from "../assets/img/bosquesito.jpeg";
import { RiEyeCloseLine, RiEyeLine } from 'react-icons/ri';
import Swal from 'sweetalert2';

function Login() {
  const { signin, errors, loading, user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ usernameOrEmail: '', contraseña: '' });
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleTogglePasswordVisibility = () => {
    setPasswordVisible(prev => !prev);
  };

  useEffect(() => {
    if (user) {
      // Mostrar la alerta de inicio de sesión exitoso
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Inicio de sesión exitoso',
        showConfirmButton: false,
        timer: 1500
      });
      
      // Redirigir al dashboard después de la alerta
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-cover bg-center bg-fixed" 
         style={{ backgroundImage: `url(${bosque})` }}>
      <div className="w-full max-w-sm p-8 bg-white rounded-xl shadow-md">
        <img src={logo} className="w-24 mx-auto mb-4" alt="Logo" />
        <h1 className="text-2xl font-semibold text-center mb-6">Inicia Sesión</h1>
        <form onSubmit={handleSubmit}>
          <label htmlFor="usernameOrEmail" className="block mb-2 text-sm font-medium text-gray-700">Usuario o Email</label>
          <input 
            type="text" 
            name="usernameOrEmail" 
            placeholder="Ingrese su usuario o email" 
            onChange={handleChange} 
            value={formData.usernameOrEmail} 
            required 
            className="w-full p-2 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600" 
          />

          <label htmlFor="contraseña" className="block mb-2 text-sm font-medium text-gray-700">Contraseña</label>
          <div className="relative">
            <input 
              type={passwordVisible ? "text" : "password"} 
              name="contraseña" 
              placeholder="Ingrese su contraseña" 
              onChange={handleChange} 
              value={formData.contraseña} 
              required 
              className="w-full p-2 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600" 
            />
            <button
              type="button"
              onClick={handleTogglePasswordVisibility}
              className="absolute inset-y-0 right-0 flex items-center p-3 text-gray-700"
            >
              {passwordVisible ? <RiEyeLine /> : <RiEyeCloseLine />}
            </button>
          </div>

          <input 
            type="submit" 
            value={loading ? 'Cargando...' : 'Ingresar'} 
            disabled={loading} 
            className="w-full p-2 bg-blue-600 text-white rounded-md cursor-pointer hover:bg-blue-700 disabled:bg-gray-400" 
          />

          {errors && errors.length > 0 && (
            <p className="mt-4 text-sm text-red-500 text-center">Error: {errors.join(', ')}</p>
          )}

          <div className="flex justify-center mt-4 text-sm text-gray-600 hover:text-cyan-700 ">
            <Link to="/olvide-contrasena">¿Olvidaste tu contraseña?</Link>
            {/* <Link to="/register">¿No tienes cuenta?</Link> */}
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
