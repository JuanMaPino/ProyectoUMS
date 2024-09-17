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
    const [messages, setMessages] = useState([]);

    const handleError = (error) => {
        const errorMessage = error.response?.data?.message || 'An error occurred';
        setErrors([errorMessage]);
    };

    const handleResponse = (response) => {
        if (response?.data?.message) {
            setMessages([response.data.message]);
        }
    };

    const createDonador = async (donador) => {
        try {
            console.log("Datos a enviar:", donador);  // Añadir este log
            const res = await createDonadorRequest(donador);
            setDonadores([...donadores, res.data]);
            handleResponse(res);
            return { success: true };
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'An error occurred';
            console.error("Error al crear donador:", error.response?.data || error.message);  // Añadir este log
            setErrors([errorMessage]);
            handleError(error);
            return { success: false, error: errorMessage };
        }
    };
    
    const updateDonador = async (id, donador) => {
        try {
            const res = await updateDonadorRequest(id, donador);
            setDonadores(donadores.map(d => d._id === id ? res.data : d));
            handleResponse(res);
            return { success: true };
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'An error occurred';
            setErrors([errorMessage]);
            handleError(error);
            return { success: false, error: errorMessage };
        }
    };

    const getDonadorById = async (id) => {
        try {
            const res = await getDonadorByIdRequest(id);
            setSelectedDonador(res.data);
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'An error occurred';
            setErrors([errorMessage]);
        }
    };

    const getAllDonadores = async () => {
        try {
            const res = await getAllDonadoresRequest();
            setDonadores(res.data);
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'An error occurred';
            setErrors([errorMessage]);
        }
    };

    const disableDonador = async (id) => {
        try {
            const res = await disableDonadorRequest(id);
            setDonadores(donadores.map(d => d._id === id ? res.data : d));
            handleResponse(res);
            return { success: true };
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'An error occurred';
            setErrors([errorMessage]);
            handleError(error);
            return { success: false, error: errorMessage };
        }
    };
const deleteDonador = async (id) => {
  try {
    await deleteDonadorRequest(id);
    
    setDonadores(donadores.filter(d => d._id !== id));
    setMessages(['Donador eliminado con éxito']);
    return { success: true };
  } catch (error) {
    if(errorMessage === 400 || errorMessage === 500){
     const errorMessage = error.response?.data?.message || 'El donador está en uso';
     console.error("Error al eliminar donador:", errorMessage);
     setErrors([errorMessage]);
    return { success: false, error: errorMessage };
        
    }else if(error != 400){
     const errorMessage = error.response?.data?.error || 'No se puede eliminar el donador';
     console.error("Error al eliminar donador:", errorMessage);

    setErrors([errorMessage]);  
    return { success: true, error: errorMessage };
    
    }
    // Capturando el mensaje de error que viene del backend
    
    // Estableciendo el mensaje de error para ser mostrado en la interfaz
    
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

    useEffect(() => {
        if (messages.length > 0) {
            const timer = setTimeout(() => setMessages([]), 3000);
            return () => clearTimeout(timer);
        }
    }, [messages]);

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
            errors,
            messages
        }}>
            {children}
        </DonadorContext.Provider>
    );
};
