import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import {
    createBeneficiarioRequest,
    updateBeneficiarioRequest,
    getBeneficiarioByIdRequest,
    getAllBeneficiariosRequest,
    disableBeneficiarioRequest,
    deleteBeneficiarioRequest // Agregado para la eliminación de beneficiario
} from '../api/ApiBeneficiario'; // Asegúrate de ajustar la ruta según tu estructura de archivos

// Definición del contexto
const BeneficiarioContext = createContext();

// Hook personalizado para usar el contexto
export const useBeneficiarios = () => useContext(BeneficiarioContext);

// Proveedor del contexto que envuelve la aplicación
export const BeneficiarioProvider = ({ children }) => {
    const [beneficiarios, setBeneficiarios] = useState([]);
    const [errors, setErrors] = useState([]);

    // Función para obtener todos los beneficiarios
    const fetchBeneficiarios = async () => {
        try {
            const response = await getAllBeneficiariosRequest();
            setBeneficiarios(response.data);
        } catch (error) {
            handleErrors(error);
        }
    };

    // Función para crear un beneficiario
    const createBeneficiario = async (data) => {
        try {
            const response = await createBeneficiarioRequest(data);
            setBeneficiarios([...beneficiarios, response.data]);
        } catch (error) {
            handleErrors(error);
        }
    };

    // Función para actualizar un beneficiario
    const updateBeneficiario = async (id, data) => {
        try {
            const response = await updateBeneficiarioRequest(id, data);
            const updatedBeneficiarios = beneficiarios.map(beneficiario =>
                beneficiario._id === response.data._id ? response.data : beneficiario
            );
            setBeneficiarios(updatedBeneficiarios);
        } catch (error) {
            handleErrors(error);
        }
    };

    // Función para eliminar un beneficiario
    const deleteBeneficiario = async (id) => {
        try {
            await deleteBeneficiarioRequest(id);
            const updatedBeneficiarios = beneficiarios.filter(beneficiario => beneficiario._id !== id);
            setBeneficiarios(updatedBeneficiarios);
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

    // Cargar beneficiarios al montar el componente
    useEffect(() => {
        fetchBeneficiarios();
    }, []);

    return (
        <BeneficiarioContext.Provider
            value={{
                beneficiarios,
                errors,
                createBeneficiario,
                updateBeneficiario,
                deleteBeneficiario
            }}
        >
            {children}
        </BeneficiarioContext.Provider>
    );
};
