import React, { useState, useEffect } from 'react';
import { useTareas } from '../../../context/TareasContext';
import axios from 'axios';

const ModalTarea = ({ onClose, item }) => {
    const { createTarea, updateTarea } = useTareas();
    const [formData, setFormData] = useState({
        nombre: '',
        accion: '',
        cantidadHoras: '',
        fecha: '',
        estado: 'activo',
        ayudante: '',
        nombreAyudante: '',
        rolAyudante: ''
    });
    const [ayudantes, setAyudantes] = useState([]);

    useEffect(() => {
        // Fetch ayudantes when the modal is opened
        const fetchAyudantes = async () => {
            try {
                const response = await axios.get('http://localhost:3002/ayudantes');
                setAyudantes(response.data);
            } catch (error) {
                console.error('Error fetching ayudantes:', error.message);
            }
        };

        fetchAyudantes();

        if (item) {
            setFormData({
                nombre: item.nombre || '',
                accion: item.accion || '',
                cantidadHoras: item.cantidadHoras || '',
                fecha: item.fecha || '',
                estado: item.estado || 'activo',
                ayudante: item.ayudante?._id || '',
                nombreAyudante: item.ayudante?.nombre || '',
                rolAyudante: item.ayudante?.rol || ''
            });
        }
    }, [item]);

    const handleAyudanteChange = (e) => {
        const ayudanteId = e.target.value;
        const selectedAyudante = ayudantes.find(a => a._id === ayudanteId);
        setFormData(prevState => ({
            ...prevState,
            ayudante: ayudanteId,
            nombreAyudante: selectedAyudante ? selectedAyudante.nombre : '',
            rolAyudante: selectedAyudante ? selectedAyudante.rol : ''
        }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (item && item._id) {
                await updateTarea(item._id, formData);
            } else {
                await createTarea(formData);
            }
            onClose();
        } catch (error) {
            console.error('Error saving task:', error.message);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-2xl max-w-lg mx-auto mt-8 mb-1">
            <div className="p-8 flex gap-8">
                {/* Columna izquierda */}
                <div className="flex-1">
                    <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">
                        {item ? 'Editar Tarea' : 'Agregar Tarea'}
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-2">Nombre</label>
                            <input
                                type="text"
                                name="nombre"
                                value={formData.nombre}
                                onChange={handleChange}
                                className="shadow-sm border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-300"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-2">Acción</label>
                            <input
                                type="text"
                                name="accion"
                                value={formData.accion}
                                onChange={handleChange}
                                className="shadow-sm border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-300"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-2">Cantidad de Horas</label>
                            <input
                                type="number"
                                name="cantidadHoras"
                                value={formData.cantidadHoras}
                                onChange={handleChange}
                                className="shadow-sm border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-300"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-2">Fecha</label>
                            <input
                                type="date"
                                name="fecha"
                                value={formData.fecha}
                                onChange={handleChange}
                                className="shadow-sm border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-300"
                                required
                            />
                        </div>
                    </form>
                </div>
                {/* Columna derecha */}
                <div className="flex-1">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-2">Ayudante</label>
                            <select
                                name="ayudante"
                                value={formData.ayudante}
                                onChange={handleAyudanteChange}
                                className="shadow-sm border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-300"
                                required
                            >
                                <option value="">Seleccionar Ayudante</option>
                                {ayudantes.map(a => (
                                    <option key={a._id} value={a._id}>
                                        {a.identificacion} - {a.nombre}
                                    </option>
                                ))}
                            </select>
                        </div>
                        {formData.ayudante && (
                            <>
                                <div>
                                    <label className="block text-gray-700 text-sm font-medium mb-2">Nombre del Ayudante</label>
                                    <input
                                        type="text"
                                        name="nombreAyudante"
                                        value={formData.nombreAyudante}
                                        readOnly
                                        className="shadow-sm border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-300 bg-gray-100"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 text-sm font-medium mb-2">Rol del Ayudante</label>
                                    <input
                                        type="text"
                                        name="rolAyudante"
                                        value={formData.rolAyudante}
                                        readOnly
                                        className="shadow-sm border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-300 bg-gray-100"
                                    />
                                </div>
                            </>
                        )}
                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-2">Estado</label>
                            <select
                                name="estado"
                                value={formData.estado}
                                onChange={handleChange}
                                className="shadow-sm border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-300"
                                required
                            >
                                <option value="activo">Activo</option>
                                <option value="inactivo">Inactivo</option>
                            </select>
                        </div>
                        <div className="flex justify-between mt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="bg-red-500 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            >
                                {item ? 'Actualizar' : 'Agregar'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ModalTarea;
