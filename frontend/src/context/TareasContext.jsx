import React, { createContext, useContext, useState, useEffect } from 'react';
import {
    createTareaRequest,
    updateTareaRequest,
    getAllTareasRequest,
    disableTareaRequest,
    deleteTareaRequest
} from '../api/ApiTarea';

const TareaContext = createContext();

export const useTareas = () => useContext(TareaContext);

export const TareaProvider = ({ children }) => {
    const [tareas, setTareas] = useState([]);
    const [errors, setErrors] = useState([]);

    const fetchTareas = async () => {
        try {
            const response = await getAllTareasRequest();
            setTareas(response.data);
        } catch (error) {
            handleErrors(error);
        }
    };

    const createTarea = async (data) => {
        try {
            const capitalizedData = capitalizeTareaData(data);
            const response = await createTareaRequest(capitalizedData);
            setTareas(prevTareas => [...prevTareas, response.data]);
            return response.data;
        } catch (error) {
            handleErrors(error);
            throw error;
        }
    };

    const updateTarea = async (id, data) => {
        try {
            const capitalizedData = capitalizeTareaData(data);
            const response = await updateTareaRequest(id, capitalizedData);
            setTareas(prevTareas => 
                prevTareas.map(tarea => tarea._id === id ? response.data : tarea)
            );
            return response.data;
        } catch (error) {
            handleErrors(error);
            throw error;
        }
    };

    const disableTarea = async (id) => {
        try {
            const res = await disableTareaRequest(id);
            setTareas(prevTareas => 
                prevTareas.map(tarea => tarea._id === id ? res.data : tarea)
            );
            return res.data;
        } catch (error) {
            handleErrors(error);
            throw error;
        }
    };

    const deleteTarea = async (id) => {
        try {
            await deleteTareaRequest(id);
            setTareas(prevTareas => prevTareas.filter(tarea => tarea._id !== id));
        } catch (error) {
            handleErrors(error);
            throw error;
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
        fetchTareas();
    }, []);

    const capitalizeTareaData = (data) => {
        const capitalizedAccion = data.accion.charAt(0).toUpperCase() + data.accion.slice(1).toLowerCase();
        return { ...data, accion: capitalizedAccion };
    };

    return (
        <TareaContext.Provider
            value={{
                tareas,
                errors,
                createTarea,
                updateTarea,
                disableTarea,
                deleteTarea,
                fetchTareas
            }}
        >
            {children}
        </TareaContext.Provider>
    );
};