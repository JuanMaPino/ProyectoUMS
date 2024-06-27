// AyudantesContext.js

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
    createAyudanteRequest,
    updateAyudanteRequest,
    getAllAyudantesRequest,
    disableAyudanteRequest,
    deleteAyudanteRequest
} from '../api/ApiAyudante'; // Ajustar la ruta según tu estructura de archivos

// Definición del contexto
const AyudanteContext = createContext();

// Hook personalizado para usar el contexto
export const useAyudantes = () => useContext(AyudanteContext);

// Proveedor del contexto que envuelve la aplicación
export const AyudanteProvider = ({ children }) => {
    const [ayudantes, setAyudantes] = useState([]);
    const [errors, setErrors] = useState([]);

    // Función para obtener todos los ayudantes
    const getAllAyudantes = async () => {
        try {
            const response = await getAllAyudantesRequest();
            setAyudantes(response.data);
        } catch (error) {
            handleErrors(error);
        }
    };

    // Función para crear un ayudante
    const createAyudante = async (data) => {
        try {
            const capitalizedData = capitalizeAyudanteData(data);
            const response = await createAyudanteRequest(capitalizedData);
            setAyudantes([...ayudantes, response.data]);
        } catch (error) {
            handleErrors(error);
        }
    };

    // Función para actualizar un ayudante
    const updateAyudante = async (id, data) => {
        try {
            const capitalizedData = capitalizeAyudanteData(data);
            const response = await updateAyudanteRequest(id, capitalizedData);
            const updatedAyudantes = ayudantes.map(ayudante =>
                ayudante._id === response.data._id ? response.data : ayudante
            );
            setAyudantes(updatedAyudantes);
        } catch (error) {
            handleErrors(error);
        }
    };

    // Función para deshabilitar un ayudante
    const disableAyudante = async (id) => {
        try {
            const res = await disableAyudanteRequest(id);
            setAyudantes(ayudantes.map(p => p._id === id ? res.data : p));
        } catch (error) {
            setErrors([error.response.data.error]);
        }
    };

    // Función para eliminar un ayudante
    const deleteAyudante = async (id) => {
        try {
            await deleteAyudanteRequest(id);
            const updatedAyudantes = ayudantes.filter(ayudante => ayudante._id !== id);
            setAyudantes(updatedAyudantes);
        } catch (error) {
            handleErrors(error);
        }
    };

    // Función para manejar errores
    const handleErrors = (error) => {
        if (error.response && error.response.data) {
            setErrors([error.response.data.error]);
        } else {
            setErrors([error.message]);
        }
    };

    // Cargar ayudantes al montar el componente
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
        getAllAyudantes
    };

    return (
        <AyudanteContext.Provider value={value}>
            {children}
        </AyudanteContext.Provider>
    );
};
