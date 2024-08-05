import axios from 'axios';

const API = 'http://localhost:3002'; // Ajusta la URL base según tu configuración

export const createActividadRequest = (actividad) => axios.post(`${API}/actividades/`, actividad);
export const updateActividadRequest = (id, actividad) => axios.put(`${API}/actividades/${id}`, actividad);
export const getActividadByIdRequest = (id) => axios.get(`${API}/actividades/${id}`);
export const getAllActividadesRequest = () => axios.get(`${API}/actividades/`);
export const getActividadesByProyectoRequest = (proyectoId) => axios.get(`${API}/actividades/proyecto/${proyectoId}`); // Nueva función
export const disableActividadRequest = (id) => axios.patch(`${API}/actividades/${id}/estado`);
export const searchActividadByNameRequest = (nombre) => axios.get(`${API}/actividades/buscar/${nombre}`);
export const deleteActividadRequest = (id) => axios.delete(`${API}/actividades/${id}`);
