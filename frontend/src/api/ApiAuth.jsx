import axios from 'axios';

const API_URL = 'http://localhost:3002/auth';

export const register = (userData) => axios.post(`${API_URL}/register`, userData);
export const login = (userData) => axios.post(`${API_URL}/login`, userData, {withCredentials: true});
export const logout = () => axios.post(`${API_URL}/logout`, {}, {withCredentials: true});