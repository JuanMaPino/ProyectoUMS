import axios from 'axios';

const API = 'http://localhost:3002/ayudantes';

export const createAyudanteRequest = (ayudante) => axios.post(`${API}/`, ayudante);
export const updateAyudanteRequest = (id, ayudante) => axios.put(`${API}/${id}`, ayudante);
export const getAyudanteByIdRequest = (id) => axios.get(`${API}/${id}`);
export const getAllAyudantesRequest = () => axios.get(`${API}/`);
export const disableAyudanteRequest = (id) => axios.patch(`${API}/${id}/estado`);
export const getAyudanteByDocumentoRequest = (documento) => axios.get(`${API}/buscar/${documento}`);
export const deleteAyudanteRequest = (id) => axios.delete(`${API}/${id}`);
