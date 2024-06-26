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
    const [errors, setErrors] = useState({
        nombre: '',
        accion: '',
        cantidadHoras: '',
        fecha: '',
        ayudante: ''
    });

    useEffect(() => {
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
        validateField('ayudante', ayudanteId);
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
            case 'ayudante':
                errorMessage = !value ? 'Debe seleccionar un ayudante' : '';
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
                <div className="flex space-x-8">
                    <form onSubmit={handleSubmit} className=" space-y-4">
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
                    </form>
                    <form onSubmit={handleSubmit} className=" space-y-4">
                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-2">Ayudante</label>
                            <select
                                name="ayudante"
                                value={formData.ayudante}
                                onChange={handleAyudanteChange}
                                className={`shadow-sm border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-300 ${errors.ayudante ? 'border-red-500' : ''}`}
                                required
                            >
                                <option value="">Seleccionar Ayudante</option>
                                {ayudantes.map(a => (
                                    <option key={a._id} value={a._id}>
                                        {a.identificacion} - {a.nombre}
                                    </option>
                                ))}
                            </select>
                            {errors.ayudante && <p className="text-red-500 text-xs italic">{errors.ayudante}</p>}
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

                    </form>
                </div>
                <div className="flex justify-end space-x-4 mt-6">
                    <button
                        type="button"
                        onClick={onClose}
                        className="bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-red-700 border-2 border-gradient-to-r border-red-400 hover:border-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-2 px-6 rounded-lg focus:outline-none focus:shadow-outline"
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
            </div>
        </div>
    );
};

export default ModalTarea;

