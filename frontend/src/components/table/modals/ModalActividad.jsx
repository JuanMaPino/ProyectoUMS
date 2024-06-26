import React, { useState, useEffect } from 'react';
import { useActividades } from '../../../context/ActividadContext';
import axios from 'axios';
import { RiCloseLine } from 'react-icons/ri';

const ModalActividad = ({ onClose, item }) => {
    const { createActividad, updateActividad, actividades } = useActividades();
    const [insumos, setInsumos] = useState([]);
    const [tareas, setTareas] = useState([]);
    const [formData, setFormData] = useState({
        id_actividad: '',
        nombre: '',
        fecha: '',
        tipo: 'Recreativa',
        descripcion: '',
        tarea: '',
        insumo: '',
        estado: 'activo'
    });

    const [errors, setErrors] = useState({
        id_actividad: '',
        nombre: '',
        fecha: '',
        descripcion: '',
        tarea: '',
        insumo: ''
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
                id_actividad: item.id_actividad || '',
                nombre: item.nombre || '',
                fecha: item.fecha || '',
                tipo: item.tipo || 'Recreativa',
                descripcion: item.descripcion || '',
                tarea: item.tarea ? item.tarea._id : '',
                insumo: item.insumo ? item.insumo._id : '',
                estado: item.estado || 'activo',
            });
        } else {
            setFormData({
                id_actividad: '',
                nombre: '',
                fecha: '',
                tipo: 'Recreativa',
                descripcion: '',
                tarea: '',
                insumo: '',
                estado: 'activo'
            });
        }
    }, [item]);

    const checkIfExists = (id_actividad) => {
        return actividades.some(actividad => {
            if (actividad.id_actividad && id_actividad) {
                return actividad.id_actividad.toString().toLowerCase().trim() === id_actividad.toString().toLowerCase().trim();
            }
            return false;
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'id_actividad') {
            if (checkIfExists(value)) {
                setErrors(prevState => ({
                    ...prevState,
                    [name]: 'La actividad ya existe.'
                }));
            } else if (/^\d{0,10}$/.test(value)) {
                setErrors(prevState => ({
                    ...prevState,
                    [name]: null
                }));
            } else {
                setErrors(prevState => ({
                    ...prevState,
                    [name]: 'El campo ID debe contener entre 5 y 10 dígitos numéricos.'
                }));
            }
        } else if (name === 'nombre' || name === 'descripcion') {
            if (/^[A-Za-záéíóúüñÁÉÍÓÚÜÑ\s]+$/.test(value)) {
                setErrors(prevState => ({
                    ...prevState,
                    [name]: null
                }));
            } else {
                setErrors(prevState => ({
                    ...prevState,
                    [name]: `El campo ${name} solo permite letras y espacios.`
                }));
            }
        } else {
            setErrors(prevState => ({
                ...prevState,
                [name]: null
            }));
        }

        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationErrors = {};
        if (!formData.id_actividad) validationErrors.id_actividad = 'Este campo es obligatorio';
        else if (!/^\d{5,10}$/.test(formData.id_actividad)) validationErrors.id_actividad = 'El campo ID debe contener entre 5 y 10 dígitos numéricos.';
        if (!formData.nombre) validationErrors.nombre = 'Este campo es obligatorio';
        if (!formData.fecha) validationErrors.fecha = 'Este campo es obligatorio';
        if (!formData.descripcion) validationErrors.descripcion = 'Este campo es obligatorio';
        if (!formData.tarea) validationErrors.tarea = 'Este campo es obligatorio';
        if (!formData.insumo) validationErrors.insumo = 'Este campo es obligatorio';

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            alert('Por favor, corrija los errores antes de enviar.');
            return;
        }

        try {
            if (item && item._id) {
                await updateActividad(item._id, formData);
                alert('Actividad actualizada con éxito');
            } else {
                await createActividad(formData);
                alert('Actividad creada con éxito');
            }
            onClose();
        } catch (error) {
            console.error('Error saving item:', error.response ? error.response.data : error.message);
            alert('Error al guardar la actividad. Por favor, inténtelo de nuevo.');
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-2xl max-w-lg mx-auto mt-8 mb-8">
            <div className="p-8">
                <h2 className="col-span-2 text-3xl font-semibold mb-6 text-center text-gray-800">{item ? 'Editar Actividad' : 'Agregar Actividad'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-8">
                        <div>
                            <div>
                                <label className="block text-gray-700 text-sm font-medium mb-2">Identificación<p className="text-red-500 text-sm">*</p></label>
                                <input
                                    type="text"
                                    name="id_actividad"
                                    value={formData.id_actividad}
                                    onChange={handleChange}
                                    className={`shadow-sm border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-300 ${errors.id_actividad ? 'border-red-500' : ''}`}
                                    required
                                />
                                {errors.id_actividad && <p className="text-red-500 text-sm mt-1">{errors.id_actividad}</p>}
                            </div>
                            <div>
                                <label className="block text-gray-700 text-sm font-medium mb-2">Nombre<p className="text-red-500 text-sm">*</p></label>
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
                                <label className="block text-gray-700 text-sm font-medium mb-2">Fecha<p className="text-red-500 text-sm">*</p></label>
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
                            <div>
                                <label className="block text-gray-700 text-sm font-medium mb-2">Tipo<p className="text-red-500 text-sm">*</p></label>
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
                            <div>
                                <label className="block text-gray-700 text-sm font-medium mb-2">Descripción<p className="text-red-500 text-sm">*</p></label>
                                <textarea
                                    name="descripcion"
                                    value={formData.descripcion}
                                    onChange={handleChange}
                                    className={`shadow-sm border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-300 ${errors.descripcion ? 'border-red-500' : ''}`}
                                    required
                                />
                                {errors.descripcion && <p className="text-red-500 text-sm mt-1">{errors.descripcion}</p>}
                            </div>
                            <div>
                                <label className="block text-gray-700 text-sm font-medium mb-2">Tarea<p className="text-red-500 text-sm">*</p></label>
                                <select
                                    name="tarea"
                                    value={formData.tarea}
                                    onChange={handleChange}
                                    className={`shadow-sm border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-300 ${errors.tarea ? 'border-red-500' : ''}`}
                                    required
                                >
                                    <option value="">Seleccionar tarea</option>
                                    {tareas.map((tarea) => (
                                        <option key={tarea._id} value={tarea._id}>{tarea.nombre}</option>
                                    ))}
                                </select>
                                {errors.tarea && <p className="text-red-500 text-sm mt-1">{errors.tarea}</p>}
                            </div>
                            <div>
                                <label className="block text-gray-700 text-sm font-medium mb-2">Insumo<p className="text-red-500 text-sm">*</p></label>
                                <select
                                    name="insumo"
                                    value={formData.insumo}
                                    onChange={handleChange}
                                    className={`shadow-sm border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-300 ${errors.insumo ? 'border-red-500' : ''}`}
                                    required
                                >
                                    <option value="">Seleccionar insumo</option>
                                    {insumos.map((insumo) => (
                                        <option key={insumo._id} value={insumo._id}>{insumo.nombre}</option>
                                    ))}
                                </select>
                                {errors.insumo && <p className="text-red-500 text-sm mt-1">{errors.insumo}</p>}
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end mt-8">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-red-700 border-2 border-gradient-to-r border-red-400 hover:border-red-600 hover:from-red-600 hover:to-red-700 font-bold py-2 px-6 rounded-lg focus:outline-none focus:shadow-outline mr-2"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-bold py-2 px-6 rounded-lg focus:outline-none focus:shadow-outline"
                        >
                            {item ? 'Actualizar' : 'Agregar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ModalActividad;
