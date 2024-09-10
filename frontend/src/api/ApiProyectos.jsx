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

// Obtener actividades de un proyecto
export const getActividadesByProyectoIdRequest = (id) => axios.get(`${API}/${id}/actividades`);

// Crear una nueva actividad en un proyecto
export const createActividadRequest = (id, actividad) => axios.post(`${API}/${id}/actividades`, actividad);

// Actualizar una actividad existente en un proyecto
export const updateActividadRequest = (id, actividadId, actividad) => axios.put(`${API}/${id}/actividades/${actividadId}`, actividad);

// Eliminar una actividad de un proyecto
export const deleteActividadRequest = (id, actividadId) => axios.delete(`${API}/${id}/actividades/${actividadId}`);

export const changeActividadStateRequest = (id, actividadId) => axios.patch(`${API}/${id}/actividades/${actividadId}/estado`);