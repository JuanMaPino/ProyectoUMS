import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  createAyudanteRequest,
  updateAyudanteRequest,
  getAllAyudantesRequest,
  disableAyudanteRequest,
  deleteAyudanteRequest
} from '../api/ApiAyudante';

const AyudanteContext = createContext();

export const useAyudantes = () => useContext(AyudanteContext);

export const AyudanteProvider = ({ children }) => {
  const [ayudantes, setAyudantes] = useState([]);
  const [errors, setErrors] = useState([]);

  const getAllAyudantes = async () => {
    try {
      const response = await getAllAyudantesRequest();
      setAyudantes(response.data);
    } catch (error) {
      handleErrors(error);
    }
  };

  const createAyudante = async (data) => {
    try {
      const capitalizedData = capitalizeAyudanteData(data);
      const response = await createAyudanteRequest(capitalizedData);
      setAyudantes(prevAyudantes => [...prevAyudantes, response.data]);
    } catch (error) {
      handleErrors(error);
    }
  };

  const updateAyudante = async (id, data) => {
    try {
      const capitalizedData = capitalizeAyudanteData(data);
      const response = await updateAyudanteRequest(id, capitalizedData);
      setAyudantes(prevAyudantes => prevAyudantes.map(ayudante =>
        ayudante._id === response.data._id ? response.data : ayudante
      ));
      return response.data;
    } catch (error) {
      handleErrors(error);
      throw error;
    }
  };

  const disableAyudante = async (id) => {
    try {
      const res = await disableAyudanteRequest(id);
      setAyudantes(prevAyudantes => prevAyudantes.map(p => p._id === id ? res.data : p));
    } catch (error) {
      setErrors([error.response.data.error]);
    }
  };

  const deleteAyudante = async (id) => {
    try {
      await deleteAyudanteRequest(id);
      setAyudantes(prevAyudantes => prevAyudantes.filter(ayudante => ayudante._id !== id));
    } catch (error) {
      handleErrors(error);
    }
  };

  const handleErrors = (error) => {
    if (error.response && error.response.data) {
      setErrors([error.response.data.error]);
    } else {
      setErrors([error.message]);
    }
  };

  useEffect(() => {
    getAllAyudantes();
  }, []);

  const capitalizeAyudanteData = (data) => {
    const capitalizedNombre = data.nombre.charAt(0).toUpperCase() + data.nombre.slice(1).toLowerCase();
    return { ...data, nombre: capitalizedNombre };
  };

  const value = {
    ayudantes,
    errors,
    createAyudante,
    updateAyudante,
    deleteAyudante,
    disableAyudante,
    getAllAyudantes,
    setAyudantes
  };

  return (
    <AyudanteContext.Provider value={value}>
      {children}
    </AyudanteContext.Provider>
  );
};