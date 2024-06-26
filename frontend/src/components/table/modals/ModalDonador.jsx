import React, { useState, useEffect } from 'react';
import { useDonadores } from '../../../context/DonadoresContext';
import { RiCloseLine } from 'react-icons/ri';
import show_alert from '../alertFunctions';

const ModalDonador = ({ onClose, item }) => {
    const { createDonador, updateDonador, donadores , messages, errors} = useDonadores();
    const [formData, setFormData] = useState({
        identificacion: '',
        nombre: '',
        tipoDonador: 'Natural',
        tipoDocumen: 'C.C',
        telefono: '',
        direccion: '',
        correoElectronico: '',
        estado: 'Activo'
    });

    const [formErrors, setErrors] = useState({
        identificacion: '',
        nombre: '',
        tipoDonador: 'Natural',
        tipoDocumen: 'C.C',
        telefono: '',
        direccion: '',
        correoElectronico: '',
        estado: 'Activo'
    });


    useEffect(() => {
        if (item) {
            setFormData({
                identificacion: item.identificacion || '',
                nombre: item.nombre || '',
                tipoDonador: item.tipoDonador || 'Natural',
                tipoDocumen: item.tipoDocumen || 'C.C',
                telefono: item.telefono || '',
                direccion: item.direccion || '',
                correoElectronico: item.correoElectronico || '',
                estado: item.estado || 'activo'
            });
        } else {
            setFormData({
                identificacion: '',
                nombre: '',
                tipoDonador: 'Natural',
                tipoDocumen: 'C.C',
                telefono: '',
                direccion: '',
                correoElectronico: '',
                estado: 'activo'
            });
        }
    }, [item]);

    const checkIfExists = (datoExistente) => {
        return donadores.some(donador => {
            if (donador.identificacion && datoExistente || donador.correoElectronico && datoExistente ) {
                return donador.identificacion.toString().toLowerCase().trim()|| donador.correoElectronico.toString().toLowerCase().trim() === datoExistente.toString().toLowerCase().trim();
            }
            return false;
        });

    }


    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'identificacion') {
            if (checkIfExists(value)) {
                setErrors(prevState => ({
                    ...prevState,
                    [name]: 'El donador ya existe.'
                }));
            } else if (/^\d{5,10}$/.test(value)) {
                setErrors(prevState => ({
                    ...prevState,
                    [name]: null
                }));
            } else {
                setErrors(prevState => ({
                    ...prevState,
                    [name]: 'La identificación debe tener entre 5 y 10 dígitos numéricos.'
                }));
            }
        } else if (name === 'nombre') {
            if (/^[A-Za-záéíóúüñÁÉÍÓÚÜÑ\s]+$/.test(value)) {
                setErrors(prevState => ({
                    ...prevState,
                    [name]: null
                }));
            } else {
                setErrors(prevState => ({
                    ...prevState,
                    [name]: 'El nombre solo puede contener letras y espacios.'
                }));
            }
        } else if (name === 'telefono') {
            if (/^\d{8,12}$/.test(value)) {
                setErrors(prevState => ({
                    ...prevState,
                    [name]: null
                }));
            } else {
                setErrors(prevState => ({
                    ...prevState,
                    [name]: 'El telefono debe tener entre 8 a 12 dígitos numéricos.'
                }));
            }
        } else if (name === 'correoElectronico') {
            if (checkIfExists(value)) {
                setErrors(prevState => ({
                    ...prevState,
                    [name]: 'El correo ya tiene un donador.'
                }));
            }else if (/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value)) {
                setErrors(prevState => ({
                    ...prevState,
                    [name]: null
                }));
            } else {
                setErrors(prevState => ({
                    ...prevState,
                    [name]: 'Correo electrónico no válido.'
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

        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationErrors = {};
        if (!formData.identificacion) validationErrors.identificacion = 'Este campo es obligatorio';
        else if (!/^\d{5,10}$/.test(formData.identificacion)) validationErrors.identificacion = 'La identificación debe tener entre 5 y 10 dígitos numéricos.';
        if (!formData.nombre) validationErrors.nombre = 'Este campo es obligatorio';
        if (!formData.direccion) validationErrors.direccion = 'Este campo es obligatorio';
        if (!formData.correoElectronico) validationErrors.correoElectronico = 'Este campo es obligatorio';
        if (!formData.telefono) validationErrors.telefono = 'Este campo es obligatorio';

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            if (item && item._id) {
                const response = await updateDonador(item._id, formData);
                if (response.success) {
                    show_alert(messages[0], 'success');
                    onClose();
                } else {
                    show_alert(errors[0], 'error');
                }
            } else {
                const response = await createDonador(formData);
                if (response.success) {
                    show_alert(messages[0], 'success');
                    onClose();
                } else {
                    show_alert(errors[0], 'error');
                }
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
                    <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">{item ? 'Editar Donador' : 'Agregar Donador'}</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-2">Identificación<p className="text-red-500 text-sm">*</p></label>
                            <input
                                type="text"
                                name="identificacion"
                                value={formData.identificacion}
                                onChange={handleChange}
                                className={`shadow-sm border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-300 ${errors.identificacion ? 'border-red-500' : ''}`}
                                required
                            />
                            {formErrors.identificacion && <p className="text-red-500 text-sm mt-1">{formErrors.identificacion}</p>}
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
                            {formErrors.nombre && <p className="text-red-500 text-sm mt-1">{formErrors.nombre}</p>}
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-2">Tipo de Donador<p className="text-red-500 text-sm">*</p></label>
                            <select
                                name="tipoDonador"
                                value={formData.tipoDonador}
                                onChange={handleChange}
                                className="shadow-sm border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-300"
                                required
                            >
                                <option value="Natural">Natural</option>
                                <option value="Empresa">Empresa</option>
                            </select>
                        </div>
                    </form>
                </div>
                <div className="flex-1">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-2">Tipo de Documento<p className="text-red-500 text-sm">*</p></label>
                            <select
                                name="tipoDocumen"
                                value={formData.tipoDocumen}
                                onChange={handleChange}
                                className="shadow-sm border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-300"
                                required
                            >
                                <option value="C.C">C.C</option>
                                <option value="NIT">NIT</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-2">Teléfono<p className="text-red-500 text-sm">*</p></label>
                            <input
                                type="text"
                                name="telefono"
                                value={formData.telefono}
                                onChange={handleChange}
                                className={`shadow-sm border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-300 ${errors.telefono ? 'border-red-500' : ''}`}
                                required
                            />
                            {formErrors.telefono && <p className="text-red-500 text-sm mt-1">{formErrors.telefono}</p>}
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-2">Dirección<p className="text-red-500 text-sm">*</p></label>
                            <input
                                type="text"
                                name="direccion"
                                value={formData.direccion}
                                onChange={handleChange}
                                className={`shadow-sm border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-300 ${errors.direccion ? 'border-red-500' : ''}`}
                                required
                            />
                            {formErrors.direccion && <p className="text-red-500 text-sm mt-1">{formErrors.direccion}</p>}
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-2">Correo Electrónico<p className="text-red-500 text-sm">*</p></label>
                            <input
                                type="email"
                                name="correoElectronico"
                                value={formData.correoElectronico}
                                onChange={handleChange}
                                className={`shadow-sm border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-300 ${errors.correoElectronico ? 'border-red-500' : ''}`}
                                required
                            />
                            {formErrors.correoElectronico && <p className="text-red-500 text-sm mt-1">{formErrors.correoElectronico}</p>}
                        </div>
                        
                        <div className="flex justify-end space-x-4">
                        <button
                                type="button"
                                onClick={onClose}
                                className="bg-gradient-to-r from-red-200 to-red-500 hover:from-red-300 hover:to-red-700 text-white font-bold py-2 px-6 rounded-lg focus:outline-none focus:shadow-outline"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="bg-gradient-to-r from-blue-500 to-blue-800 hover:from-blue-600 hover:to-blue-900 text-white font-bold py-2 px-6 rounded-lg focus:outline-none focus:shadow-outline"
                            >
                                {item ? 'Actualizar' : 'Agregar'}
                            </button>
                            
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ModalDonador;
