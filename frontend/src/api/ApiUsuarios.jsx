import axios from 'axios';

// Ruta base para la API de usuarios
const API_URL = 'http://localhost:3002/auth/users';

// Obtener todos los usuarios
export const getAllUsuariosRequest = async () => {
  return await axios.get(API_URL);
};

// Crear un nuevo usuario
export const createUsuarioRequest = async (userData) => {
  return await axios.post(API_URL, userData);
};

// Actualizar un usuario existente
export const updateUsuarioRequest = (id, userData) => axios.put(`${API_URL}/${id}`, userData);

// Eliminar un usuario
export const deleteUsuarioRequest = async (id) => {
  return await axios.delete(`${API_URL}/${id}`);
};

// Deshabilitar un usuario
export const disableUsuarioRequest = (id) => axios.patch(`${API_URL}/disable/${id}`);
