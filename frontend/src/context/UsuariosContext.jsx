import { createContext, useContext, useState, useEffect } from 'react';
import {
  getAllUsuariosRequest,
  createUsuarioRequest,
  updateUsuarioRequest,
  deleteUsuarioRequest,
  disableUsuarioRequest,
} from '../api/ApiUsuarios';  // Asegúrate de tener estas funciones en tu archivo API.

const UsuariosContext = createContext();

export const useUsuarios = () => useContext(UsuariosContext);

export const UsuariosProvider = ({ children }) => {
  const [usuarios, setUsuarios] = useState([]);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchUsuarios = async () => {
    try {
      setLoading(true);
      const response = await getAllUsuariosRequest();
      setUsuarios(response.data);
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      setErrors(['Error al obtener usuarios']);
    } finally {
      setLoading(false);
    }
  };

  const createUsuario = async (userData) => {
    try {
      setLoading(true);
      const response = await createUsuarioRequest(userData);
      setUsuarios([...usuarios, response.data]);
    } catch (error) {
      console.error('Error al crear usuario:', error);
      setErrors(['Error al crear usuario']);
    } finally {
      setLoading(false);
    }
  };

  const updateUsuario = async (id, userData) => {
    try {
      setLoading(true);
      const response = await updateUsuarioRequest(id, userData);
      setUsuarios(usuarios.map(usuario => 
        usuario._id === id ? response.data : usuario
      ));
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      setErrors(['Error al actualizar usuario']);
    } finally {
      setLoading(false);
    }
  };

  const deleteUsuario = async (id) => {
    try {
      setLoading(true);
      await deleteUsuarioRequest(id);
      setUsuarios(usuarios.filter((usuario) => usuario._id !== id));
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      setErrors(['Error al eliminar usuario']);
    } finally {
      setLoading(false);
    }
  };

  const disableUsuario = async (id) => {
    try {
      setLoading(true);
      const response = await disableUsuarioRequest(id);
      setUsuarios(usuarios.map((usuario) =>
        usuario._id === id ? response.data : usuario
      ));
    } catch (error) {
      console.error('Error al deshabilitar usuario:', error);
      setErrors(['Error al deshabilitar usuario']);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  return (
    <UsuariosContext.Provider
      value={{
        usuarios,
        createUsuario,
        updateUsuario,
        deleteUsuario,
        disableUsuario,
        errors,
        loading,
      }}
    >
      {children}
    </UsuariosContext.Provider>
  );
};