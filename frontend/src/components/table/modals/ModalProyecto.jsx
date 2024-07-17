import React, { useState, useEffect } from 'react';
import { useProyectos } from '../../../context/ProyectosContext';
import { useActividades } from '../../../context/ActividadContext';
import { RiCloseLine, RiDeleteBin6Line, RiAddCircleLine } from 'react-icons/ri';

const ModalProyecto = ({ onClose, item }) => {
    const { createProyecto, updateProyecto } = useProyectos();
    const { actividades } = useActividades();
    const [formData, setFormData] = useState({
        nombre: '',
        descripcion: '',
        fechaInicio: '',
        fechaFin: '',
        estado: 'activo',
        tipo: [],
        direccion: ''
    });

    useEffect(() => {
        if (item) {
            setFormData({
                nombre: item.nombre || '',
                descripcion: item.descripcion || '',
                fechaInicio: item.fechaInicio ? new Date(item.fechaInicio).toISOString().substring(0, 10) : '',
                fechaFin: item.fechaFin ? new Date(item.fechaFin).toISOString().substring(0, 10) : '',
                estado: item.estado || 'activo',
                tipo: item.tipo || [],
                direccion: item.direccion || ''
            });
        }
    }, [item]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));
    };

    const handleActividadChange = (e, index) => {
        const { value } = e.target;
        const updatedTipo = [...formData.tipo];
        updatedTipo[index] = value;
        setFormData(prevState => ({
            ...prevState,
            tipo: updatedTipo
        }));
    };

    const addTipoActividad = () => {
        setFormData(prevState => ({
            ...prevState,
            tipo: [...prevState.tipo, '']
        }));
    };

    const removeTipoActividad = (index) => {
        const updatedTipo = [...formData.tipo];
        updatedTipo.splice(index, 1);
        setFormData(prevState => ({ ...prevState, tipo: updatedTipo }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { nombre, descripcion, fechaInicio, fechaFin, tipo } = formData;
        if (!nombre || !descripcion || !fechaInicio || !fechaFin || tipo.some(tipo => !tipo)) {
            alert('Por favor, complete todos los campos obligatorios.');
            return;
        }

        try {
            if (item && item._id) {
                await updateProyecto(item._id, formData);
            } else {
                await createProyecto(formData);
            }
            onClose();
        } catch (error) {
            console.error('Error saving project:', error.response ? error.response.data : error.message);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-2xl max-w-4xl mx-auto mt-8 mb-8 max-h-[90vh] overflow-y-auto">
            <div className="p-8">
                <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">{item ? 'Editar Proyecto' : 'Agregar Proyecto'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-8">
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
                            <label className="block text-gray-700 text-sm font-medium mb-2">Dirección</label>
                            <input
                                type="text"
                                name="direccion"
                                value={formData.direccion}
                                onChange={handleChange}
                                className="shadow-sm border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-300"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-2">Fecha de Inicio</label>
                            <input
                                type="date"
                                name="fechaInicio"
                                value={formData.fechaInicio}
                                onChange={handleChange}
                                className="shadow-sm border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-300"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-2">Fecha de Fin</label>
                            <input
                                type="date"
                                name="fechaFin"
                                value={formData.fechaFin}
                                onChange={handleChange}
                                className="shadow-sm border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-300"
                                required
                            />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-gray-700 text-sm font-medium mb-2">Descripción</label>
                            <textarea
                                name="descripcion"
                                value={formData.descripcion}
                                onChange={handleChange}
                                className="shadow-sm border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-300"
                                rows="3"
                                required
                            />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-gray-700 text-sm font-medium mb-2">Actividades</label>
                            {formData.tipo.map((tipo, index) => (
                                <div key={index} className="flex items-center mb-2">
                                    <select
                                        value={tipo}
                                        onChange={(e) => handleActividadChange(e, index)}
                                        className="shadow-sm border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-300"
                                        required
                                    >
                                        <option value="">Seleccione una actividad</option>
                                        {actividades && actividades.map(act => (
                                            <option key={act._id} value={act._id}>{act.nombre} - {act.tipo}</option>
                                        ))}
                                    </select>
                                    <button
                                        type="button"
                                        onClick={() => removeTipoActividad(index)}
                                        className="ml-2 bg-gradient-to-r from-red-500 to-red-700 hover:from-red-700 hover:to-red-900 text-white p-2 rounded"
                                    >
                                        <RiDeleteBin6Line />
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={addTipoActividad}
                                className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-700 hover:to-blue-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-2"
                            >
                                <RiAddCircleLine className="inline-block mr-2" /> Agregar Actividad
                            </button>
                        </div>
                    </div>
                    <div className="flex justify-end space-x-4 mt-8">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-gradient-to-r from-red-500 to-red-700 hover:from-red-700 hover:to-red-900 text-white font-bold py-2 px-6 rounded-lg focus:outline-none focus:shadow-outline"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-700 hover:to-blue-900 text-white font-bold py-2 px-6 rounded-lg focus:outline-none focus:shadow-outline"
                        >
                            {item ? 'Actualizar' : 'Agregar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ModalProyecto;
