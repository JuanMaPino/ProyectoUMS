import React, { useState, useEffect } from 'react';
import { useActividades } from '../../../context/ActividadContext';
import { RiCloseLine } from 'react-icons/ri';

const ModalActividad = ({ onClose, item }) => {
    const { createActividad, updateActividad } = useActividades();
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
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (item) {
            setFormData({
                id_actividad: item.id_actividad || '',
                nombre: item.nombre || '',
                fecha: item.fecha || '',
                tipo: item.tipo || 'Recreativa',
                descripcion: item.descripcion || '',
                tarea: item.tarea || '',
                insumo: item.insumo || '',
                estado: item.estado || 'activo'
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

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'id_actividad') {
            // Validación de longitud y solo números en el campo ID
            if (/^\d{0,10}$/.test(value)) {
                setErrors(prevState => ({
                    ...prevState,
                    [name]: null
                }));
                setFormData(prevState => ({
                    ...prevState,
                    [name]: value
                }));
            } else {
                setErrors(prevState => ({
                    ...prevState,
                    [name]: 'El campo ID debe contener entre 5 y 10 dígitos numéricos.'
                }));
            }
        } else if (name === 'nombre' || name === 'descripcion') {
            // Validación de solo letras en campos nombre y descripción
            if (/^[A-Za-záéíóúüñÁÉÍÓÚÜÑ\s]+$/.test(value)) {
                setErrors(prevState => ({
                    ...prevState,
                    [name]: null
                }));
                setFormData(prevState => ({
                    ...prevState,
                    [name]: value
                }));
            } else {
                setErrors(prevState => ({
                    ...prevState,
                    [name]: `El campo ${name} solo permite letras y espacios.`
                }));
            }
        } else {
            setFormData(prevState => ({
                ...prevState,
                [name]: value
            }));
            setErrors(prevState => ({
                ...prevState,
                [name]: null
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validaciones
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
            return;
        }

        try {
            if (item && item._id) {
                await updateActividad(item._id, formData);
            } else {
                await createActividad(formData);
            }
            onClose();
        } catch (error) {
            console.error('Error saving item:', error.response ? error.response.data : error.message);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-2xl max-w-lg mx-auto mt-8 mb-8">
            <div className="p-8 flex gap-8">
                <div className="flex-1">
                    <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">{item ? 'Editar Actividad' : 'Agregar Actividad'}</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
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
                    </form>
                </div>
                <div className="flex-1">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-2">Descripción<p className="text-red-500 text-sm">*</p></label>
                            <textarea
                                name="descripcion"
                                value={formData.descripcion}
                                onChange={handleChange}
                                rows="4"
                                className={`shadow-sm border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-300 ${errors.descripcion ? 'border-red-500' : ''}`}
                                required
                            />
                            {errors.descripcion && <p className="text-red-500 text-sm mt-1">{errors.descripcion}</p>}
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-2">Tarea<p className="text-red-500 text-sm">*</p></label>
                            <input
                                type="text"
                                name="tarea"
                                value={formData.tarea}
                                onChange={handleChange}
                                className={`shadow-sm border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-300 ${errors.tarea ? 'border-red-500' : ''}`}
                                required
                            />
                            {errors.tarea && <p className="text-red-500 text-sm mt-1">{errors.tarea}</p>}
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-2">Insumo<p className="text-red-500 text-sm">*</p></label>
                            <input
                                type="text"
                                name="insumo"
                                value={formData.insumo}
                                onChange={handleChange}
                                className={`shadow-sm border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-300 ${errors.insumo ? 'border-red-500' : ''}`}
                                required
                            />
                            {errors.insumo && <p className="text-red-500 text-sm mt-1">{errors.insumo}</p>}
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
                        <div className="flex justify-end space-x-4">
                            <button
                                type="submit"
                                className="bg-gradient-to-r from-blue-200 to-blue-500 hover:from-blue-300  hover:to-blue-700 text-white font-bold py-2 px-6 rounded-lg focus:outline-none focus:shadow-outline"
                            >
                                {item ? 'Actualizar' : 'Agregar'}
                            </button>
                            <button
                                type="button"
                                onClick={onClose}
                                className="bg-gradient-to-r from-red-500 to-red-700 hover:from-red-700 hover:to-red-900 text-white font-bold py-2 px-6 rounded-lg focus:outline-none focus:shadow-outline"
                            >
                                Cancelar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ModalActividad;
