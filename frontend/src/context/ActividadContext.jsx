import { createContext, useState, useContext, useEffect } from 'react';
import {
    createActividadRequest,
    updateActividadRequest,
    getActividadByIdRequest,
    getAllActividadesRequest,
    disableActividadRequest,
    deleteActividadRequest
} from '../api/ApiActividad'; // Ajusta las importaciones según tu estructura de API

export const ActividadContext = createContext();

export const useActividades = () => {
    const context = useContext(ActividadContext);
    if (!context) {
        throw new Error('useActividades must be used within a ActividadProvider');
    }
    return context;
};

export const ActividadProvider = ({ children }) => {
    const [actividades, setActividades] = useState([]);
    const [selectedActividad, setSelectedActividad] = useState(null);
    const [errors, setErrors] = useState([]);

    const createActividad = async (actividad) => {
        try {
            const res = await createActividadRequest(actividad);
            setActividades([...actividades, res.data]);
            return { success: true };
        } catch (error) {
            const errorMessage = error.response.data?.message || 'An error occurred';
            setErrors([errorMessage]);
            return { success: false, error: errorMessage };
        }
    };

    const updateActividad = async (id, actividad) => {
        try {
            const res = await updateActividadRequest(id, actividad);
            setActividades(actividades.map(a => a._id === id ? res.data : a));
            return { success: true };
        } catch (error) {
            const errorMessage = error.response.data?.message || 'An error occurred';
            setErrors([errorMessage]);
            return { success: false, error: errorMessage };
        }
    };

    const getActividadById = async (id) => {
        try {
            const res = await getActividadByIdRequest(id);
            setSelectedActividad(res.data);
        } catch (error) {
            const errorMessage = error.response.data?.message || 'An error occurred';
            setErrors([errorMessage]);
        }
    };

    const getAllActividades = async () => {
        try {
            const res = await getAllActividadesRequest();
            setActividades(res.data);
        } catch (error) {
            const errorMessage = error.response.data?.message || 'An error occurred';
            setErrors([errorMessage]);
        }
    };

    const disableActividad = async (id) => {
        try {
            const res = await disableActividadRequest(id);
            setActividades(actividades.map(a => a._id === id ? res.data : a));
            return { success: true };
        } catch (error) {
            const errorMessage = error.response.data?.message || 'An error occurred';
            setErrors([errorMessage]);
            return { success: false, error: errorMessage };
        }
    };

    const deleteActividad = async (id) => {
        try {
            await deleteActividadRequest(id);
            setActividades(actividades.filter(a => a._id !== id));
            return { success: true };
        } catch (error) {
            const errorMessage = error.response.data?.message || 'An error occurred';
            setErrors([errorMessage]);
            return { success: false, error: errorMessage };
        }
    };

    useEffect(() => {
        getAllActividades();
    }, []);

    useEffect(() => {
        if (errors.length > 0) {
            const timer = setTimeout(() => setErrors([]), 3000);
            return () => clearTimeout(timer);
        }
    }, [errors]);

    return (
        <ActividadContext.Provider value={{
            createActividad,
            updateActividad,
            getActividadById,
            getAllActividades,
            deleteActividad,
            disableActividad,
            actividades,
            selectedActividad,
            errors
        }}>
            {children}
        </ActividadContext.Provider>
    );
};
