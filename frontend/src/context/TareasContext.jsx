import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import {
    createTareaRequest,
    updateTareaRequest,
    getTareaByIdRequest,
    getAllTareasRequest,
    disableTareaRequest,
    deleteTareaRequest // Agregado para la eliminación de beneficiario
} from '../api/ApiTarea'; // Asegúrate de ajustar la ruta según tu estructura de archivos

// Definición del contexto
const TareaContext = createContext();

// Hook personalizado para usar el contexto
export const useTareas = () => useContext(TareaContext);

// Proveedor del contexto que envuelve la aplicación
export const TareaProvider = ({ children }) => {
    const [tareas, setTareas] = useState([]);
    const [errors, setErrors] = useState([]);

    // Función para obtener todas las tareas
    const fetchTareas = async () => {
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
            console.log("Datos a enviar", data)
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

    // Función para eliminar una tarea
    const deleteTarea = async (id) => {
        try {
            await deleteTareaRequest(id);
            const updatedTareas = tareas.filter(tarea => tarea._id !== id);
            setTareas(updatedTareas);
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

    // Cargar tareas al montar el componente
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
                deleteTarea
            }}
        >
            {children}
        </TareaContext.Provider>
    );
};
