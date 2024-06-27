import React, { useState, useEffect } from 'react';
import { useTareas } from '../../../context/TareasContext';
import axios from 'axios';
import { RiCloseLine, RiDeleteBin6Line, RiAddCircleLine } from 'react-icons/ri';

const ModalTarea = ({ onClose, item }) => {
    const { createTarea, updateTarea } = useTareas();
    const [formData, setFormData] = useState({
        nombre: '',
        accion: '',
        cantidadHoras: '',
        fecha: '',
        estado: 'activo',
        ayudantes: []
    });
    const [ayudantesList, setAyudantesList] = useState([]);
    const [errors, setErrors] = useState({
        nombre: '',
        accion: '',
        cantidadHoras: '',
        fecha: '',
        ayudantes: ''
    });

    useEffect(() => {
        const fetchAyudantes = async () => {
            try {
                const response = await axios.get('http://localhost:3002/ayudantes');
                setAyudantesList(response.data);
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
                ayudantes: item.ayudantes ? item.ayudantes.map(a => ({
                    _id: a._id || '',
                    nombre: a.nombre || '',
                    rol: a.rol || ''
                })) : []
            });
        }
    }, [item]);

    const handleAyudanteChange = (e, index) => {
        const ayudanteId = e.target.value;
        const selectedAyudante = ayudantesList.find(a => a._id === ayudanteId);
        const updatedAyudantes = [...formData.ayudantes];
        updatedAyudantes[index] = {
            _id: ayudanteId,
            nombre: selectedAyudante ? selectedAyudante.nombre : '',
            rol: selectedAyudante ? selectedAyudante.rol : ''
        };
        setFormData(prevState => ({
            ...prevState,
            ayudantes: updatedAyudantes
        }));
        validateField('ayudantes', updatedAyudantes);
    };

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
                    !/^[a-zA-Z\s]+$/.test(value) ? 'El nombre solo debe contener letras y espacios' :
                        '';
                break;
            case 'accion':
                errorMessage = !value ? 'Este campo es obligatorio' : '';
                break;
            case 'cantidadHoras':
                errorMessage = !value ? 'Este campo es obligatorio' :
                    isNaN(value) ? 'La cantidad de horas debe ser un número' :
                        value < 1 ? 'La cantidad de horas debe ser al menos 1' :
                            value > 12 ? 'La cantidad de horas no debe ser más de 12' :
                                '';
                break;
            case 'fecha':
                const today = new Date().toISOString().split('T')[0]; // Obtener la fecha actual en formato YYYY-MM-DD
                errorMessage = !value ? 'La fecha es obligatoria' :
                    value < today ? 'La fecha no puede estar en el pasado' :
                        '';
                break;
            case 'ayudantes':
                errorMessage = value.length === 0 ? 'Debe agregar al menos un ayudante' : '';
                break;
            default:
                break;
        }

        setErrors(prevErrors => ({
            ...prevErrors,
            [name]: errorMessage
        }));
    };

    const addAyudante = () => {
        setFormData(prevState => ({
            ...prevState,
            ayudantes: [...prevState.ayudantes, { _id: '', nombre: '', rol: '' }]
        }));
    };

    const removeAyudante = (index) => {
        const updatedAyudantes = [...formData.ayudantes];
        updatedAyudantes.splice(index, 1);
        setFormData(prevState => ({ ...prevState, ayudantes: updatedAyudantes }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validar todos los campos antes de enviar
        const formIsValid = Object.keys(formData).every(key => {
            validateField(key, formData[key]);
            return !errors[key];
        });

        if (formIsValid) {
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
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-2xl max-w-lg mx-auto mt-8 mb-8">
            <div className="p-8">
                <h2 className="col-span-2 text-3xl font-semibold mb-6 text-center text-gray-800">{item ? 'Editar Tarea' : 'Agregar Tarea'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex space-x-8">
                        <div className="w-1/2">
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
                                {errors.nombre && <p className="text-red-500 text-xs italic">{errors.nombre}</p>}
                            </div>
                            <div>
                                <label className="block text-gray-700 text-sm font-medium mb-2">Acción</label>
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
                            <div>
                                <label className="block text-gray-700 text-sm font-medium mb-2">Cantidad de Horas</label>
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
                            <div>
                                <label className="block text-gray-700 text-sm font-medium mb-2">Fecha</label>
                                <input
                                    type="date"
                                    name="fecha"
                                    value={formData.fecha}
                                    onChange={handleChange}
                                    className={`shadow-sm border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-300 ${errors.fecha ? 'border-red-500' : ''}`}
                                    required
                                />
                                {errors.fecha && <p className="text-red-500 text-xs italic">{errors.fecha}</p>}
                            </div>
                        </div>
                        <div className="w-1/2">
                            <label className="block text-gray-700 text-sm font-medium mb-2">Ayudantes</label>
                            {formData.ayudantes.map((ayudante, index) => (
                                <div key={index} className="border rounded p-4 mb-4">
                                    <div>
                                        <select
                                            name="ayudante"
                                            value={ayudante._id}
                                            onChange={(e) => handleAyudanteChange(e, index)}
                                            className={`shadow-sm border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-300 ${errors.ayudantes ? 'border-red-500' : ''}`}
                                            required
                                        >
                                            <option value="">Seleccionar Ayudante</option>
                                            {ayudantesList.map(a => (
                                                <option key={a._id} value={a._id}>
                                                    {a.identificacion} - {a.nombre}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <button
                                        type="button"
                                        className="text-red-500 mt-2 flex items-center"
                                        onClick={() => removeAyudante(index)}
                                    >
                                        <RiDeleteBin6Line className="mr-2" /> Eliminar Ayudante
                                    </button>
                                </div>
                            ))}
                            {errors.ayudantes && <p className="text-red-500 text-xs italic">{errors.ayudantes}</p>}
                            <button
                                type="button"
                                className="text-blue-500 mt-4 flex items-center"
                                onClick={addAyudante}
                            >
                                <RiAddCircleLine className="mr-2" /> Agregar Ayudante
                            </button>
                        </div>
                    </div>
                    <div className="flex justify-end space-x-4 mt-8">
                        <button
                            type="button"
                            className="bg-gray-300 text-gray-800 py-2 px-4 rounded hover:bg-gray-400 focus:outline-none"
                            onClick={onClose}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none"
                        >
                            {item ? 'Actualizar Tarea' : 'Guardar Tarea'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ModalTarea;
