import axios from 'axios';

const API = 'http://localhost:3002/proyectos'; // Asegúrate de que esta URL es correcta

export const createProjectRequest = (project) => axios.post(`${API}`, project);
export const updateProjectRequest = (id, project) => axios.put(`${API}/${id}`, project);
export const getProjectByIdRequest = (id) => axios.get(`${API}/${id}`);
export const getAllProjectsRequest = () => axios.get(`${API}`);
export const disableProjectRequest = (id) => axios.patch(`${API}/${id}/estado`);
export const getProjectByCodigoRequest = (codigo) => axios.get(`${API}/buscar/${codigo}`);
export const deleteProjectRequest = (id) => axios.delete(`${API}/${id}`);
