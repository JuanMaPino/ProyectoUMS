import { createContext, useState, useContext, useEffect } from 'react';
import {
    createProjectRequest,
    updateProjectRequest,
    getProjectByIdRequest,
    getAllProjectsRequest,
    disableProjectRequest,
    getProjectByCodigoRequest,
    deleteProjectRequest // Agregado para la eliminación de proyecto
} from '../api/ApiProyectos';

export const ProjectContext = createContext();

export const useProjects = () => {
    const context = useContext(ProjectContext);
    if (!context) {
        throw new Error('useProjects must be used within a ProjectProvider');
    }
    return context;
};

export const ProjectProvider = ({ children }) => {
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [errors, setErrors] = useState([]);

    const createProject = async (project) => {
        try {
            const res = await createProjectRequest(project);
            setProjects([...projects, res.data]);
            return { success: true };
        } catch (error) {
            const errorMessage = error.response.data?.message || 'An error occurred';
            setErrors([errorMessage]);
            return { success: false, error: errorMessage };
        }
    };

    const updateProject = async (id, project) => {
        try {
            const res = await updateProjectRequest(id, project);
            setProjects(projects.map(p => p._id === id ? res.data : p));
        } catch (error) {
            setErrors(error.response.data);
        }
    };

    const getProjectById = async (id) => {
        try {
            const res = await getProjectByIdRequest(id);
            setSelectedProject(res.data);
        } catch (error) {
            setErrors(error.response.data);
        }
    };

    const getAllProjects = async () => {
        try {
            const res = await getAllProjectsRequest();
            setProjects(res.data);
        } catch (error) {
            setErrors(error.response.data);
        }
    };

    const disableProject = async (id) => {
        try {
            const res = await disableProjectRequest(id);
            setProjects(projects.map(p => p._id === id ? res.data : p));
        } catch (error) {
            setErrors(error.response.data);
        }
    };

    const deleteProject = async (id) => {
        try {
            await deleteProjectRequest(id);
            setProjects(projects.filter(p => p._id !== id));
        } catch (error) {
            setErrors(error.response.data);
        }
    };

    const getProjectByCodigo = async (codigo) => {
        try {
            const res = await getProjectByCodigoRequest(codigo);
            setSelectedProject(res.data);
        } catch (error) {
            setErrors(error.response.data);
        }
    };

    useEffect(() => {
        getAllProjects();
    }, []);

    useEffect(() => {
        if (errors.length > 0) {
            const timer = setTimeout(() => setErrors([]), 3000);
            return () => clearTimeout(timer);
        }
    }, [errors]);

    return (
        <ProjectContext.Provider value={{
            createProject,
            updateProject,
            getProjectById,
            getAllProjects,
            deleteProject, // Agregado para la eliminación de proyecto
            disableProject,
            getProjectByCodigo,
            projects,
            selectedProject,
            errors
        }}>
            {children}
        </ProjectContext.Provider>
    );
};
