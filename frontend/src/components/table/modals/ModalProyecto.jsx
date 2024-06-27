import React, { useState, useEffect } from 'react';
import { useProjects } from '../../../context/ProyectosContext';
import { useActividades } from '../../../context/ActividadContext';

const ModalProyecto = ({ onClose, item }) => {
    const { createProject, updateProject } = useProjects();
    const { actividades } = useActividades();
    const [formData, setFormData] = useState({
        nombre: '',
        descripcion: '',
        fechaInicio: '',
        fechaFin: '',
        estado: 'activo',
        tipoActividad: ''  // Nuevo campo para el tipo de actividad
    });

    useEffect(() => {
        if (item) {
            setFormData({
                nombre: item.nombre || '',
                descripcion: item.descripcion || '',
                fechaInicio: item.fechaInicio ? new Date(item.fechaInicio).toISOString().substring(0, 10) : '',
                fechaFin: item.fechaFin ? new Date(item.fechaFin).toISOString().substring(0, 10) : '',
                estado: item.estado || 'activo',
                tipoActividad: item.tipoActividad || ''  // Asignar el tipo de actividad si existe en el item
            });
        } else {
            setFormData({
                nombre: '',
                descripcion: '',
                fechaInicio: '',
                fechaFin: '',
                estado: 'activo',
                tipoActividad: ''  // Inicializar el tipo de actividad en blanco para nuevos proyectos
            });
        }
    }, [item]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validar datos antes de enviar
        const { nombre, descripcion, fechaInicio, fechaFin, tipoActividad } = formData;
        if (!nombre || !descripcion || !fechaInicio || !fechaFin || !tipoActividad) {
            alert('Por favor, complete todos los campos obligatorios.');
            return;
        }

        try {
            if (item && item._id) {
                await updateProject(item._id, formData);
            } else {
                await createProject(formData);
            }
            onClose();
        } catch (error) {
            console.error('Error saving project:', error.response ? error.response.data : error.message);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-2xl max-w-lg mx-auto mt-8 mb-8">
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
                            <label className="block text-gray-700 text-sm font-medium mb-2">Descripción</label>
                            <input
                                type="text"
                                name="descripcion"
                                value={formData.descripcion}
                                onChange={handleChange}
                                className="shadow-sm border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-300"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-2">Tipo de Actividad</label>
                            <select
                                name="tipoActividad"
                                value={formData.tipoActividad}
                                onChange={handleChange}
                                className="shadow-sm border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-300"
                                required
                            >
                                <option value="">Seleccione un tipo de actividad</option>
                                {actividades && actividades.map(tipo => (
                                    <option key={tipo._id} value={tipo._id}>{tipo.tipo}</option>
                                ))}
                            </select>
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
                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-2">Estado</label>
                            <select
                                name="estado"
                                value={formData.estado}
                                onChange={handleChange}
                                className="shadow-sm border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-300"
                            >
                                <option value="activo">Activo</option>
                                <option value="inactivo">Inactivo</option>
                            </select>
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
