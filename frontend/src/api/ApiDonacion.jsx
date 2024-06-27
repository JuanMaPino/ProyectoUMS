import axios from 'axios';

const API = 'http://localhost:3002/donaciones';

export const createDonacionRequest = (donacion) => axios.post(`${API}/`, donacion);
export const updateDonacionRequest = (id, donacion) => axios.put(`${API}/${id}`, donacion);
export const getDonacionByIdRequest = (id) => axios.get(`${API}/${id}`);
export const getAllDonacionesRequest = () => axios.get(`${API}/`);
export const anularDonacionRequest = (id) => axios.patch(`${API}/${id}/anular`);