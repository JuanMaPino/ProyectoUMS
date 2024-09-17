import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import {
    createRolRequest,
    updateRolRequest,
    ObtenerTodosLosPermisos,
    getRolByIdRequest,
    getAllRolesRequest,
    disableRolRequest,
    deleteRolRequest
} from '../api/ApiRol'; // Ajusta la ruta según tu estructura de archivos

// Definición del contexto
const RolContext = createContext();

// Hook personalizado para usar el contexto
export const useRoles = () => useContext(RolContext);

// Proveedor del contexto que envuelve la aplicación
export const RolProvider = ({ children }) => {
    const [roles, setRoles] = useState([]);
    const [errors, setErrors] = useState([]);
    const [permisos, setPermisos] = useState([]);
    // Función para obtener todos los roles
    const fetchPermisos = async () => {
        try {
            const response = await ObtenerTodosLosPermisos();
            setPermisos(response.data);
            setErrors([]); // Limpiar errores en caso de éxito
        } catch (error) {
            handleErrors(error);
        }
    };

    const fetchRoles = async () => {
        try {
            const response = await getAllRolesRequest();
            setRoles(response.data);
            setErrors([]); // Limpiar errores en caso de éxito
        } catch (error) {
            handleErrors(error);
        }
    };

    // Función para crear un rol
    const createRol = async (data) => {
        try {
            console.log("Datos a enviar: ", data)
            const capitalizedData = capitalizeRolData(data);
            const response = await createRolRequest(capitalizedData);
            setRoles([...roles, response.data]);
            setErrors([]); // Limpiar errores en caso de éxito
        } catch (error) {
            handleErrors(error);
        }
    };

    // Función para actualizar un rol
    const updateRol = async (id, data) => {
        try {
            const capitalizedData = capitalizeRolData(data);
            const response = await updateRolRequest(id, capitalizedData);
            fetchPermisos()
            const updatedRoles = roles.map(rol =>
                rol._id === response.data._id ? response.data : rol
            );
            
            setRoles(updatedRoles);
            setErrors([]); // Limpiar errores en caso de éxito
        } catch (error) {
            handleErrors(error);
        }
    };

    // Función para deshabilitar un rol
    const disableRol = async (id) => {
        try {
            const response = await disableRolRequest(id);
            setRoles(roles.map(rol =>
                rol._id === id ? response.data : rol
            ));
            setErrors([]); // Limpiar errores en caso de éxito
        } catch (error) {
            handleErrors(error);
        }
    };

    // Función para eliminar un rol
    const deleteRol = async (id) => {
        try {
            await deleteRolRequest(id);
            const updatedRoles = roles.filter(rol => rol._id !== id);
            setRoles(updatedRoles);
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

    // Cargar roles al montar el componente
    useEffect(() => {
        fetchRoles();
    }, []);

    const capitalizeRolData = (data) => {
        const capitalizedNombre = data.nombre.charAt(0).toUpperCase() + data.nombre.slice(1).toLowerCase();
        return { ...data, nombre: capitalizedNombre };
    };

    return (
        <RolContext.Provider
            value={{
                roles,
                errors,
                createRol,
                updateRol,
                disableRol,
                deleteRol,
                fetchPermisos,
                permisos,
                fetchRoles
            }}
        >
            {children}
        </RolContext.Provider>
    );
};
