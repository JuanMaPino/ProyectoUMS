import React, { createContext, useContext, useState, useEffect } from 'react';
import {
    createProyectoRequest,
    updateProyectoRequest,
    getProyectoByIdRequest,
    getAllProyectosRequest,
    disableProyectoRequest,
    deleteProyectoRequest
} from '../api/ApiProyectos';

const ProyectoContext = createContext();

export const useProyectos = () => useContext(ProyectoContext);

export const ProyectoProvider = ({ children }) => {
    const [proyectos, setProyectos] = useState([]);
    const [errors, setErrors] = useState([]);

    const fetchProyectos = async () => {
        try {
            const response = await getAllProyectosRequest();
            setProyectos(response.data);
            setErrors([]);
        } catch (error) {
            handleErrors(error);
        }
    };

    const createProyecto = async (data) => {
        try {
            const response = await createProyectoRequest(data);
            setProyectos([...proyectos, response.data]);
            setErrors([]);
        } catch (error) {
            handleErrors(error);
        }
    };

    const updateProyecto = async (id, data) => {
        try {
            const response = await updateProyectoRequest(id, data);
            const updatedProyectos = proyectos.map(proyecto =>
                proyecto._id === response.data._id ? response.data : proyecto
            );
            setProyectos(updatedProyectos);
            setErrors([]);
        } catch (error) {
            handleErrors(error);
        }
    };

    const disableProyecto = async (id) => {
        try {
            const response = await disableProyectoRequest(id);
            setProyectos(proyectos.map(proyecto =>
                proyecto._id === id ? response.data : proyecto
            ));
            setErrors([]);
        } catch (error) {
            handleErrors(error);
        }
    };

    const deleteProyecto = async (id) => {
        try {
            await deleteProyectoRequest(id);
            const updatedProyectos = proyectos.filter(proyecto => proyecto._id !== id);
            setProyectos(updatedProyectos);
            setErrors([]);
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

    useEffect(() => {
        fetchProyectos();
    }, []);

    return (
        <ProyectoContext.Provider
            value={{
                proyectos,
                errors,
                createProyecto,
                updateProyecto,
                deleteProyecto,
                disableProyecto,
                fetchProyectos // Asegúrate de incluir fetchProyectos en el contexto
            }}
        >
            {children}
        </ProyectoContext.Provider>
    );
};
