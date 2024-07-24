import axios from 'axios';

const API = 'http://localhost:3002/proyectos';

// Crear un nuevo proyecto
export const createProyectoRequest = (proyecto) => axios.post(`${API}/`, proyecto);

// Actualizar un proyecto existente
export const updateProyectoRequest = (id, proyecto) => axios.put(`${API}/${id}`, proyecto);

// Obtener un proyecto por su ID
export const getProyectoByIdRequest = (id) => axios.get(`${API}/${id}`);

// Obtener todos los proyectos
export const getAllProyectosRequest = () => axios.get(`${API}/`);

// Deshabilitar un proyecto (cambiar su estado)
export const disableProyectoRequest = (id) => axios.patch(`${API}/${id}/estado`);

// Eliminar un proyecto
export const deleteProyectoRequest = (id) => axios.delete(`${API}/${id}`);
