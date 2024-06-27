import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import {
    createBeneficiarioRequest,
    updateBeneficiarioRequest,
    getBeneficiarioByIdRequest,
    getAllBeneficiariosRequest,
    disableBeneficiarioRequest,
    deleteBeneficiarioRequest
} from '../api/ApiBeneficiario'; // Ajusta la ruta según tu estructura de archivos

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
            setErrors([]); // Limpiar errores en caso de éxito
        } catch (error) {
            handleErrors(error);
        }
    };

    // Función para crear un beneficiario
    const createBeneficiario = async (data) => {
        try {
            console.log("Datos a enviar: ", data)
            const capitalizedData = capitalizeBeneficiarioData(data);
            const response = await createBeneficiarioRequest(capitalizedData);
            setBeneficiarios([...beneficiarios, response.data]);
            setErrors([]); // Limpiar errores en caso de éxito
        } catch (error) {
            handleErrors(error);
        }
    };

    // Función para actualizar un beneficiario
    const updateBeneficiario = async (id, data) => {
        try {
            const capitalizedData = capitalizeBeneficiarioData(data);
            const response = await updateBeneficiarioRequest(id, capitalizedData);
            const updatedBeneficiarios = beneficiarios.map(beneficiario =>
                beneficiario._id === response.data._id ? response.data : beneficiario
            );
            setBeneficiarios(updatedBeneficiarios);
            setErrors([]); // Limpiar errores en caso de éxito
        } catch (error) {
            handleErrors(error);
        }
    };

    // Función para deshabilitar un beneficiario
    const disableBeneficiario = async (id) => {
        try {
            const response = await disableBeneficiarioRequest(id);
            setBeneficiarios(beneficiarios.map(beneficiario =>
                beneficiario._id === id ? response.data : beneficiario
            ));
            setErrors([]); // Limpiar errores en caso de éxito
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
            setErrors([]); // Limpiar errores en caso de éxito
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

    const capitalizeBeneficiarioData = (data) => {
        const capitalizedNombre = data.nombre.charAt(0).toUpperCase() + data.nombre.slice(1).toLowerCase();
        return { ...data, nombre: capitalizedNombre };
    };

    return (
        <BeneficiarioContext.Provider
            value={{
                beneficiarios,
                errors,
                createBeneficiario,
                updateBeneficiario,
                disableBeneficiario,
                deleteBeneficiario
            }}
        >
            {children}
        </BeneficiarioContext.Provider>
    );
};