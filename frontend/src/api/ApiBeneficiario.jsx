import axios from 'axios';

const API = 'http://localhost:3002/beneficiarios';

export const createBeneficiarioRequest = (beneficiario) => axios.post(`${API}/`, beneficiario);
export const updateBeneficiarioRequest = (id, beneficiario) => axios.put(`${API}/${id}`, beneficiario);
export const getBeneficiarioByIdRequest = (id) => axios.get(`${API}/${id}`);
export const getAllBeneficiariosRequest = () => axios.get(`${API}/`);
export const disableBeneficiarioRequest = (id) => axios.patch(`${API}/${id}/estado`);
export const getBeneficiarioByDocumentoRequest = (documento) => axios.get(`${API}/buscar/${documento}`);
export const deleteBeneficiarioRequest = (id) => axios.delete(`${API}/${id}`);