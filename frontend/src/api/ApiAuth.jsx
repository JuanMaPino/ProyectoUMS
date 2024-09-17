import axios from 'axios';

const API_URL = 'http://localhost:3002/auth';

export const register = (userData) => axios.post(`${API_URL}/register`, userData);
export const login = (userData) => axios.post(`${API_URL}/login`, userData, {withCredentials: true});
export const logout = () => axios.post(`${API_URL}/logout`, {}, {withCredentials: true});

// Nuevo: Enviar código de recuperación
export const sendRecoveryCode = (usernameOrEmail) => 
  axios.post(`${API_URL}/sendcode`, { usernameOrEmail });

// Nuevo: Validar el código de recuperación
export const validateRecoveryCode = (id, code) => 
  axios.post(`${API_URL}/validatecode`, { id, code });

// Nuevo: Cambiar la contraseña
export const changePassword = (id, newPassword) => 
  axios.post(`${API_URL}/changepassword`, { id, newPassword });