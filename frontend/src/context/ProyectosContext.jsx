import React, { createContext, useContext, useState, useEffect } from 'react';
import {
    createProyectoRequest,
    updateProyectoRequest,
    getProyectoByIdRequest,
    getAllProyectosRequest,
    disableProyectoRequest,
    deleteProyectoRequest,
    getActividadesByProyectoIdRequest,
    createActividadRequest, 
    updateActividadRequest, 
    deleteActividadRequest,
    changeActividadStateRequest
} from '../api/ApiProyectos';

const ProyectoContext = createContext();

export const useProyectos = () => useContext(ProyectoContext);

export const ProyectoProvider = ({ children }) => {
    const [proyectos, setProyectos] = useState([]);
    const [actividades, setActividades] = useState([]);
    const [errors, setErrors] = useState([]);
    const [proyectoId, setProyectoId] = useState();

    const getProyectos = async () => {
        try {
            const response = await getAllProyectosRequest();
            setProyectos(response.data);
            setErrors([]);
        } catch (error) {
            handleErrors(error);
        }
    };

    const fetchActividades = async (proyectoId) => {
        try {
            const response = await getActividadesByProyectoIdRequest(proyectoId);
            setActividades(response.data || []); // Ensure this matches your response structure
// Log activities to the console
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

    // Create a new activity within a project
    const createActividad = async (proyectoId, data) => {
        try {
            const response = await createActividadRequest(proyectoId, data);
            setActividades(response.data);
            setErrors([]);
        } catch (error) {
            handleErrors(error);
        }
    };

    // Update an existing activity within a project
    const updateActividad = async (proyectoId, actividadId, data) => {
        try {
            const response = await updateActividadRequest(proyectoId, actividadId, data);
            const updatedActividades = actividades.map(actividad =>
                actividad._id === response.data._id ? response.data : actividad
            );
            setActividades(updatedActividades);
            setErrors([]);
        } catch (error) {
            handleErrors(error);
        }
    };

    const changeActividadState = async (proyectoId, actividadId) => {
        try {
            const response = await changeActividadStateRequest(proyectoId, actividadId);
            const updatedActividades = actividades.map(actividad =>
                actividad._id === response.data._id ? response.data : actividad
            );
            setActividades(updatedActividades);
            setErrors([]);
        } catch (error) {
            handleErrors(error);
        }
    };

    // Delete an activity from a project
    const deleteActividad = async (proyectoId, actividadId) => {
        try {
            await deleteActividadRequest(proyectoId, actividadId);
            const updatedActividades = actividades.filter(actividad => actividad._id !== actividadId);
            setActividades(updatedActividades);
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
        getProyectos();
    }, []);

    return (
        <ProyectoContext.Provider
            value={{
                proyectos,
                actividades,
                errors,
                createProyecto,
                updateProyecto,
                deleteProyecto,
                disableProyecto,
                getProyectos,
                fetchActividades, // Include fetchActividades in the context
                createActividad,  // Include createActividad in the context
                updateActividad,  // Include updateActividad in the context
                deleteActividad,
                changeActividadState   // Include deleteActividad in the context
            }}
        >
            {children}
        </ProyectoContext.Provider>
    );
};
