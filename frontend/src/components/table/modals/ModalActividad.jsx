import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ModalActividad = ({ onClose, onSave, item }) => {
    const [formData, setFormData] = useState({
        nombre: '',
        fecha: '',
        tipo: 'Recreativa',
        descripcion: '',
        tareas: [],
        insumos: [],
    });
    const [errors, setErrors] = useState({
        nombre: '',
        fecha: '',
        descripcion: '',
        tareas: '',
        insumos: ''
    });
    const [tareas, setTareas] = useState([]);
    const [insumos, setInsumos] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const tareasResponse = await axios.get('http://localhost:3002/tareas'); // Cambia a tu ruta correcta
                const insumosResponse = await axios.get('http://localhost:3002/insumos'); // Cambia a tu ruta correcta
                setTareas(tareasResponse.data);
                setInsumos(insumosResponse.data);
            } catch (error) {
                console.error('Error al cargar tareas e insumos:', error);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (item) {
            setFormData({
                nombre: item.nombre || '',
                fecha: item.fecha || '',
                tipo: item.tipo || 'Recreativa',
                descripcion: item.descripcion || '',
                tareas: item.tareas ? item.tareas.map(t => ({ _id: t._id, nombre: t.nombre })) : [],
                insumos: item.insumos ? item.insumos.map(i => ({ insumo: i.insumo._id || i.insumo, cantidad: i.cantidad })) : [],
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
        newInsumos[index] = {
            ...newInsumos[index],
            [field]: value
        };
        setFormData(prevState => ({
            ...prevState,
            insumos: newInsumos
        }));
    };

    const handleAddTarea = () => {
        setFormData(prevState => ({
            ...prevState,
            tareas: [...prevState.tareas, {}]
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
            insumos: [...prevState.insumos, {}]
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
        if (!formData.fecha) validationErrors.fecha = 'Este campo es obligatorio';
        if (!formData.descripcion) validationErrors.descripcion = 'Este campo es obligatorio';
        if (formData.tareas.length === 0 || formData.tareas.some(t => !t._id)) validationErrors.tareas = 'Debe agregar al menos una tarea válida';
        if (formData.insumos.length === 0 || formData.insumos.some(i => !i.insumo || !i.cantidad)) validationErrors.insumos = 'Debe agregar al menos un insumo válido';
    
        setErrors(validationErrors);
    
        if (Object.keys(validationErrors).length === 0) {
            try {
                if (item && item._id) {
                    await axios.put(`http://localhost:3002/actividades/${item._id}`, formData);
                    alert('Actividad actualizada exitosamente');
                } else {
                    await axios.post('http://localhost:3002/actividades', formData);
                    alert('Actividad creada exitosamente');
                }
    
                // Llama a onSave solo si es una función
                if (typeof onSave === 'function') {
                    onSave();
                } else {
                    console.error('Error: onSave no es una función válida');
                }
    
                onClose();
            } catch (error) {
                console.error('Error al guardar la actividad:', error);
                alert('Error al guardar la actividad. Por favor, inténtelo de nuevo.');
            }
        }
    };
    return (
        <div className="bg-white rounded-lg shadow-2xl max-w-lg mx-auto mt-8 mb-8">
            <div className="p-8">
                <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">{item ? 'Editar Actividad' : 'Agregar Actividad'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-8">
                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-2">Nombre <span className="text-red-500">*</span></label>
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
                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-2">Fecha <span className="text-red-500">*</span></label>
                            <input
                                type="date"
                                name="fecha"
                                value={formData.fecha}
                                onChange={handleChange}
                                className={`shadow-sm border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-300 ${errors.fecha ? 'border-red-500' : ''}`}
                                required
                            />
                            {errors.fecha && <p className="text-red-500 text-sm mt-1">{errors.fecha}</p>}
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-8">
                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-2">Tipo</label>
                            <select
                                name="tipo"
                                value={formData.tipo}
                                onChange={handleChange}
                                className="shadow-sm border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-300"
                            >
                                <option value="Recreativa">Recreativa</option>
                                <option value="Caritativa">Caritativa</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-medium mb-2">Descripción <span className="text-red-500">*</span></label>
                        <textarea
                            name="descripcion"
                            value={formData.descripcion}
                            onChange={handleChange}
                            rows="3"
                            className={`shadow-sm border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-300 resize-none ${errors.descripcion ? 'border-red-500' : ''}`}
                            required
                        />
                        {errors.descripcion && <p className="text-red-500 text-sm mt-1">{errors.descripcion}</p>}
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-medium mb-2">Tareas <span className="text-red-500">*</span></label>
                        {formData.tareas.map((tarea, index) => (
                            <div key={index} className="flex items-center space-x-4 mb-2">
                                <select
                                    value={tarea._id || ''}
                                    onChange={(e) => handleTareaChange(index, e)}
                                    className={`shadow-sm border rounded w-3/4 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-300 ${errors.tareas ? 'border-red-500' : ''}`}
                                >
                                    <option value="">Seleccionar tarea</option>
                                    {tareas.map(t => (
                                        <option key={t._id} value={t._id}>{t.nombre}</option>
                                    ))}
                                </select>
                                <button
                                    type="button"
                                    onClick={() => handleRemoveTarea(index)}
                                    className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded focus:outline-none focus:ring focus:border-blue-300"
                                >
                                    Eliminar
                                </button>
                            </div>
                        ))}
                        {errors.tareas && <p className="text-red-500 text-sm mt-1">{errors.tareas}</p>}
                        <button
                            type="button"
                            onClick={handleAddTarea}
                            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded focus:outline-none focus:ring focus:border-blue-300"
                        >
                            Agregar Tarea
                        </button>
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-medium mb-2">Insumos <span className="text-red-500">*</span></label>
                        {formData.insumos.map((insumo, index) => (
                            <div key={index} className="flex items-center space-x-4 mb-2">
                                <select
                                    value={insumo.insumo || ''}
                                    onChange={(e) => handleInsumoChange(index, 'insumo', e.target.value)}
                                    className={`shadow-sm border rounded w-3/4 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-300 ${errors.insumos ? 'border-red-500' : ''}`}
                                >
                                    <option value="">Seleccionar insumo</option>
                                    {insumos.map(i => (
                                        <option key={i._id} value={i._id}>{i.nombre}</option>
                                    ))}
                                </select>
                                <input
                                    type="number"
                                    value={insumo.cantidad || ''}
                                    onChange={(e) => handleInsumoChange(index, 'cantidad', e.target.value)}
                                    className={`shadow-sm border rounded w-1/4 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-300 ${errors.insumos ? 'border-red-500' : ''}`}
                                    placeholder="Cantidad"
                                />
                                <button
                                    type="button"
                                    onClick={() => handleRemoveInsumo(index)}
                                    className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded focus:outline-none focus:ring focus:border-blue-300"
                                >
                                    Eliminar
                                </button>
                            </div>
                        ))}
                        {errors.insumos && <p className="text-red-500 text-sm mt-1">{errors.insumos}</p>}
                        <button
                            type="button"
                            onClick={handleAddInsumo}
                            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded focus:outline-none focus:ring focus:border-blue-300"
                        >
                            Agregar Insumo
                        </button>
                    </div>
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded focus:outline-none focus:ring focus:border-blue-300"
                        >
                            Guardar
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-gray-400 hover:bg-gray-500 text-white py-2 px-4 rounded ml-2 focus:outline-none focus:ring focus:border-blue-300"
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ModalActividad;
