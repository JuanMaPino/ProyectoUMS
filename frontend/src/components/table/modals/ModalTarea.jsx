import React, { useState, useEffect } from 'react';
import { useTareas } from '../../../context/TareasContext';
import { RiCloseLine } from 'react-icons/ri';
import { showToast } from '../../table/alertFunctions';

const ModalTarea = ({ onClose, item }) => {
    const { createTarea, updateTarea } = useTareas();
    const [formData, setFormData] = useState({
        nombre: '',
        accion: '',
        cantidadHoras: '',
        estado: 'activo'
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (item) {
            setFormData({
                nombre: item.nombre || '',
                accion: item.accion || '',
                cantidadHoras: item.cantidadHoras || '',
                estado: item.estado || 'activo'
            });
        }
    }, [item]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));
        validateField(name, value);
    };

    const validateField = (name, value) => {
        let errorMessage = '';

        switch (name) {
            case 'nombre':
                errorMessage = !value ? 'Este campo es obligatorio' :
                    !/^[a-zA-Z\s]+$/.test(value) ? 'El nombre solo debe contener letras y espacios' : '';
                break;
            case 'accion':
                errorMessage = !value ? 'Este campo es obligatorio' : '';
                break;
            case 'cantidadHoras':
                errorMessage = !value ? 'Este campo es obligatorio' :
                    isNaN(value) ? 'La cantidad de horas debe ser un número' :
                    value < 1 ? 'La cantidad de horas debe ser al menos 1' :
                    value > 12 ? 'La cantidad de horas no debe ser más de 12' : '';
                break;
            default:
                break;
        }

        setErrors(prevErrors => ({
            ...prevErrors,
            [name]: errorMessage
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formIsValid = Object.keys(formData).every(key => {
            validateField(key, formData[key]);
            return !errors[key];
        });

        if (formIsValid) {
            try {
                const dataToSend = {
                    ...formData,
                    cantidadHoras: parseInt(formData.cantidadHoras, 10)
                };

                if (item && item._id) {
                    await updateTarea(item._id, dataToSend);
                    showToast('Tarea actualizada correctamente.', 'success');
                } else {
                    await createTarea(dataToSend);
                    showToast('Tarea creada correctamente.', 'success');
                }
                onClose();
            } catch (error) {
                console.error('Error saving task:', error.response?.data?.error || error.message);
                showToast(error.response?.data?.error || 'Error al guardar la tarea.', 'error');
            }
        }
    };

    return (
        <div className="bg-white p-8 rounded-lg shadow-2xl max-w-4xl mx-auto mt-8 mb-8 max-h-[90vh] overflow-y-auto">
            <div className="grid grid-cols-2 gap-8">
                <h2 className="col-span-2 text-3xl font-semibold mb-6 text-center text-gray-800">
                    {item ? 'Editar Tarea' : 'Agregar Tarea'}
                </h2>
                <div className="col-span-2">
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                        Nombre <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                        className={`shadow-sm border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-300 ${errors.nombre ? 'border-red-500' : ''}`}
                        required
                    />
                    {errors.nombre && <p className="text-red-500 text-xs italic">{errors.nombre}</p>}
                </div>
                <div className="col-span-2">
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                        Acción <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="accion"
                        value={formData.accion}
                        onChange={handleChange}
                        className={`shadow-sm border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-300 ${errors.accion ? 'border-red-500' : ''}`}
                        required
                    />
                    {errors.accion && <p className="text-red-500 text-xs italic">{errors.accion}</p>}
                </div>
                <div className="col-span-2">
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                        Cantidad de Horas <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="number"
                        name="cantidadHoras"
                        value={formData.cantidadHoras}
                        onChange={handleChange}
                        className={`shadow-sm border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-300 ${errors.cantidadHoras ? 'border-red-500' : ''}`}
                        required
                    />
                    {errors.cantidadHoras && <p className="text-red-500 text-xs italic">{errors.cantidadHoras}</p>}
                </div>
                <div className="col-span-2 flex justify-end space-x-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-red-700 border-2 border-gradient-to-r border-red-400 hover:border-red-600 hover:from-red-600 hover:to-red-700 font-bold py-2 px-6 rounded-lg focus:outline-none focus:shadow-outline"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        onClick={handleSubmit}
                        className="bg-gradient-to-l from-indigo-400 to-indigo-600 hover:from-indigo-600 hover:to-indigo-800 text-white font-bold py-2 px-6 rounded-lg focus:outline-none focus:shadow-outline"
                    >
                        {item ? 'Actualizar Tarea' : 'Agregar Tarea'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModalTarea;