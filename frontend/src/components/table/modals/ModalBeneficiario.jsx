import React, { useState, useEffect } from 'react';
import { useBeneficiarios } from '../../../context/BeneficiariosContext';
import { RiCloseLine, RiDeleteBin6Line, RiAddCircleLine } from 'react-icons/ri';

const ModalBeneficiario = ({ onClose, item }) => {
    const { createBeneficiario, updateBeneficiario, beneficiarios } = useBeneficiarios();
    const [formData, setFormData] = useState({
        tipoDocumento: 'C.C',
        identificacion: '',
        nombre: '',
        telefono: '',
        correoElectronico: '',
        direccion: '',
        familiares: [],
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
                familiares:  item.familiares.map(familiar => ({
                    documento: familiar.documento || '',
                    nombre: familiar.nombre || '',
                    nombre: familiar.condicionEspecial || ''
                })),
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
        }

        setErrors(newErrors);
    };

    const handleFamiliarValidation = (index, name, value) => {
        const newErrors = { ...errors };

        if (!newErrors.familiares) {
            newErrors.familiares = [];
        }

        if (!newErrors.familiares[index]) {
            newErrors.familiares[index] = {};
        }

        if (name === 'documento') {
            if (!value) newErrors.familiares[index].documento = 'Este campo es obligatorio';
            else if (!/^\d+$/.test(value)) newErrors.familiares[index].documento = 'El documento debe contener solo dígitos numéricos';
            else delete newErrors.familiares[index].documento;
        } else if (name === 'nombre') {
            if (!value) newErrors.familiares[index].nombre = 'Este campo es obligatorio';
            else if (!/^[a-zA-Z\s]+$/.test(value)) newErrors.familiares[index].nombre = 'El nombre solo debe contener letras y espacios';
            else delete newErrors.familiares[index].nombre;
        } else if (name === 'condicionEspecial') {
            if (!value) newErrors.familiares[index].condicionEspecial = 'Este campo es obligatorio';
            else delete newErrors.familiares[index].condicionEspecial;
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

    const handleFamiliarChange = (index, name, value) => {
        const updatedFamiliares = [...formData.familiares];
        updatedFamiliares[index] = {
            ...updatedFamiliares[index],
            [name]: value
        };

        setFormData(prevState => ({
            ...prevState,
            familiares: updatedFamiliares
        }));

        handleFamiliarValidation(index, name, value);
    };

    const handleAddFamiliar = () => {
        setFormData(prevState => ({
            ...prevState,
            familiares: [...prevState.familiares, { documento: '', nombre: '', condicionEspecial: '' }]
        }));
    };

    const handleRemoveFamiliar = (index) => {
        const updatedFamiliares = formData.familiares.filter((_, i) => i !== index);
        setFormData(prevState => ({
            ...prevState,
            familiares: updatedFamiliares
        }));

        const newErrors = { ...errors };
        if (newErrors.familiares) {
            newErrors.familiares = newErrors.familiares.filter((_, i) => i !== index);
            setErrors(newErrors);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        let validationErrors = {};

        // Validate main form fields
        Object.keys(formData).forEach(key => handleValidation(key, formData[key]));
        formData.familiares.forEach((familiar, index) => {
            Object.keys(familiar).forEach(key => handleFamiliarValidation(index, key, familiar[key]));
        });

        // Check for validation errors
        if (Object.keys(errors).length > 0) {
            validationErrors = { ...errors };
        }

        // Check for empty fields in formData
        if (!formData.identificacion || !formData.nombre || !formData.telefono || !formData.direccion) {
            validationErrors.formData = 'Todos los campos obligatorios deben estar llenos';
        }

        // Check for empty fields in familiares
        formData.familiares.forEach((familiar, index) => {
            if (!familiar.documento || !familiar.nombre || !familiar.condicionEspecial) {
                if (!validationErrors.familiares) {
                    validationErrors.familiares = [];
                }
                validationErrors.familiares[index] = 'Todos los campos obligatorios deben estar llenos';
            }
        });


        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
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
        <div className="bg-white rounded-lg shadow-2xl max-w-lg mx-auto mt-8 mb-8 max-h-[90vh] overflow-y-auto">
            <div className="p-8">
                <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">{item ? 'Editar Beneficiario' : 'Agregar Beneficiario'}</h2>
                <form className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-2">Tipo de Documento</label>
                            <select
                                name="tipoDocumento"
                                value={formData.tipoDocumento}
                                onChange={handleChange}
                                className="shadow-sm border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-300"
                            >
                                <option value="C.C">C.C</option>
                                <option value="T.I">T.I</option>
                                <option value="C.E">C.E</option>
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
                    
                    <div className="mt-6">
                        <label className="block text-gray-700 text-sm font-medium mb-2">Familiares</label>
                        {formData.familiares.map((familiar, index) => (
                            <div key={index} className="mb-4 p-4 border rounded">
                                <div className="mb-2">
                                    <label className="block text-gray-700 text-sm font-medium mb-1">Documento</label>
                                    <input
                                        type="number"
                                        name={`documento-${index}`}
                                        value={familiar.documento}
                                        onChange={(e) => handleFamiliarChange(index, 'documento', e.target.value)}
                                        className={`shadow-sm border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-300 ${errors.familiares && errors.familiares[index]?.documento ? 'border-red-500' : ''}`}
                                    />
                                    {errors.familiares && errors.familiares[index]?.documento && <p className="text-red-500 text-sm mt-1">{errors.familiares[index].documento}</p>}
                                </div>
                                <div className="mb-2">
                                    <label className="block text-gray-700 text-sm font-medium mb-1">Nombre</label>
                                    <input
                                        type="text"
                                        name={`nombre-${index}`}
                                        value={familiar.nombre}
                                        onChange={(e) => handleFamiliarChange(index, 'nombre', e.target.value)}
                                        className={`shadow-sm border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-300 ${errors.familiares && errors.familiares[index]?.nombre ? 'border-red-500' : ''}`}
                                    />
                                    {errors.familiares && errors.familiares[index]?.nombre && <p className="text-red-500 text-sm mt-1">{errors.familiares[index].nombre}</p>}
                                </div>
                                <div className="mb-2">
                                    <label className="block text-gray-700 text-sm font-medium mb-1">Condición Especial</label>
                                    <input
                                        type="text"
                                        name={`condicionEspecial-${index}`}
                                        value={familiar.condicionEspecial}
                                        onChange={(e) => handleFamiliarChange(index, 'condicionEspecial', e.target.value)}
                                        className={`shadow-sm border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-300 ${errors.familiares && errors.familiares[index]?.condicionEspecial ? 'border-red-500' : ''}`}
                                    />
                                    {errors.familiares && errors.familiares[index]?.condicionEspecial && <p className="text-red-500 text-sm mt-1">{errors.familiares[index].condicionEspecial}</p>}
                                </div>
                                <button type="button" onClick={() => handleRemoveFamiliar(index)} className="text-red-600">
                                    <RiDeleteBin6Line size={24} />
                                </button>
                                
                            </div>
                        ))}
                        <button type="button" onClick={handleAddFamiliar} className="text-green-600">
                            <RiAddCircleLine size={24} />
                        </button>
                    </div>

                    <div className="flex justify-end space-x-4 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-red-700 border-2 border-gradient-to-r border-red-400 hover:border-red-600 hover:from-red-600 hover:to-red-700 font-bold py-2 px-6 rounded-lg focus:outline-none focus:shadow-outline"
                        >
                            Cancelar
                        </button>

                        <button
                            type="button"
                            onClick={handleSubmit}
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
