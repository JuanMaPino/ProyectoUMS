import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRoles } from '../context/RolesContext'
import { useNavigate } from 'react-router-dom';
import logo from "../assets/img/logoums.png";
import bosque from "../assets/img/bosquesito.jpeg";
import { RiEyeCloseLine, RiEyeLine } from 'react-icons/ri';

function Register() {
  const { signup, errors, loading } = useAuth();
  const { roles } = useRoles();
  const [formData, setFormData] = useState({
    usuario: '',
    email: '',
    contraseña: '',
    confirmarContraseña: '',
    tipo: '',
  });
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleTogglePasswordVisibility = () => {
    setPasswordVisible(prev => !prev);
  }

  const rolOptions = roles.map(rol => ({
    value: rol._id,
    label: rol.nombre,
  }));

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
    return contraseña.length >= 6;
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
      await signup({ usuario, email, contraseña, tipo });
      navigate('/login');
    } catch (error) {
      console.error('Error al registrar', error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-cover bg-center bg-fixed"
      style={{ backgroundImage: `url(${bosque})` }}>
      <div className="w-full max-w-4xl p-8 bg-white opacity-90 rounded-xl shadow-md">
        <div className="flex flex-col items-center ">
          <img src={logo} className="w-24 mb-4" alt="Logo" />
          <h1 className="text-2xl font-semibold">Registro</h1>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="usuario" className="block mb-2 text-sm font-medium text-gray-700">Nombre</label>
              <input
                type="text"
                name="usuario"
                placeholder="Ingrese su nombre"
                onChange={handleChange}
                value={formData.usuario}
                required
                className="w-full p-2 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <div>
              <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">Correo Electrónico</label>
              <input
                type="email"
                name="email"
                placeholder="Ingrese su correo electrónico"
                onChange={handleChange}
                value={formData.email}
                required
                className="w-full p-2 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div className="relative">
              <label htmlFor="contraseña" className="block mb-2 text-sm font-medium text-gray-700">Contraseña</label>
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

            <div>
              <label htmlFor="confirmarContraseña" className="block mb-2 text-sm font-medium text-gray-700">Confirmar Contraseña</label>
              <input
                type={passwordVisible ? "text" : "password"}
                name="confirmarContraseña"
                placeholder="Confirme su contraseña"
                onChange={handleChange}
                value={formData.confirmarContraseña}
                required
                className="w-full p-2 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label htmlFor="tipo" className="block mb-2 text-sm font-medium  text-gray-700">Rol</label>
              <select
                id="tipo"
                name="tipo"
                onChange={handleChange}
                value={formData.tipo}
                required
                className="w-full p-2 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                {rolOptions.map(rol => (
                  <option value={rol.value}>{rol.label}</option>

                ))}

              </select>
            </div>
          </div>

          <div className="flex justify-center">
            <input
              type="submit"
              value={loading ? 'Cargando...' : 'Registrar'}
              disabled={loading}
              className="w-full max-w-xs p-2 bg-blue-600 text-white rounded-md cursor-pointer hover:bg-blue-700 disabled:bg-gray-400"
            />
          </div>

          {localErrors.length > 0 && (
            <p className="mt-4 text-sm text-red-500 text-center">Error: {localErrors.join(', ')}</p>
          )}

          <div className="mt-4 text-sm text-gray-600 text-center">
            <a href="/login">¿Ya tienes cuenta?</a>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
