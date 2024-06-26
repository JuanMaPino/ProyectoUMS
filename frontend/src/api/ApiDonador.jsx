import axios from 'axios';

const API = 'http://localhost:3002/donadores';

export const createDonadorRequest = (donador) => axios.post(`${API}/`, donador);
export const updateDonadorRequest = (id, donador) => axios.put(`${API}/${id}`, donador);
export const getDonadorByIdRequest = (id) => axios.get(`${API}/${id}`);
export const getAllDonadoresRequest = () => axios.get(`${API}/`);
export const disableDonadorRequest = (id) => axios.patch(`${API}/${id}/estado`);
export const deleteDonadorRequest = (id) => axios.delete(`${API}/${id}`);
export const getDonadorByIdentificacionRequest = (identificacion) => axios.get(`${API}/buscar/${identificacion}`);
