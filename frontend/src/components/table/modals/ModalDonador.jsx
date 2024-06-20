import React, { useState, useEffect } from 'react';
import { useDonadores } from '../../../context/DonadoresContext';

const ModalDonador = ({ onClose, item }) => {
    const { createDonador, updateDonador } = useDonadores();
    const [formData, setFormData] = useState({
        identificacion: '',
        nombre: '',
        tipoDonador: 'Natural',
        tipoDocumen: 'C.C',
        telefono: '',
        direccion: '',
        correoElectronico: '',
        estado: 'activo'
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (item && item._id) {
                await updateDonador(item._id, formData);
            } else {
                await createDonador(formData);
            }
            onClose();
        } catch (error) {
            console.error('Error saving item:', error.response ? error.response.data : error.message);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-2xl max-w-lg mx-auto mt-8 mb-8">
            <div className="p-8 flex gap-8">
                {/* Columna izquierda */}
                <div className="flex-1">
                    <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">{item ? 'Editar Donador' : 'Agregar Donador'}</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-2">Identificación</label>
                            <input
                                type="number"
                                name="identificacion"
                                value={formData.identificacion}
                                onChange={handleChange}
                                className="shadow-sm border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-300"
                                required
                            />
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
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-2">Tipo de Donador</label>
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
                {/* Columna derecha */}
                <div className="flex-1">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-2">Tipo de Documento</label>
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
                            <label className="block text-gray-700 text-sm font-medium mb-2">Teléfono</label>
                            <input
                                type="text"
                                name="telefono"
                                value={formData.telefono}
                                onChange={handleChange}
                                className="shadow-sm border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-300"
                            />
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
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-2">Correo Electrónico</label>
                            <input
                                type="email"
                                name="correoElectronico"
                                value={formData.correoElectronico}
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
                            >
                                <option value="activo">Activo</option>
                                <option value="inactivo">Inactivo</option>
                            </select>
                        </div>
                        <div className="flex justify-end space-x-4">
                            <button
                                type="submit"
                                className="bg-gradient-to-r from-blue-200 to-blue-500 hover:from-blue-300  hover:to-blue-700 text-white font-bold py-2 px-6 rounded-lg focus:outline-none focus:shadow-outline"
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
    );
};

export default ModalDonador;
