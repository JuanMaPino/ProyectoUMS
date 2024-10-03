import React, { createContext, useContext, useState, useEffect } from 'react';
import {
    createTareaRequest,
    updateTareaRequest,
    getTareaByIdRequest,
    getAllTareasRequest,  // Aquí es donde haces la petición para obtener todas las tareas
    disableTareaRequest,
    deleteTareaRequest
} from '../api/ApiTarea';

// Definición del contexto
const TareaContext = createContext();

// Hook personalizado para usar el contexto
export const useTareas = () => useContext(TareaContext);

// Proveedor del contexto que envuelve la aplicación
export const TareaProvider = ({ children }) => {
    const [tareas, setTareas] = useState([]);
    const [errors, setErrors] = useState([]);

    // Cambiamos fetchTareas a getAllTareas para mantener la consistencia
    const getAllTareas = async () => {
        try {
            const response = await getAllTareasRequest();
            setTareas(response.data);
        } catch (error) {
            handleErrors(error);
        }
    };

    // Función para crear una tarea
    const createTarea = async (data) => {
        try {
            const capitalizedData = capitalizeTareaData(data);
            const response = await createTareaRequest(capitalizedData);
            setTareas([...tareas, response.data]);
        } catch (error) {
            handleErrors(error);
        }
    };

    // Función para actualizar una tarea
    const updateTarea = async (id, data) => {
        try {
            const capitalizedData = capitalizeTareaData(data);
            const response = await updateTareaRequest(id, capitalizedData);
            const updatedTareas = tareas.map(tarea =>
                tarea._id === response.data._id ? response.data : tarea
            );
            setTareas(updatedTareas);
        } catch (error) {
            handleErrors(error);
        }
    };

    const disableTarea = async (id) => {
        try {
            const res = await disableTareaRequest(id);
            setTareas(tareas.map(p => p._id === id ? res.data : p));
        } catch (error) {
            setErrors(error.response.data);
        }
    };

    const deleteTarea = async (id) => {
        try {
            await deleteTareaRequest(id);
            const updatedTareas = tareas.filter(tarea => tarea._id !== id);
            setTareas(updatedTareas);
        } catch (error) {
            handleErrors(error);
        }
    };

    // Manejo de errores
    const handleErrors = (error) => {
        if (error.response && error.response.data) {
            setErrors([error.response.data.error]);
        } else {
            setErrors([error.message]);
        }
    };

    // Cargar las tareas cuando el componente se monta
    useEffect(() => {
        getAllTareas();  // Llamamos a getAllTareas en lugar de fetchTareas
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
                getAllTareas  // Asegúrate de exportar getAllTareas aquí
            }}
        >
            {children}
        </TareaContext.Provider>
    );
};
