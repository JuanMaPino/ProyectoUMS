import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const ModalAyudante = ({ onClose, item, fetchData }) => {
    const [formData, setFormData] = useState({
        tipoDocumento: 'C.C',
        identificacion: '',
        nombre: '',
        telefono: '',
        correoElectronico: '',
        direccion: '',
        rol: 'alfabetizador',
        institucion: '',
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
                rol: item.rol || 'alfabetizador',
                institucion: item.institucion || '',
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
                rol: 'alfabetizador',
                institucion: '',
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
                await axios.put(`http://localhost:3002/ayudantes/${item._id}`, formData);
            } else {
                await axios.post('http://localhost:3002/ayudantes', formData);
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
                        <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">{item ? 'Editar Ayudante' : 'Agregar Ayudante'}</h2>
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
                                <label className="block text-gray-700 text-sm font-medium mb-2">Rol</label>
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
                                <label className="block text-gray-700 text-sm font-medium mb-2">Institución</label>
                                <input
                                    type="text"
                                    name="institucion"
                                    value={formData.institucion}
                                    onChange={handleChange}
                                    className="shadow-sm border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-300"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 text-sm font-medium mb-2">Estado</label>
                                <select
                                    name="estado"
                                    value={formData.estado}
                                    onChange={handleChange}
                                    className="shadow-sm border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-300"
                                    required
                                >
                                    <option value="activo">Activo</option>
                                    <option value="inactivo">Inactivo</option>
                                </select>
                            </div>
                            <div className="flex items-center justify-end">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                >
                                    {item ? 'Guardar' : 'Agregar'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModalAyudante;
