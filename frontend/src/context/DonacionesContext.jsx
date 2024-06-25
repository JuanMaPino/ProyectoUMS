import { createContext, useState, useContext, useEffect } from 'react';
import {
    createDonacionRequest,
    updateDonacionRequest,
    anularDonacionRequest,
    getAllDonacionesRequest,
    getDonacionByIdRequest
    // Agrega aquí las importaciones de las funciones de API necesarias
} from '../api/ApiDonacion'; // Ajusta la ruta según la estructura de tu proyecto

export const DonacionesContext = createContext();

export const useDonaciones = () => {
    const context = useContext(DonacionesContext);
    if (!context) {
        throw new Error('useDonaciones must be used within a DonacionesProvider');
    }
    return context;
};

export const DonacionesProvider = ({ children }) => {
    const [donaciones, setDonaciones] = useState([]);
    const [selectedDonacion, setSelectedDonacion] = useState(null);
    const [errors, setErrors] = useState([]);

    // Función para crear una nueva donación
    const createDonacion = async (donacion) => {
        try {
            const res = await createDonacionRequest(donacion); // Implementa esta función en tu API
            setDonaciones([...donaciones, res.data]);
            return { success: true };
        } catch (error) {
            const errorMessage = error.response.data?.message || 'An error occurred';
            setErrors([errorMessage]);
            return { success: false, error: errorMessage };
        }
    };

    // Función para actualizar una donación existente
    const updateDonacion = async (id, donacion) => {
        try {
            const res = await updateDonacionRequest(id, donacion); // Implementa esta función en tu API
            setDonaciones(donaciones.map(d => d._id === id ? res.data : d));
        } catch (error) {
            setErrors(error.response.data);
        }
    };

    const getDonacionById = async (id) => {
        try {
            const res = await getDonacionByIdRequest(id);
            setSelectedDonacion(res.data);
        } catch (error) {
            setErrors(error.response.data);
        }
    };


    const anularDonacion = async (id) => {
        try {
            const res = await anularDonacionRequest(id);
            setDonaciones(donacines.map(d => d._id === id ? res.data : d));
            handleResponse(res)
            return { success: true };
        } catch (error) {
            const errorMessage = error.response.data?.message || 'An error occurred';
            setErrors([errorMessage]);
            handleError(error)
            return { success: false, error: errorMessage };
        }
    };

    const getAllDonaciones = async () => {
        try {
            const res = await getAllDonacionesRequest(); // Implementa esta función en tu API
            setDonaciones(res.data);
        } catch (error) {
            setErrors(error.response.data);
        }
    };

    // Efecto para cargar las donaciones al montar el componente
    useEffect(() => {
        getAllDonaciones();
    }, []);

    // Efecto para limpiar los errores después de un tiempo determinado
    useEffect(() => {
        if (errors.length > 0) {
            const timer = setTimeout(() => setErrors([]), 3000);
            return () => clearTimeout(timer);
        }
    }, [errors]);

    return (
        <DonacionesContext.Provider value={{
            createDonacion,
            updateDonacion,
            anularDonacion,
            getAllDonaciones,
            donaciones,
            selectedDonacion,
            errors
        }}>
            {children}
        </DonacionesContext.Provider>
    );
};
