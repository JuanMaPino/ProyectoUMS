import axios from 'axios';

const API = 'http://localhost:3002/roles';
const APIPermisos = 'http://localhost:3002/permisos'

export const ObtenerTodosLosPermisos =() => axios.get(`${APIPermisos}/`)
export const createRolRequest = (rol) => axios.post(`${API}/`, rol);
export const updateRolRequest = (id, rol) => axios.put(`${API}/${id}`, rol);
export const getRolByIdRequest = (id) => axios.get(`${API}/${id}`);
export const getAllRolesRequest = () => axios.get(`${API}/`);
export const disableRolRequest = (id) => axios.patch(`${API}/${id}/estado`);
export const deleteRolRequest = (id) => axios.delete(`${API}/${id}`);
