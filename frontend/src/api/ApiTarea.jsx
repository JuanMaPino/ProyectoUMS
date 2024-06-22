import axios from 'axios';

const API = 'http://localhost:3002/tareas';

export const createTareaRequest = (tarea) => axios.post(`${API}/`, tarea);
export const updateTareaRequest = (id, tarea) => axios.put(`${API}/${id}`, tarea);
export const getTareaByIdRequest = (id) => axios.get(`${API}/${id}`);
export const getAllTareasRequest = () => axios.get(`${API}/`);
export const disableTareaRequest = (id) => axios.patch(`${API}/${id}/estado`);
export const deleteTareaRequest = (id) => axios.delete(`${API}/${id}`);
