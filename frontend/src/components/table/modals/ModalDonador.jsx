import React, { useState, useEffect } from 'react';
import { useDonadores } from '../../../context/DonadoresContext';
import { RiCloseLine } from 'react-icons/ri';
import show_alert from '../alertFunctions';

const ModalDonador = ({ onClose, item }) => {
    const { createDonador, updateDonador, donadores, messages, errors } = useDonadores();
    const [formData, setFormData] = useState({
        identificacion: '',
        nombre: '',
        nombreEmpresa: '',
        tipoDonador: 'Natural',
        tipoDocumen: 'C.C',
        telefono: '',
        direccion: '',
        correoElectronico: '',
        estado: 'activo',
        contacto: '',
    });

    const [formErrors, setErrors] = useState({});

    useEffect(() => {
        if (item) {
            setFormData({
                identificacion: item.identificacion || '',
                nombre: item.nombre || '',
                nombreEmpresa: item.nombreEmpresa || '',
                tipoDonador: item.tipoDonador || 'Natural',
                tipoDocumen: item.tipoDocumen || 'C.C',
                telefono: item.telefono || '',
                direccion: item.direccion || '',
                correoElectronico: item.correoElectronico || '',
                estado: item.estado || 'activo',
                contacto: item.cargoContacto || '',
            });
        } else {
            setFormData({
                identificacion: '',
                nombre: '',
                nombreEmpresa: '',
                tipoDonador: 'Natural',
                tipoDocumen: 'C.C',
                telefono: '',
                direccion: '',
                correoElectronico: '',
                estado: 'activo',
                contacto: '',
            });
        }
    }, [item]);

    const checkIfExists = (key, value) => {
        return donadores.some(donador => donador[key] && donador[key].toString().toLowerCase() === value.toString().toLowerCase());
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        const sanitizedValue = value.replace(/\s\s+/g, ' ');
    
        let newErrors = { ...formErrors };
    
        if (name === 'identificacion' || name === 'correoElectronico') {
            if (checkIfExists(name, sanitizedValue)) {
                newErrors = {
                    ...newErrors,
                    [name]: `${name === 'identificacion' ? 'La identificación' : 'El correo electrónico'} ya existe.`
                };
            } else {
                newErrors = {
                    ...newErrors,
                    [name]: null
                };
            }
        }

        
    
        setFormData(prevState => ({
            ...prevState,
            [name]: name === 'nombre' || name === 'nombreEmpresa' || name === 'contacto' ? capitalizeWords(sanitizedValue) : sanitizedValue
        }));
    
        setErrors(newErrors);
    };

    const handleTipoDonadorChange = (e) => {
        const { value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            tipoDonador: value,
            tipoDocumen: value === 'Natural' ? 'C.C' : 'NIT'
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationErrors = {};
        if (!formData.identificacion) validationErrors.identificacion = 'Este campo es obligatorio';
        if (!formData.nombre && formData.tipoDonador === 'Natural') validationErrors.nombre = 'Este campo es obligatorio';
        if (!formData.nombreEmpresa && formData.tipoDonador === 'Empresa') validationErrors.nombreEmpresa = 'Este campo es obligatorio';
        if (!formData.contacto && formData.tipoDonador === 'Empresa') validationErrors.contacto = 'Este campo es obligatorio';
        if (!formData.direccion) validationErrors.direccion = 'Este campo es obligatorio';
        if (!formData.correoElectronico) validationErrors.correoElectronico = 'Este campo es obligatorio';
        if (!formData.telefono) validationErrors.telefono = 'Este campo es obligatorio';
        
        const identificacionRegex = /^\d{5,12}$/;
        const alphanumericRegex = /^[a-zA-Z0-9\s]*$/;
        const telefonoRegex = /^\d{9,12}$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
        if (!formData.identificacion || !identificacionRegex.test(formData.identificacion)) {
            validationErrors.identificacion = 'La identificación debe contener solo números y estar entre 5 y 12 caracteres.';
        }
        if ((!formData.nombre || !alphanumericRegex.test(formData.nombre)) && formData.tipoDonador === 'Natural') {
            validationErrors.nombre = 'El nombre debe contener solo letras y números.';
        }
        if ((!formData.nombreEmpresa || !alphanumericRegex.test(formData.nombreEmpresa)) && formData.tipoDonador === 'Empresa') {
            validationErrors.nombreEmpresa = 'El nombre de la empresa debe contener solo letras y números.';
        }
        if ((!formData.contacto || !alphanumericRegex.test(formData.contacto)) && formData.tipoDonador === 'Empresa') {
            validationErrors.contacto = 'El contacto debe contener solo letras y números.';
        }
        if (!formData.direccion) {
            validationErrors.direccion = 'Este campo es obligatorio';
        }
        if (!formData.correoElectronico || !emailRegex.test(formData.correoElectronico)) {
            validationErrors.correoElectronico = 'Ingrese un correo electrónico válido';
        }
        if (!formData.telefono || !telefonoRegex.test(formData.telefono)) {
            validationErrors.telefono = 'El teléfono debe contener solo números y estar entre 9 y 12 caracteres.';
        }
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
        } catch (error) {
            console.error('Error saving item:', error.response ? error.response.data : error.message);
        }
    };

    const capitalizeWords = (string) => {
        return string.replace(/\b\w/g, char => char.toUpperCase());
    };

    return (
        <div className="bg-white rounded-lg shadow-2xl max-w-lg mx-auto mt-8 mb-8">
            <div className="p-8 grid grid-cols-2 gap-8">
                <h2 className="col-span-2 text-3xl font-semibold mb-1 text-center text-gray-800">{item ? 'Editar Donador' : 'Agregar Donador'}</h2>
                <div>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-2">Tipo de Donador<span className="text-red-500 text-sm">*</span></label>
                            <select
                                name="tipoDonador"
                                value={formData.tipoDonador}
                                onChange={handleTipoDonadorChange}
                                className="shadow-sm border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-300"
                                required
                            >
                                <option value="Natural">Natural</option>
                                <option value="Empresa">Empresa</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-2">Identificación<span className="text-red-500 text-sm">*</span></label>
                            <input
                                type="text"
                                name="identificacion"
                                value={formData.identificacion}
                                onChange={handleChange}
                                className={`shadow-sm border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-300 ${formErrors.identificacion ? 'border-red-500' : ''}`}
                                required
                            />
                            {formErrors.identificacion && <p className="text-red-500 text-sm mt-1">{formErrors.identificacion}</p>}
                        </div>
                        {formData.tipoDonador === 'Empresa' && (
                            <div>
                                <label className="block text-gray-700 text-sm font-medium mb-2">Contacto<span className="text-red-500 text-sm">*</span></label>
                                <input
                                    type="text"
                                    name="contacto"
                                    value={formData.contacto}
                                    onChange={handleChange}
                                    className={`shadow-sm border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-300 ${formErrors.contacto ? 'border-red-500' : ''}`}
                                    required
                                />
                                {formErrors.contacto && <p className="text-red-500 text-sm mt-1">{formErrors.contacto}</p>}
                            </div>
                        )}
                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-2">Dirección<span className="text-red-500 text-sm">*</span></label>
                            <input
                                type="text"
                                name="direccion"
                                value={formData.direccion}
                                onChange={handleChange}
                                className={`shadow-sm border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-300 ${formErrors.direccion ? 'border-red-500' : ''}`}
                                required
                            />
                            {formErrors.direccion && <p className="text-red-500 text-sm mt-1">{formErrors.direccion}</p>}
                        </div>
                    </form>
                </div>
                <div>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-2">Tipo de Documento<span className="text-red-500 text-sm">*</span></label>
                            <select
                                name="tipoDocumen"
                                value={formData.tipoDocumen}
                                onChange={handleChange}
                                className="shadow-sm border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-300"
                                required
                            >
                                {formData.tipoDonador === 'Natural' ? (
                                    <>
                                        <option value="C.C">C.C</option>
                                        <option value="C.E">C.E</option>
                                        
                                    </>
                                ): (
                                    <option value="NIT">NIT</option>
                                )}
                            </select>
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-2">{formData.tipoDonador === 'Natural' ? 'Nombre' : 'Nombre Empresa'}<span className="text-red-500 text-sm">*</span></label>
                            <input
                                type="text"
                                name={formData.tipoDonador === 'Natural' ? 'nombre' : 'nombreEmpresa'}
                                value={formData.tipoDonador === 'Natural' ? formData.nombre : formData.nombreEmpresa}
                                onChange={handleChange}
                                className={`shadow-sm border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-300 ${formErrors.nombre || formErrors.nombreEmpresa ? 'border-red-500' : ''}`}
                                required
                            />
                            {(formErrors.nombre || formErrors.nombreEmpresa) && <p className="text-red-500 text-sm mt-1">{formErrors.nombre || formErrors.nombreEmpresa}</p>}
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-2">Teléfono<span className="text-red-500 text-sm">*</span></label>
                            <input
                                type="text"
                                name="telefono"
                                value={formData.telefono}
                                onChange={handleChange}
                                className={`shadow-sm border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-300 ${formErrors.telefono ? 'border-red-500' : ''}`}
                                required
                            />
                            {formErrors.telefono && <p className="text-red-500 text-sm mt-1">{formErrors.telefono}</p>}
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-2">Correo Electrónico<span className="text-red-500 text-sm">*</span></label>
                            <input
                                type="email"
                                name="correoElectronico"
                                value={formData.correoElectronico}
                                onChange={handleChange}
                                className={`shadow-sm border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-300 ${formErrors.correoElectronico ? 'border-red-500' : ''}`}
                                required
                            />
                            {formErrors.correoElectronico && <p className="text-red-500 text-sm mt-1">{formErrors.correoElectronico}</p>}
                        </div>
                        <div className="flex justify-end space-x-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-red-700 border-2  border-gradient-to-r border-red-400  hover:border-red-600 hover:from-red-600 hover:to-red-700  font-bold py-2 px-6 rounded-lg focus:outline-none focus:shadow-outline"
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
        </div>
    );
};

export default ModalDonador;
