import React, { useState, useEffect } from 'react';
import { useAyudantes } from '../../../context/AyudantesContext';

const ModalAyudante = ({ onClose, item }) => {
    const { createAyudante, updateAyudante, ayudantes } = useAyudantes();
    const [formData, setFormData] = useState({
        tipoDocumento: 'C.C',
        identificacion: '',
        nombre: '',
        telefono: '',
        rol: 'alfabetizador',
        direccion: '',
        correoElectronico: '',
        institucion: '',
        estado: 'activo'
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (item) {
            setFormData({
                tipoDocumento: item.tipoDocumento || 'C.C',
                identificacion: item.identificacion || '',
                nombre: item.nombre || '',
                telefono: item.telefono || '',
                rol: item.rol || 'alfabetizador',
                direccion: item.direccion || '',
                correoElectronico: item.correoElectronico || '',
                institucion: item.institucion || '',
                estado: item.estado || 'activo'
            });
        }
    }, [item]);

    const checkIfExists = (identificacion) => {
        return ayudantes.some(ayudante => {
            if (ayudante.identificacion && identificacion) {
                return ayudante.identificacion.toString().toLowerCase().trim() === identificacion.toString().toLowerCase().trim();
            }
            return false;
        });
    };

    const handleValidation = (name, value) => {
        const newErrors = { ...errors };

        switch (name) {
            case 'identificacion':
                if (!value) {
                    newErrors.identificacion = 'Este campo es obligatorio';
                } else if (!/^\d{8,10}$/.test(value)) {
                    newErrors.identificacion = 'El documento debe contener entre 8 y 10 dígitos numéricos';
                } else if (checkIfExists(value)) {
                    newErrors.identificacion = 'El ayudante ya existe.';
                } else {
                    delete newErrors.identificacion;
                }
                break;
            case 'nombre':
                if (!value) {
                    newErrors.nombre = 'Este campo es obligatorio';
                } else if (!/^[a-zA-Z\s]+$/.test(value)) {
                    newErrors.nombre = 'El nombre solo debe contener letras y espacios';
                } else {
                    delete newErrors.nombre;
                }
                break;
            case 'telefono':
                if (!value) {
                    newErrors.telefono = 'Este campo es obligatorio';
                } else if (value.toString().length !== 10) {
                    newErrors.telefono = 'El teléfono debe tener 10 dígitos numéricos';
                } else {
                    delete newErrors.telefono;
                }
                break;
            case 'correoElectronico':
                if (value && !/.+@.+\..+/.test(value)) {
                    newErrors.correoElectronico = 'Ingrese un correo electrónico válido';
                } else {
                    delete newErrors.correoElectronico;
                }
                break;
            case 'direccion':
                if (!value) {
                    newErrors.direccion = 'Este campo es obligatorio';
                } else if (value.length < 5) {
                    newErrors.direccion = 'La dirección debe tener al menos 5 caracteres';
                } else if (!/^[a-zA-Z0-9#\-\s]+$/.test(value)) {
                    newErrors.direccion = 'La dirección solo debe contener letras, números, numeral, guion medio y espacios';
                } else {
                    delete newErrors.direccion;
                }
                break;
            case 'institucion':
                if (!value) {
                    newErrors.institucion = 'Este campo es obligatorio';
                } else if (value.length < 5) {
                    newErrors.institucion = 'La institución debe tener al menos 5 caracteres';
                } else {
                    delete newErrors.institucion;
                }
                break;
            default:
                break;
        }

        setErrors(newErrors);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));

        handleValidation(name, value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        Object.keys(formData).forEach(key => handleValidation(key, formData[key]));

        if (Object.keys(errors).length > 0) {
            return;
        }

        try {
            if (item && item._id) {
                await updateAyudante(item._id, formData);
            } else {
                await createAyudante(formData);
            }
            onClose();
        } catch (error) {
            console.error('Error saving item:', error.response ? error.response.data : error.message);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-2xl max-w-4xl mx-auto mt-8 mb-8 max-h-[90vh] overflow-y-auto">
            <div className="p-8">
                <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">{item ? 'Editar Ayudante' : 'Agregar Ayudante'}</h2>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-gray-700 text-sm font-medium mb-2">Tipo de Documento<span className="text-red-500 text-sm">*</span></label>
                        <select
                            name="tipoDocumento"
                            value={formData.tipoDocumento}
                            onChange={handleChange}
                            className="shadow-sm border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-300"
                            required
                        >
                            <option value="C.C">C.C</option>
                            <option value="T.I">T.I</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-medium mb-2">Identificación<span className="text-red-500 text-sm">*</span></label>
                        <input
                            type="text"
                            name="identificacion"
                            value={formData.identificacion}
                            onChange={handleChange}
                            className={`shadow-sm border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-300 ${errors.identificacion ? 'border-red-500' : ''}`}
                            required
                        />
                        {errors.identificacion && <p className="text-red-500 text-sm mt-1">{errors.identificacion}</p>}
                    </div>
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
                        {errors.nombre && <p className="text-red-500 text-sm mt-1">{errors.nombre}</p>}
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-medium mb-2">Teléfono<span className="text-red-500 text-sm">*</span></label>
                        <input
                            type="text"
                            name="telefono"
                            value={formData.telefono}
                            onChange={handleChange}
                            className={`shadow-sm border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-300 ${errors.telefono ? 'border-red-500' : ''}`}
                            required
                        />
                        {errors.telefono && <p className="text-red-500 text-sm mt-1">{errors.telefono}</p>}
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-medium mb-2">Rol<span className="text-red-500 text-sm">*</span></label>
                        <select
                            name="rol"
                            value={formData.rol}
                            onChange={handleChange}
                            className="shadow-sm border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-300"
                            required
                        >
                            <option value="alfabetizador">Alfabetizador</option>
                            <option value="voluntario">Voluntario</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-medium mb-2">Dirección<span className="text-red-500 text-sm">*</span></label>
                        <input
                            type="text"
                            name="direccion"
                            value={formData.direccion}
                            onChange={handleChange}
                            className={`shadow-sm border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-300 ${errors.direccion ? 'border-red-500' : ''}`}
                            required
                        />
                        {errors.direccion && <p className="text-red-500 text-sm mt-1">{errors.direccion}</p>}
                    </div>
                    <div className="sm:col-span-2">
                        <label className="block text-gray-700 text-sm font-medium mb-2">Correo Electrónico</label>
                        <input
                            type="email"
                            name="correoElectronico"
                            value={formData.correoElectronico}
                            onChange={handleChange}
                            className={`shadow-sm border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-300 ${errors.correoElectronico ? 'border-red-500' : ''}`}
                        />
                        {errors.correoElectronico && <p className="text-red-500 text-sm mt-1">{errors.correoElectronico}</p>}
                    </div>
                    <div className='sm:col-span-2'>
                        <label className="block text-gray-700 text-sm font-medium mb-2">Institución<span className="text-red-500 text-sm">*</span></label>
                        <input
                            type="text"
                            name="institucion"
                            value={formData.institucion}
                            onChange={handleChange}
                            className={`shadow-sm border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-300 ${errors.institucion ? 'border-red-500' : ''}`}
                            required
                        />
                        {errors.institucion && <p className="text-red-500 text-sm mt-1">{errors.institucion}</p>}
                    </div>
                    <div className="col-span-2 flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-red-700 border-2  border-gradient-to-r border-red-400  hover:border-red-600 hover:from-red-600 hover:to-red-700  font-bold py-2 px-6 rounded-lg focus:outline-none focus:shadow-outline"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            onClick={handleSubmit}
                            className="bg-gradient-to-l from-indigo-400 to-indigo-600 hover:from-indigo-600 hover:to-indigo-800 text-white font-bold py-2 px-6 rounded-lg focus:outline-none focus:shadow-outline"
                        >
                            {item ? 'Actualizar Ayudante' : 'Agregar Ayudante'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ModalAyudante;
