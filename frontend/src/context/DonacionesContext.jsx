import { createContext, useState, useContext, useEffect } from 'react';
import {
    createDonacionRequest,
    updateDonacionRequest,
    anularDonacionRequest,
    getAllDonacionesRequest,
    getDonacionByIdRequest
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
            console.log("Datos a enviar:", donacion);
            const res = await createDonacionRequest(donacion);

            setDonaciones([...donaciones, res.data]);
            return { success: false };
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'An error occurred';
            console.error("Error al crear donacion:", error.response?.data || error.message);
            setErrors([errorMessage]);
            return { success: false, error: errorMessage };
        }
    };

    // Función para actualizar una donación existente
    const updateDonacion = async (id, donacion) => {
        try {
            const res = await updateDonacionRequest(id, donacion);
            setDonaciones(donaciones.map(d => d._id === id ? res.data : d));
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'An error occurred';
            setErrors([errorMessage]);
        }
    };

    // Función para obtener una donación por su ID
    const getDonacionById = async (id) => {
        try {
            const res = await getDonacionByIdRequest(id);
            setSelectedDonacion(res.data);
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'An error occurred';
            setErrors([errorMessage]);
        }
    };

    // Función para anular una donación
    const anularDonacion = async (id) => {
        try {
            const res = await anularDonacionRequest(id);
            setDonaciones(donaciones.map(d => d._id === id ? res.data : d));
            return { success: true };
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'An error occurred';
            setErrors([errorMessage]);
            return { success: false, error: errorMessage };
        }
    };

    // Función para obtener todas las donaciones
    const getAllDonaciones = async () => {
        try {
            const res = await getAllDonacionesRequest();
            setDonaciones(res.data);
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'An error occurred';
            setErrors([errorMessage]);
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
            getDonacionById,
            getAllDonaciones,
            donaciones,
            selectedDonacion,
            errors
        }}>
            {children}
        </DonacionesContext.Provider>
    );
};
