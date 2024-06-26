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
        familiares: [], // Array para almacenar los familiares
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
                familiares: item.familiares || [], // Cargar familiares si existen
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
                familiares: [],
                estado: 'activo'
            });
        }
    }, [item]);

    // Función para manejar cambios en los campos de familiares
    const handleFamiliarChange = (index, field, value) => {
        const updatedFamiliares = [...formData.familiares];
        updatedFamiliares[index][field] = value;
        setFormData(prevState => ({
            ...prevState,
            familiares: updatedFamiliares
        }));
    };

    // Función para agregar un nuevo familiar
    const handleAddFamiliar = () => {
        setFormData(prevState => ({
            ...prevState,
            familiares: [...prevState.familiares, { nombre: '', documento: '', condicionEspecial: '' }]
        }));
    };

    // Función para eliminar un familiar
    const handleRemoveFamiliar = (index) => {
        const updatedFamiliares = [...formData.familiares];
        updatedFamiliares.splice(index, 1);
        setFormData(prevState => ({
            ...prevState,
            familiares: updatedFamiliares
        }));
    };

    // Función para validar los campos de familiares
    const validateFamiliares = () => {
        const newErrors = { ...errors };
        formData.familiares.forEach((familiar, index) => {
            if (!familiar.nombre || !familiar.documento || !familiar.relacion) {
                newErrors[`familiares.${index}`] = 'Todos los campos de los familiares son obligatorios';
            } else {
                delete newErrors[`familiares.${index}`];
            }
        });
        setErrors(newErrors);
    };

    // Función para manejar cambios generales en el formulario
    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name.startsWith('familiares')) {
            const [_, famIndex, famField] = name.split('.');
            handleFamiliarChange(parseInt(famIndex), famField, value);
        } else {
            setFormData(prevState => ({
                ...prevState,
                [name]: value
            }));
        }
    };

    // Función para manejar el envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validar todos los campos, incluidos los familiares
        const allErrors = { ...errors };
        Object.keys(formData).forEach(key => handleValidation(key, formData[key]));
        validateFamiliares();

        if (Object.keys(allErrors).length > 0) {
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

                    {/* Sección de Familiares */}
                    <div>
                        <label className="block text-gray-700 text-sm font-medium mb-2">Familiares</label>
                        {formData.familiares.map((familiar, index) => (
                            <div key={index} className="grid grid-cols-3 gap-4 mb-4">
                                <div>
                                    <input
                                        type="text"
                                        name={`familiares.${index}.nombre`}
                                        value={familiar.nombre}
                                        onChange={handleChange}
                                        className="shadow-sm border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-300"
                                        placeholder={`Nombre del Familiar ${index + 1}`}
                                        required
                                    />
                                    {errors[`familiares.${index}.nombre`] && <p className="text-red-500 text-sm mt-1">{errors[`familiares.${index}.nombre`]}</p>}
                                </div>
                                <div>
                                    <input
                                        type="text"
                                        name={`familiares.${index}.documento`}
                                        value={familiar.documento}
                                        onChange={handleChange}
                                        className="shadow-sm border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-300"
                                        placeholder={`Documento del Familiar ${index + 1}`}
                                        required
                                    />
                                    {errors[`familiares.${index}.documento`] && <p className="text-red-500 text-sm mt-1">{errors[`familiares.${index}.documento`]}</p>}
                                </div>
                                <div>
                                    <input
                                        type="text"
                                        name={`familiares.${index}.condicionEspecial`}
                                        value={familiar.condicionEspecial}
                                        onChange={handleChange}
                                        className="shadow-sm border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-300"
                                        placeholder={`Relación del Familiar ${index + 1}`}
                                        required
                                    />
                                    {errors[`familiares.${index}.condicionEspecial`] && <p className="text-red-500 text-sm mt-1">{errors[`familiares.${index}.condicionEspecial`]}</p>}
                                </div>
                                <div className="flex items-center">
                                    <button type="button" onClick={() => handleRemoveFamiliar(index)} className="text-red-600">
                                        Eliminar
                                    </button>
                                </div>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={handleAddFamiliar}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            Agregar Familiar
                        </button>
                    </div>

                    {/* Botones */}
                    <div className="flex justify-end space-x-4 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline"
                        >
                            Cancelar
                        </button>

                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline"
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
