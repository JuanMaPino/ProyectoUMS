import React, { useState, useEffect } from 'react';
import { useProyectos } from '../../../context/ProyectosContext';
import { useActividades } from '../../../context/ActividadContext';
import { RiCloseLine, RiDeleteBin6Line, RiAddCircleLine } from 'react-icons/ri';
import { showToast } from '../../table/alertFunctions'; // Ajusta la ruta según tu estructura

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
    const [errors, setErrors] = useState({});

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

    const validateField = (name, value) => {
        let error = '';
        switch (name) {
            case 'nombre':
                if (!value) {
                    error = 'El nombre es obligatorio';
                } else if (!/^[a-zA-Z\s]+$/.test(value)) {
                    error = 'El nombre solo debe contener letras y espacios';
                }
                break;
            case 'descripcion':
                if (!value) {
                    error = 'La descripción es obligatoria';
                } else if (value.length < 10) {
                    error = 'La descripción debe tener al menos 10 caracteres';
                }
                break;
            case 'fechaInicio':
                if (!value) {
                    error = 'La fecha de inicio es obligatoria';
                }
                break;
            case 'fechaFin':
                if (!value) {
                    error = 'La fecha de fin es obligatoria';
                } else if (new Date(value) <= new Date(formData.fechaInicio)) {
                    error = 'La fecha de fin debe ser posterior a la fecha de inicio';
                }
                break;
            case 'direccion':
                if (!value) {
                    error = 'La dirección es obligatoria';
                } else if (value.length < 5) {
                    error = 'La dirección debe tener al menos 5 caracteres';
                }
                break;
            default:
                break;
        }
        setErrors(prevState => ({ ...prevState, [name]: error }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));
        validateField(name, value);
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

        const hasErrors = Object.values(errors).some(error => error);
        if (hasErrors) {
            console.error('Validation errors:', errors);
            return;
        }

        try {
            if (item && item._id) {
                await updateProyecto(item._id, formData);
                showToast('Proyecto actualizado correctamente.', 'success');
            } else {
                await createProyecto(formData);
                showToast('Proyecto creado correctamente.', 'success');
            }
            onClose();
        } catch (error) {
            console.error('Error saving project:', error.response ? error.response.data : error.message);
            showToast('Error al guardar el proyecto.', 'error');
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
                                className={`shadow-sm border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-300 ${errors.nombre ? 'border-red-500' : ''}`}
                                required
                            />
                            {errors.nombre && <p className="text-red-500 text-sm">{errors.nombre}</p>}
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-2">Dirección</label>
                            <input
                                type="text"
                                name="direccion"
                                value={formData.direccion}
                                onChange={handleChange}
                                className={`shadow-sm border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-300 ${errors.direccion ? 'border-red-500' : ''}`}
                                required
                            />
                            {errors.direccion && <p className="text-red-500 text-sm">{errors.direccion}</p>}
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-2">Fecha de Inicio</label>
                            <input
                                type="date"
                                name="fechaInicio"
                                value={formData.fechaInicio}
                                onChange={handleChange}
                                className={`shadow-sm border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-300 ${errors.fechaInicio ? 'border-red-500' : ''}`}
                                required
                            />
                            {errors.fechaInicio && <p className="text-red-500 text-sm">{errors.fechaInicio}</p>}
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-2">Fecha de Fin</label>
                            <input
                                type="date"
                                name="fechaFin"
                                value={formData.fechaFin}
                                onChange={handleChange}
                                className={`shadow-sm border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-300 ${errors.fechaFin ? 'border-red-500' : ''}`}
                                required
                            />
                            {errors.fechaFin && <p className="text-red-500 text-sm">{errors.fechaFin}</p>}
                        </div>
                        <div className="col-span-2">
                            <label className="block text-gray-700 text-sm font-medium mb-2">Descripción</label>
                            <textarea
                                name="descripcion"
                                value={formData.descripcion}
                                onChange={handleChange}
                                className={`shadow-sm border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-300 ${errors.descripcion ? 'border-red-500' : ''}`}
                                rows="3"
                                required
                            />
                            {errors.descripcion && <p className="text-red-500 text-sm">{errors.descripcion}</p>}
                        </div>
                        <div className="col-span-2">
                            <label className="block text-gray-700 text-sm font-medium mb-2">Actividades</label>
                            {formData.tipo.map((tipo, index) => (
                                <div key={index} className="flex items-center mb-2">
                                    <select
                                        value={tipo}
                                        onChange={(e) => handleActividadChange(e, index)}
                                        className={`shadow-sm border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-300 ${errors.tipo && errors.tipo[index] ? 'border-red-500' : ''}`}
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
                                className="flex items-center bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-700 hover:to-blue-900 text-white px-3 py-2 rounded"
                            >
                                <RiAddCircleLine className="mr-2" /> Agregar Actividad
                            </button>
                        </div>
                    </div>
                    <div className="flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="bg-gradient-to-r from-green-500 to-green-700 hover:from-green-700 hover:to-green-900 text-white px-4 py-2 rounded"
                        >
                            {item ? 'Actualizar' : 'Guardar'}
                        </button>
                    </div>
                </form>
            </div>
            <button
                type="button"
                onClick={onClose}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 focus:outline-none"
            >
                <RiCloseLine className="text-2xl" />
            </button>
        </div>
    );
};

export default ModalProyecto;
