import axios from 'axios';

const API = 'http://localhost:3002/tareas';

const handleApiError = (error) => {
  console.error('API Error:', error.response?.data || error.message);
  throw error;
};

export const createTareaRequest = (tarea) => axios.post(`${API}/`, tarea).catch(handleApiError);
export const updateTareaRequest = (id, tarea) => axios.put(`${API}/${id}`, tarea).catch(handleApiError);
export const getTareaByIdRequest = (id) => axios.get(`${API}/${id}`).catch(handleApiError);
export const getAllTareasRequest = () => axios.get(`${API}/`).catch(handleApiError);
export const disableTareaRequest = (id) => axios.patch(`${API}/${id}/estado`).catch(handleApiError);
export const deleteTareaRequest = (id) => axios.delete(`${API}/${id}`).catch(handleApiError);