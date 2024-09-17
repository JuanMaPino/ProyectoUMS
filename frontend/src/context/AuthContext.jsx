import { createContext, useState, useContext, useEffect } from "react";
import { register, login, logout } from "../api/ApiAuth"; // Asegúrate de que la función logout está importada
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);  // Aquí aseguramos que loading es un estado
  const navigate = useNavigate();

  const handleErrors = (error) => {
    const errorMessage = error.response ? error.response.data.errors || [error.response.data.message] : ["An error occurred"];
    setErrors(errorMessage);
  };

  const signup = async (userData) => {
    try {
      setLoading(true);
      const user = await register(userData);
      setUser(user);
    } catch (error) {
      console.error('Error al registrar', error);
      handleErrors(error);
    } finally {
      setLoading(false);
    }
  };

  const signin = async (userData) => {
    try {
      setLoading(true);
      const user = await login(userData);
      setUser(user);
    } catch (error) {
      handleErrors(error);
    } finally {
      setLoading(false);
    }
  };

  // Función de logout que se conecta con el backend y limpia el estado del usuario
  const logout = async () => {
    try {
      setLoading(true);
      await logout();  // Llama al API de logout
      setUser(null);   // Limpia el estado del usuario
      navigate('/login'); // Redirige al usuario a la página de login
    } catch (error) {
      handleErrors(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (errors.length > 0) {
      const timer = setTimeout(() => {
        setErrors([]);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [errors]);

  return (
    <AuthContext.Provider value={{ signup, signin, logout, user, errors, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
