import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FormModal = ({ onClose, item, fetchData }) => {
    const [formData, setFormData] = useState({
        identificacion: '',
        nombre: '',
        telefono: '',
        estado: 'activo'
    });

    useEffect(() => {
        if (item) {
            setFormData(item);
        }
    }, [item]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (item) {
                await axios.put(`http://localhost:3002/beneficiarios/${item._id}`, formData);
            } else {
                await axios.post('http://localhost:3002/beneficiarios', formData);
            }
            fetchData();
            onClose();
        } catch (error) {
            console.error('Error saving item:', error);
        }
    };

    return (
        <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl mb-4">{item ? 'Editar Beneficiario' : 'Agregar Beneficiario'}</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Identificación</label>
                    <input
                        type="text"
                        name="identificacion"
                        value={formData.identificacion}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Nombre</label>
                    <input
                        type="text"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Teléfono</label>
                    <input
                        type="text"
                        name="telefono"
                        value={formData.telefono}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Estado</label>
                    <select
                        name="estado"
                        value={formData.estado}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    >
                        <option value="activo">Activo</option>
                        <option value="inactivo">Inactivo</option>
                    </select>
                </div>
                <div className="flex items-center justify-between">
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        {item ? 'Actualizar' : 'Agregar'}
                    </button>
                    <button
                        type="button"
                        onClick={onClose}
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    );
};

export default FormModal;
