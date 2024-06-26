import React, { useState, useEffect } from 'react';
import { useBeneficiarios } from '../../../context/BeneficiariosContext';
import { RiCloseLine } from 'react-icons/ri';

const ModalBeneficiario = ({ onClose, item }) => {
    const { createBeneficiario, updateBeneficiario, beneficiarios } = useBeneficiarios();
    const [formData, setFormData] = useState({
        tipoDocumento: 'C.C',
        identificacion: '',
        nombre: '',
        telefono: '',
        correoElectronico: '',
        direccion: '',
        cantidadFamiliares: 0,
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
                correoElectronico: item.correoElectronico || '',
                direccion: item.direccion || '',
                cantidadFamiliares: item.cantidadFamiliares || 0,
                estado: item.estado || 'activo'
            });
        } else {
            setFormData({
                tipoDocumento: 'C.C',
                identificacion: '',
                nombre: '',
                telefono: '',
                correoElectronico: '',
                direccion: '',
                cantidadFamiliares: 0,
                estado: 'activo'
            });
        }
    }, [item]);

    const checkIfExists = (identificacion) => {
        return beneficiarios.some(beneficiario => {
            if (beneficiario.identificacion && identificacion) {
                return beneficiario.identificacion.toString().toLowerCase().trim() === identificacion.toString().toLowerCase().trim();
            }

            return false;
        });
    };

    const handleValidation = (name, value) => {
        const newErrors = { ...errors };

        if (name === 'identificacion') {
            if (!value) newErrors.identificacion = 'Este campo es obligatorio';
            else if (!/^\d{8,10}$/.test(value)) newErrors.identificacion = 'El documento debe contener entre 8 y 10 dígitos numéricos';
            else if (checkIfExists(value)) newErrors.identificacion = 'El beneficiario ya existe.';
            else delete newErrors.identificacion;
        } else if (name === 'nombre') {
            if (!value) newErrors.nombre = 'Este campo es obligatorio';
            else if (!/^[a-zA-Z\s]+$/.test(value)) newErrors.nombre = 'El nombre solo debe contener letras y espacios';
            else delete newErrors.nombre;
        } else if (name === 'telefono') {
            if (!value) newErrors.telefono = 'Este campo es obligatorio';
            else if (value.toString().length !== 10) newErrors.telefono = 'El teléfono debe tener 10 dígitos numéricos';
            else delete newErrors.telefono;
        } else if (name === 'correoElectronico') {
            if (value && !/.+@.+\..+/.test(value)) newErrors.correoElectronico = 'Ingrese un correo electrónico válido';
            else delete newErrors.correoElectronico;
        } else if (name === 'direccion') {
            if (!value) newErrors.direccion = 'Este campo es obligatorio';
            else if (value.length < 5) newErrors.direccion = 'La dirección debe tener al menos 5 caracteres';
            else delete newErrors.direccion;
        } else if (name === 'cantidadFamiliares') {
            if (!value) newErrors.cantidadFamiliares = 'Este campo es obligatorio';
            else if (value < 0 || value > 10) newErrors.cantidadFamiliares = 'Cantidad de familiares debe estar entre 0 y 10';
            else delete newErrors.cantidadFamiliares;
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
                await updateBeneficiario(item._id, formData);
            } else {
                await createBeneficiario(formData);
            }
            onClose();
        } catch (error) {
            console.error('Error saving item:', error.response ? error.response.data : error.message);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-2xl max-w-lg mx-auto mt-8 mb-8">
            <div className="p-8">
                <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">{item ? 'Editar Beneficiario' : 'Agregar Beneficiario'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-2">Tipo de Documento</label>
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
                            <label className="block text-gray-700 text-sm font-medium mb-2">Nombre</label>
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
                            <label className="block text-gray-700 text-sm font-medium mb-2">Teléfono</label>
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
                            <label className="block text-gray-700 text-sm font-medium mb-2">Cantidad de Familiares</label>
                            <input
                                type="number"
                                name="cantidadFamiliares"
                                value={formData.cantidadFamiliares}
                                onChange={handleChange}
                                className={`shadow-sm border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-300 ${errors.cantidadFamiliares ? 'border-red-500' : ''}`}
                                required
                            />
                            {errors.cantidadFamiliares && <p className="text-red-500 text-sm mt-1">{errors.cantidadFamiliares}</p>}
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-2">Identificación</label>
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
                            <label className="block text-gray-700 text-sm font-medium mb-2">Correo Electrónico</label>
                            <input
                                type="email"
                                name="correoElectronico"
                                value={formData.correoElectronico}
                                onChange={handleChange}
                                className="shadow-sm border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-300"
                            />
                            {errors.correoElectronico && <p className="text-red-500 text-sm mt-1">{errors.correoElectronico}</p>}
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-2">Dirección</label>
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
                </form>
            </div>
        </div>
    );
};

export default ModalBeneficiario;
