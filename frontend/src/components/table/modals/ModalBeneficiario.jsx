import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const ModalBeneficiario = ({ onClose, item, fetchData }) => {
    const [formData, setFormData] = useState({
        tipoDocumento: 'C.C',
        identificacion: '',
        nombre: '',
        telefono: '',
        correoElectronico: '',
        direccion: '',
        cantidadFamiliares: 1,
        estado: 'activo'
    });

    const [errors, setErrors] = useState({});

    const modalRef = useRef();

    useEffect(() => {
        if (item) {
            setFormData({
                tipoDocumento: item.tipoDocumento || 'C.C',
                identificacion: item.identificacion || '',
                nombre: item.nombre || '',
                telefono: item.telefono || '',
                correoElectronico: item.correoElectronico || '',
                direccion: item.direccion || '',
                cantidadFamiliares: item.cantidadFamiliares || 1,
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
                cantidadFamiliares: 1,
                estado: 'activo'
            });
        }
    }, [item]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onClose]);

    const validateField = (name, value) => {
        let error = '';

        switch (name) {
            case 'identificacion':
                if (!/^\d{8,10}$/.test(value)) {
                    error = 'La identificación debe tener entre 8 y 10 dígitos.';
                }
                break;
            case 'nombre':
                if (!/^[a-zA-Z\s]+$/.test(value)) {
                    error = 'El nombre solo debe contener letras.';
                }
                break;
            case 'telefono':
                if (!/^\d{10}$/.test(value)) {
                    error = 'El teléfono debe tener 10 dígitos.';
                }
                break;
            case 'correoElectronico':
                if (value && !/.+\@.+\..+/.test(value)) {
                    error = 'Ingrese un correo electrónico válido.';
                }
                break;
            case 'direccion':
                if (value.length < 5) {
                    error = 'La dirección debe tener al menos 5 caracteres.';
                } else if (!/^[a-zA-Z0-9\s,.#-]+$/.test(value)) {
                    error = 'La dirección solo puede contener letras, números, espacios y los caracteres , . - #';
                }
                break;
            case 'cantidadFamiliares':
                if (isNaN(value) || value <= 0) {
                    error = 'La cantidad de familiares debe ser un número mayor a 0.';
                } else if (value > 10) {
                    error = 'La cantidad de familiares no puede exceder de 10.';
                }
                break;
            default:
                break;
        }

        setErrors(prevErrors => ({
            ...prevErrors,
            [name]: error
        }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));
        validateField(name, value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (item) {
                await axios.put(`http://localhost:3002/beneficiarios/${item._id}`, formData);
            } else {
                await axios.post('http://localhost:3002/beneficiarios', formData);
            }
            fetchData();
            onClose();
        } catch (error) {
            console.error('Error saving item:', error.response ? error.response.data : error.message);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
            <div ref={modalRef} className="bg-white rounded-lg shadow-2xl max-w-lg mx-auto mt-8 mb-8">
                <div className="p-8 flex gap-8">
                    <div className="flex-1">
                        <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">{item ? 'Editar Beneficiario' : 'Agregar Beneficiario'}</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
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
                                <label className="block text-gray-700 text-sm font-medium mb-2">Identificación</label>
                                <input
                                    type="text"
                                    name="identificacion"
                                    value={formData.identificacion}
                                    onChange={handleChange}
                                    className="shadow-sm border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-300"
                                    required
                                />
                                {errors.identificacion && <p className="text-red-500 text-xs italic">{errors.identificacion}</p>}
                            </div>
                            <div>
                                <label className="block text-gray-700 text-sm font-medium mb-2">Nombre</label>
                                <input
                                    type="text"
                                    name="nombre"
                                    value={formData.nombre}
                                    onChange={handleChange}
                                    className="shadow-sm border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-300"
                                    required
                                />
                                {errors.nombre && <p className="text-red-500 text-xs italic">{errors.nombre}</p>}
                            </div>
                            <div>
                                <label className="block text-gray-700 text-sm font-medium mb-2">Teléfono</label>
                                <input
                                    type="text"
                                    name="telefono"
                                    value={formData.telefono}
                                    onChange={handleChange}
                                    className="shadow-sm border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-300"
                                    required
                                />
                                {errors.telefono && <p className="text-red-500 text-xs italic">{errors.telefono}</p>}
                            </div>
                        </form>
                    </div>
                    <div className="flex-1">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-gray-700 text-sm font-medium mb-2">Correo Electrónico</label>
                                <input
                                    type="email"
                                    name="correoElectronico"
                                    value={formData.correoElectronico}
                                    onChange={handleChange}
                                    className="shadow-sm border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-300"
                                />
                                {errors.correoElectronico && <p className="text-red-500 text-xs italic">{errors.correoElectronico}</p>}
                            </div>
                            <div>
                                <label className="block text-gray-700 text-sm font-medium mb-2">Dirección</label>
                                <input
                                    type="text"
                                    name="direccion"
                                    value={formData.direccion}
                                    onChange={handleChange}
                                    className="shadow-sm border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-300"
                                    required
                                />
                                {errors.direccion && <p className="text-red-500 text-xs italic">{errors.direccion}</p>}
                            </div>
                            <div>
                                <label className="block text-gray-700 text-sm font-medium mb-2">Cantidad de Familiares</label>
                                <input
                                    type="number"
                                    name="cantidadFamiliares"
                                    value={formData.cantidadFamiliares}
                                    onChange={handleChange}
                                    className="shadow-sm border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-300"
                                    required
                                />
                                {errors.cantidadFamiliares && <p className="text-red-500 text-xs italic">{errors.cantidadFamiliares}</p>}
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
                                    className="bg-gradient-to-r from-blue-200 to-blue-500 hover:from-blue-300  hover:to-blue-700 text-white font-bold py-2 px-6  focus:outline-none focus:shadow-outline rounded-lg"
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
        </div>
    );
};

export default ModalBeneficiario;
