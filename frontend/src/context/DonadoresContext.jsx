

import { createContext, useState, useContext, useEffect } from 'react';
import {
    createDonadorRequest,
    updateDonadorRequest,
    getDonadorByIdRequest,
    getAllDonadoresRequest,
    disableDonadorRequest,
    deleteDonadorRequest
} from '../api/ApiDonador'; // Ajusta las importaciones según tu estructura de API

export const DonadorContext = createContext();

export const useDonadores = () => {
    const context = useContext(DonadorContext);
    if (!context) {
        throw new Error('useDonadores must be used within a DonadorProvider');
    }
    return context;
};

export const DonadorProvider = ({ children }) => {
    const [donadores, setDonadores] = useState([]);
    const [selectedDonador, setSelectedDonador] = useState(null);
    const [errors, setErrors] = useState([]);

    const createDonador = async (donador) => {
        try {
            const res = await createDonadorRequest(donador);
            setDonadores([...donadores, res.data]);
            return { success: true };
        } catch (error) {
            const errorMessage = error.response.data?.message || 'An error occurred';
            setErrors([errorMessage]);
            return { success: false, error: errorMessage };
        }
    };

    const updateDonador = async (id, donador) => {
        try {
            const res = await updateDonadorRequest(id, donador);
            setDonadores(donadores.map(d => d._id === id ? res.data : d));
            return { success: true };
        } catch (error) {
            const errorMessage = error.response.data?.message || 'An error occurred';
            setErrors([errorMessage]);
            return { success: false, error: errorMessage };
        }
    };

    const getDonadorById = async (id) => {
        try {
            const res = await getDonadorByIdRequest(id);
            setSelectedDonador(res.data);
        } catch (error) {
            const errorMessage = error.response.data?.message || 'An error occurred';
            setErrors([errorMessage]);
        }
    };

    const getAllDonadores = async () => {
        try {
            const res = await getAllDonadoresRequest();
            setDonadores(res.data);
        } catch (error) {
            const errorMessage = error.response.data?.message || 'An error occurred';
            setErrors([errorMessage]);
        }
    };

    const disableDonador = async (id) => {
        try {
            const res = await disableDonadorRequest(id);
            setDonadores(donadores.map(d => d._id === id ? res.data : d));
            return { success: true };
        } catch (error) {
            const errorMessage = error.response.data?.message || 'An error occurred';
            setErrors([errorMessage]);
            return { success: false, error: errorMessage };
        }
    };

    const deleteDonador = async (id) => {
        try {
            await deleteDonadorRequest(id);
            setDonadores(donadores.filter(d => d._id !== id));
            return { success: true };
        } catch (error) {
            const errorMessage = error.response.data?.message || 'An error occurred';
            setErrors([errorMessage]);
            return { success: false, error: errorMessage };
        }
    };

    useEffect(() => {
        getAllDonadores();
    }, []);

    useEffect(() => {
        if (errors.length > 0) {
            const timer = setTimeout(() => setErrors([]), 3000);
            return () => clearTimeout(timer);
        }
    }, [errors]);

    return (
        <DonadorContext.Provider value={{
            createDonador,
            updateDonador,
            getDonadorById,
            getAllDonadores,
            deleteDonador,
            disableDonador,
            donadores,
            selectedDonador,
            errors
        }}>
            {children}
        </DonadorContext.Provider>
    );
};
