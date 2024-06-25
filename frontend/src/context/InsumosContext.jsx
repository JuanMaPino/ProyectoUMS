import React, { createContext, useContext, useState, useEffect } from 'react';
import {
    createInsumoRequest,
    updateInsumoRequest,
    getAllInsumosRequest,
    deleteInsumoRequest
} from '../api/ApiInsumo'; // Ajusta la ruta según tu estructura de archivos

const InsumoContext = createContext();

export const useInsumos = () => useContext(InsumoContext);

export const InsumoProvider = ({ children }) => {
    const [insumos, setInsumos] = useState([]);
    const [errors, setErrors] = useState([]);
    
    useEffect(() => {
        getAllInsumos();
    }, []);

    const getAllInsumos = async () => {
        try {
            const response = await getAllInsumosRequest();
            setInsumos(response.data);
        } catch (error) {
            handleErrors(error);
        }
    };

    const createInsumo = async (data) => {
        try {
            const response = await createInsumoRequest(data);
            setInsumos([...insumos, response.data]);
        } catch (error) {
            handleErrors(error);
        }
    };

    const updateInsumo = async (id, data) => {
        try {
            const response = await updateInsumoRequest(id, data);
            const updatedInsumos = insumos.map(insumo =>
                insumo._id === response.data._id ? response.data : insumo
            );
            setInsumos(updatedInsumos);
        } catch (error) {
            handleErrors(error);
        }
    };

    const deleteInsumo = async (id) => {
        try {
            await deleteInsumoRequest(id);
            const updatedInsumos = insumos.filter(insumo => insumo._id !== id);
            setInsumos(updatedInsumos);
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

    return (
        <InsumoContext.Provider
            value={{
                insumos,
                errors,
                createInsumo,
                updateInsumo,
                deleteInsumo,
                getAllInsumos
            }}
        >
            {children}
        </InsumoContext.Provider>
    );
};
