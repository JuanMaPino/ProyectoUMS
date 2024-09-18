import React, { useState, useEffect } from 'react';
import { useDonadores } from '../../../context/DonadoresContext';
import { RiCloseLine } from 'react-icons/ri';
import { showToast } from '../../table/alertFunctions'; 

const ModalDonador = ({ onClose, item }) => {
    const { createDonador, updateDonador, donadores, messages, errors } = useDonadores();
    const [formData, setFormData] = useState({
        identificacion: '',
        nombre: '',
        tipoDonador: 'Natural',
        tipoDocumen: 'C.C' || 'C.E',
        telefono: '',
        direccion: '',
        correoElectronico: '',
        estado: 'activo',
        contacto: '',
    });

    const [formErrors, setFormErrors] = useState({
        identificacion: '',
        nombre: '',
        contacto: '',  // Inicialmente sin error
        direccion: '',
        correoElectronico: '',
        telefono: '',
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
                estado: item.estado || 'activo',
                contacto: item.cargoContacto || '',
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

        switch (name) {
            case 'identificacion':
                if (!value || !/^\d{5,12}$/.test(value)) {
                    newErrors.identificacion = 'La identificación debe contener solo números y estar entre 5 y 12 caracteres.';
                } else {
                    newErrors.identificacion = '';
                }
                break;
            case 'nombre':
                if (formData.tipoDonador === 'Natural' && (!value || !/^[a-zA-Z0-9\s]*$/.test(value))) {
                    newErrors.nombre = 'El nombre debe contener solo letras y números.';
                } else {
                    newErrors.nombre = '';
                }
                break;
            case 'contacto':
                if (formData.tipoDonador === 'Empresa' && (!value || !/^[a-zA-Z0-9\s]*$/.test(value))) {
                    newErrors.contacto = 'El contacto debe contener solo letras y números.';
                } else {
                    newErrors.contacto = '';
                }
                break;
            case 'direccion':
                newErrors.direccion = value ? '' : 'Este campo es obligatorio';
                break;
            case 'correoElectronico':
                if (!value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                    newErrors.correoElectronico = 'Ingrese un correo electrónico válido';
                } else {
                    newErrors.correoElectronico = '';
                }
                break;
            case 'telefono':
                if (!value || !/^\d{9,10}$/.test(value)) {
                    newErrors.telefono = 'El teléfono debe contener solo números y estar entre 9 y 10 caracteres.';
                } else {
                    newErrors.telefono = '';
                }
                break;
            default:
                break;
        }

        setFormData(prevState => ({
            ...prevState,
            [name]: name === 'nombre' || name === 'contacto' ? capitalizeWords(sanitizedValue) : sanitizedValue
        }));

        setFormErrors(newErrors);
    };

    const handleTipoDonadorChange = (e) => {
        const { value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            tipoDonador: value,
            tipoDocumen: value === 'Natural' ? 'C.C' : 'NIT'
        }));

        // Reiniciar errores de contacto si cambia el tipo de donador
        setFormErrors(prevErrors => ({
            ...prevErrors,
            contacto: value === 'Natural' ? '' : prevErrors.contacto
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const validationErrors = { ...formErrors };
        
        if (!formData.identificacion || !/^\d{5,12}$/.test(formData.identificacion)) {
            validationErrors.identificacion = 'La identificación debe contener solo números y estar entre 5 y 12 caracteres.';
        }
        if ((!formData.nombre || !/^[a-zA-Z0-9\s]*$/.test(formData.nombre)) && formData.tipoDonador === 'Natural') {
            validationErrors.nombre = 'El nombre debe contener solo letras y números.';
        }
        if ((!formData.contacto || !/^[a-zA-Z0-9\s]*$/.test(formData.contacto)) && formData.tipoDonador === 'Empresa') {
            validationErrors.contacto = 'El contacto debe contener solo letras y números.';
        }
        if (!formData.direccion) {
            validationErrors.direccion = 'Este campo es obligatorio';
        }
        if (!formData.correoElectronico || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correoElectronico)) {
            validationErrors.correoElectronico = 'Ingrese un correo electrónico válido';
        }
        if (!formData.telefono || !/^\d{9,10}$/.test(formData.telefono)) {
            validationErrors.telefono = 'El teléfono debe contener solo números y estar entre 9 y 10 caracteres.';
        }
    
        if (Object.values(validationErrors).some(error => error !== '')) {
            setFormErrors(validationErrors);
            return;
        }
    
        if (!item || item.identificacion !== formData.identificacion) {
            if (checkIfExists('identificacion', formData.identificacion)) {
                setFormErrors({ ...formErrors, identificacion: 'Esta identificación ya está registrada.' });
                return;
            }
        }
        if (!item || item.correoElectronico !== formData.correoElectronico) {
            if (checkIfExists('correoElectronico', formData.correoElectronico)) {
                setFormErrors({ ...formErrors, correoElectronico: 'Este correo electrónico ya está registrado.' });
                return;
            }
        }
    
        try {
            let response;
            if (item && item._id) {
                response = await updateDonador(item._id, formData);
                showToast('Donador actualizado correctamente.', 'success');
            } else {
                response = await createDonador(formData);
                showToast('Donador creado correctamente.', 'success');
            }
    
            if (response.success) {
                showToast(messages[0], 'success');
                onClose(); // Cerrar el modal
            } else {
                showToast(errors[0], 'error');
            }
        } catch (error) {
            console.error('Error al guardar:', error.response ? error.response.data : error.message);
            showToast('Error al guardar el donador', 'error');
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
                                type="number"
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
                            <label className="block text-gray-700 text-sm font-medium mb-2">Nombre Completo/Nombre Empresa<span className="text-red-500 text-sm">*</span></label>
                            <input
                                type="text"
                                name={'nombre'}
                                value={formData.nombre }
                                onChange={handleChange}
                                className={`shadow-sm border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-300 ${formErrors.nombre  ? 'border-red-500' : ''}`}
                                required
                            />
                            {formErrors.nombre  && <p className="text-red-500 text-sm mt-1">{formErrors.nombre }</p>}
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
                                onClick={handleSubmit}
                                className="bg-gradient-to-l from-indigo-400 to-indigo-600 hover:from-indigo-600 hover:to-indigo-800 text-white font-bold py-2 px-6 rounded-lg focus:outline-none focus:shadow-outline"
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
