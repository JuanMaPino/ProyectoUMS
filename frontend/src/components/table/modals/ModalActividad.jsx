import React, { useState, useEffect } from 'react';
import { useActividades } from '../../../context/ActividadContext';
import axios from 'axios';
import { showToast } from '../../table/alertFunctions'; // Ajusta la ruta según tu estructura

const ModalActividad = ({ onClose, item }) => {
    const { createActividad, updateActividad } = useActividades();
    const [insumos, setInsumos] = useState([]);
    const [tareas, setTareas] = useState([]);
    const [formData, setFormData] = useState({
        nombre: '',
        tipo: 'Recreativa',
        descripcion: '',
        tareas: [],
        insumos: [],
        estado: 'activo'
    });

    const [errors, setErrors] = useState({
        nombre: '',
        descripcion: '',
        tareas: '',
        insumos: ''
    });

    useEffect(() => {
        const fetchInsumos = async () => {
            try {
                const response = await axios.get('http://localhost:3002/insumos');
                setInsumos(response.data);
            } catch (error) {
                console.error('Error fetching insumos:', error.message);
            }
        };

        const fetchTareas = async () => {
            try {
                const response = await axios.get('http://localhost:3002/tareas');
                setTareas(response.data);
            } catch (error) {
                console.error('Error fetching tareas:', error.message);
            }
        };

        fetchInsumos();
        fetchTareas();

        if (item) {
            setFormData({
                nombre: item.nombre || '',
                tipo: item.tipo || 'Recreativa',
                descripcion: item.descripcion || '',
                tareas: item.tareas ? item.tareas.map(t => ({ _id: t._id, nombre: t.nombre })) : [],
                insumos: item.insumos ? item.insumos.map(i => ({ insumo: i.insumo._id || i.insumo, cantidad: i.cantidad })) : [],
                estado: item.estado || 'activo',
            });
        }
    }, [item]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'nombre' || name === 'descripcion') {
            if (/^[A-Za-záéíóúüñÁÉÍÓÚÜÑ\s]+$/.test(value)) {
                setErrors(prevState => ({
                    ...prevState,
                    [name]: ''
                }));
            } else {
                setErrors(prevState => ({
                    ...prevState,
                    [name]: `El campo ${name} solo permite letras y espacios.`
                }));
            }
        }

        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleTareaChange = (index, e) => {
        const { value } = e.target;
        const selectedTarea = tareas.find(t => t._id === value);
        const newTareas = [...formData.tareas];
        newTareas[index] = selectedTarea ? { _id: selectedTarea._id, nombre: selectedTarea.nombre } : {};
        setFormData(prevState => ({
            ...prevState,
            tareas: newTareas
        }));
    };

    const handleInsumoChange = (index, field, value) => {
        const newInsumos = [...formData.insumos];
        if (field === 'insumo') {
            const selectedInsumo = insumos.find(i => i._id === value);
            newInsumos[index] = {
                ...newInsumos[index],
                insumo: value,
                nombre: selectedInsumo ? selectedInsumo.nombre : ''
            };
        } else {
            newInsumos[index] = {
                ...newInsumos[index],
                [field]: value
            };
        }
        setFormData(prevState => ({
            ...prevState,
            insumos: newInsumos
        }));
    };


    const handleAddTarea = () => {
        setFormData(prevState => ({
            ...prevState,
            tareas: [...prevState.tareas, { _id: '', nombre: '' }]
        }));
    };

    const handleRemoveTarea = (index) => {
        const newTareas = formData.tareas.filter((_, i) => i !== index);
        setFormData(prevState => ({
            ...prevState,
            tareas: newTareas
        }));
    };

    const handleAddInsumo = () => {
        setFormData(prevState => ({
            ...prevState,
            insumos: [...prevState.insumos, { insumo: '', cantidad: '' }]
        }));
    };

    const handleRemoveInsumo = (index) => {
        const newInsumos = formData.insumos.filter((_, i) => i !== index);
        setFormData(prevState => ({
            ...prevState,
            insumos: newInsumos
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationErrors = {};
        if (!formData.nombre) validationErrors.nombre = 'Este campo es obligatorio';
        if (!formData.descripcion) validationErrors.descripcion = 'Este campo es obligatorio';
        if (formData.tareas.length === 0 || formData.tareas.some(t => !t._id)) validationErrors.tareas = 'Debe agregar al menos una tarea válida';
        if (formData.insumos.length === 0 || formData.insumos.some(i => !i.insumo || !i.cantidad)) validationErrors.insumos = 'Debe agregar al menos un insumo válido';

        setErrors(validationErrors);

        if (Object.keys(validationErrors).length === 0) {
            try {
                const updatedFormData = {
                    ...formData,
                    insumos: formData.insumos.map(i => ({
                        insumo: i.insumo,
                        nombre: insumos.find(ins => ins._id === i.insumo)?.nombre || '',
                        cantidad: i.cantidad
                    }))
                };

                if (item && item._id) {
                    await updateActividad(item._id, updatedFormData);
                    showToast('Actividad actualizada con éxito.', 'success');
                } else {
                    await createActividad(updatedFormData);
                    showToast('Actividad creada con éxito.', 'success');
                }
                onClose();
            } catch (error) {
                console.error('Error saving item:', error.response ? error.response.data : error.message);
                showToast('Error al guardar la actividad. Por favor, inténtelo de nuevo.', 'error');
            }
        } else {
            console.log('Validation errors:', validationErrors);
        }
    };


    return (
        <div className="bg-white  rounded-lg shadow-2xl max-w-4xl mx-auto mt-8 mb-8 max-h-[90vh] overflow-y-auto">
            <div className="p-8">
                <h2 className="col-span-2 text-3xl font-semibold mb-6 text-center text-gray-800">{item ? 'Editar Actividad' : 'Agregar Actividad'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-8">
                        <div>
                            <div>
                                <label className="block text-gray-700 text-sm font-medium mb-2">Nombre<span className="text-red-500 text-sm">*</span></label>
                                <input
                                    type="text"
                                    name="nombre"
                                    value={formData.nombre}
                                    onChange={handleChange}
                                    className={`shadow-sm border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-300 ${errors.nombre ? 'border-red-500' : ''}`}
                                    required
                                />
                                {errors.nombre && <span className="text-red-500 text-sm mt-1">{errors.nombre}</span>}
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-8">
                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-2">Tipo<span className="text-red-500 text-sm">*</span></label>
                            <select
                                name="tipo"
                                value={formData.tipo}
                                onChange={handleChange}
                                className="shadow-sm border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-300"
                                required
                            >
                                <option value="Recreativa">Recreativa</option>
                                <option value="Caritativa">Caritativa</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-medium mb-2">Descripción<span className="text-red-500 text-sm">*</span></label>
                        <textarea
                            name="descripcion"
                            value={formData.descripcion}
                            onChange={handleChange}
                            className={`shadow-sm border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-300 ${errors.descripcion ? 'border-red-500' : ''}`}
                            rows="3"
                            required
                        />
                        {errors.descripcion && <span className="text-red-500 text-sm mt-1">{errors.descripcion}</span>}
                    </div>
                    <div>
                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-2">Tareas<span className="text-red-500 text-sm">*</span></label>
                            {formData.tareas.map((tarea, index) => (
                                <div key={index} className="flex items-center space-x-2">
                                    <select
                                        value={tarea._id}
                                        
                                        onChange={(e) => handleTareaChange(index, e)}
                                        className={`shadow-sm border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-300 ${errors.tareas ? 'border-red-500' : ''}`}
                                        required
                                    >
                                        <option value="">Selecciona una tarea</option>
                                        {tareas.map(t => (
                                            <option key={t._id} value={t._id}>{t.nombre}</option>
                                        ))}
                                    </select>
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveTarea(index)}
                                        className="bg-gradient-to-r from-red-500 to-red-700 hover:from-red-700 hover:to-red-900 text-white py-2 px-4 rounded focus:outline-none focus:ring focus:border-blue-300"
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            ))}
                            {errors.tareas && <p className="text-red-500 text-sm mt-1">{errors.tareas}</p>}
                            <button
                                type="button"
                                onClick={handleAddTarea}
                                className="bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-700 hover:to-indigo-800 text-white py-2 px-4 rounded focus:outline-none focus:ring focus:border-blue-300 mt-2"
                            >
                                Agregar Tarea
                            </button>
                        </div>
                    </div>
                    <div>
                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-2">Insumos<span className="text-red-500 text-sm">*</span></label>
                            {formData.insumos.map((insumo, index) => (
                                <div key={index} className="flex items-center space-x-2">
                                    <select
                                        value={insumo.insumo}
                                        onChange={(e) => handleInsumoChange(index, 'insumo', e.target.value)}
                                        className={`shadow-sm border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-300 ${errors.insumos ? 'border-red-500' : ''}`}
                                        required
                                    >
                                        <option value="">Selecciona un insumo</option>
                                        {insumos.map(i => (
                                            <option key={i._id} value={i._id}>{i.nombre}</option>
                                        ))}
                                    </select>
                                    <input
                                        type="number"
                                        value={insumo.cantidad}
                                        onChange={(e) => handleInsumoChange(index, 'cantidad', e.target.value)}
                                        className={`shadow-sm border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-300 ${errors.insumos ? 'border-red-500' : ''}`}
                                        placeholder="Cantidad"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveInsumo(index)}
                                        className="bg-gradient-to-r from-red-500 to-red-700 hover:from-red-700 hover:to-red-900 text-white py-2 px-4 rounded focus:outline-none focus:ring focus:border-blue-300"
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            ))}
                            {errors.insumos && <span className="text-red-500 text-sm mt-1">{errors.insumos}</span>}
                            <button
                                type="button"
                                onClick={handleAddInsumo}
                                className="bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-700 hover:to-indigo-800 text-white py-2 px-4 rounded focus:outline-none focus:ring focus:border-blue-300 mt-2"
                            >
                                Agregar Insumo
                            </button>
                        </div>
                    </div>
                    <div className="sm:col-span-2">
                        <div className="flex flex-col justify-center mt-6">
                            <button type="submit" className="bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-700 hover:to-indigo-800 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline">
                                {item ? 'Actualizar Actividad' : 'Agregar Actividad'}
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

export default ModalActividad;
