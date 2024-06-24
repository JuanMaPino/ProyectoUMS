import axios from 'axios';

const API = 'http://localhost:3002/insumos';

export const createInsumoRequest = (insumo) => axios.post(`${API}/`, insumo);
export const updateInsumoRequest = (id, insumo) => axios.put(`${API}/${id}`, insumo);
export const getInsumoByIdRequest = (id) => axios.get(`${API}/${id}`);
export const getAllInsumosRequest = () => axios.get(`${API}/`);
export const disableInsumoRequest = (id) => axios.patch(`${API}/${id}/estado`);
export const deleteInsumoRequest = (id) => axios.delete(`${API}/${id}`);