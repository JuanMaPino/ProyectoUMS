import React, { useState, useEffect } from 'react';
import { useRoles } from '../../../context/RolesContext';

const ModalRol = ({ onClose, item }) => {
    const { createRol, updateRol, roles } = useRoles();
    const [formData, setFormData] = useState({
        nombre: '',
        descripcion: '',
        permisos: [],
        estado: 'activo'
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (item) {
            setFormData({
                nombre: item.nombre || '',
                descripcion: item.descripcion || '',
                permisos: item.permisos || [], // Dejamos los permisos como array
                estado: item.estado || 'activo'
            });
        }
    }, [item]);

    const handleValidation = (name, value) => {
        const newErrors = { ...errors };

        switch (name) {
            case 'nombre':
                if (!value) {
                    newErrors.nombre = 'Este campo es obligatorio';
                } else {
                    delete newErrors.nombre;
                }
                break;
            default:
                break;
        }

        setErrors(newErrors);
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (type === 'checkbox') {
            setFormData(prevState => ({
                ...prevState,
                permisos: checked
                    ? [...prevState.permisos, value]
                    : prevState.permisos.filter(permiso => permiso !== value)
            }));
        } else {
            setFormData(prevState => ({
                ...prevState,
                [name]: value
            }));
        }

        handleValidation(name, value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        Object.keys(formData).forEach(key => handleValidation(key, formData[key]));

        if (Object.keys(errors).length > 0) {
            return;
        }

        try {
            const dataToSend = { ...formData }; // No es necesario convertir permisos a string

            if (item && item._id) {
                await updateRol(item._id, dataToSend);
            } else {
                await createRol(dataToSend);
            }
            onClose();
        } catch (error) {
            console.error('Error saving item:', error.response ? error.response.data : error.message);
        }
    };

    const permisosOptions = ['donadores', 'donaciones', 'beneficiarios', 'ayudantes', 'tareas', 'proyectos', 'insumos', 'actividades'];

    return (
        <div className="bg-white rounded-lg shadow-2xl max-w-4xl mx-auto mt-8 mb-8 max-h-[90vh] overflow-y-auto">
            <div className="p-8">
                <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">{item ? 'Editar Rol' : 'Agregar Rol'}</h2>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-gray-700 text-sm font-medium mb-2">Nombre del Rol</label>
                        <input
                            type="text"
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleChange}
                            className={`shadow-sm border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-300 ${errors.nombre ? 'border-red-500' : ''}`}
                            required
                        />
                        {errors.nombre && <p className="text-red-500 text-sm mt-1">{errors.nombre}</p>}
                    </div>
                    <div className="sm:col-span-2">
                        <label className="block text-gray-700 text-sm font-medium mb-2">Descripción</label>
                        <input
                            type="text"
                            name="descripcion"
                            value={formData.descripcion}
                            onChange={handleChange}
                            className="shadow-sm border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-300"
                        />
                    </div>
                    <div className="sm:col-span-2">
                        <label className="block text-gray-700 text-sm font-medium mb-2">Permisos</label>
                        <div className="grid grid-cols-2 gap-4">
                            {permisosOptions.map(permiso => (
                                <div key={permiso} className="flex items-center">
                                    <input
                                        type="checkbox"
                                        name="permisos"
                                        value={permiso}
                                        checked={formData.permisos.includes(permiso)}
                                        onChange={handleChange}
                                        className="mr-2 leading-tight"
                                    />
                                    <span className="text-gray-700">{permiso}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="sm:col-span-2">
                        <div className="flex flex-col justify-center mt-6">
                            <button type="submit" className="bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-700 hover:to-indigo-800 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline">
                                {item ? 'Actualizar Rol' : 'Agregar Rol'}
                            </button>
                            <button
                                type="button"
                                onClick={onClose}
                                className="bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-red-700 border-2  border-gradient-to-r border-red-400  hover:border-red-600 hover:from-red-600 hover:to-red-700  font-bold py-2 px-6 rounded-lg focus:outline-none focus:shadow-outline mt-2"
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ModalRol;
