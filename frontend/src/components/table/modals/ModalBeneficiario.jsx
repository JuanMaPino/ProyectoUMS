import React, { useState, useEffect } from 'react';
import { useBeneficiarios } from '../../../context/BeneficiariosContext';
import { RiCloseLine, RiDeleteBin6Line, RiAddCircleLine } from 'react-icons/ri';
import { showToast } from '../../table/alertFunctions'; // Ajustar la ruta según tu estructura

const ModalBeneficiario = ({ onClose, item }) => {
    const { createBeneficiario, updateBeneficiario } = useBeneficiarios();
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
                familiares: item.familiares.map(familiar => ({
                    documento: familiar.documento || '',
                    nombre: familiar.nombre || '',
                    condicionEspecial: familiar.condicionEspecial || '',
                    parentesco: familiar.parentesco || ''
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
    
    const validateField = (name, value) => {
        let error = '';
        switch (name) {
            case 'identificacion':
                if (!/^\d{8,10}$/.test(value)) {
                    error = 'El documento debe contener entre 8 y 10 dígitos numéricos';
                } else if (/^0/.test(value)) {
                    error = 'El documento no puede comenzar con 0';
                }
                break;
            case 'nombre':
                if (!/^[a-zA-Z\s]+$/.test(value)) {
                    error = 'El nombre solo debe contener letras y espacios';
                }
                break;
            case 'telefono':
                if (!/^\d{10}$/.test(value)) {
                    error = 'El teléfono debe tener 10 dígitos numéricos';
                } else if (/^0/.test(value)) {
                    error = 'El Telefono no puede comenzar con 0';
                }
                break;
            case 'correoElectronico':
                if (value && !/.+@.+\..+/.test(value)) {
                    error = 'Ingrese un correo electrónico válido';
                }
                break;
            case 'direccion':
                if (value.length < 5) {
                    error = 'La dirección debe tener al menos 5 caracteres';
                }
                break;
            default:
                break;
        }
        setErrors(prevState => ({ ...prevState, [name]: error }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));
        validateField(name, value);
    };

    const handleFamiliarChange = (e, index) => {
        const { name, value } = e.target;
        const updatedFamiliares = [...formData.familiares];
        updatedFamiliares[index] = { ...updatedFamiliares[index], [name]: value };
        setFormData(prevState => ({ ...prevState, familiares: updatedFamiliares }));
        validateField(name, value);
    };

    const addFamiliar = () => {
        setFormData(prevState => ({
            ...prevState,
            familiares: [...prevState.familiares, { documento: '', nombre: '', condicionEspecial: '' }]
        }));
    };

    const removeFamiliar = (index) => {
        const updatedFamiliares = [...formData.familiares];
        updatedFamiliares.splice(index, 1);
        setFormData(prevState => ({ ...prevState, familiares: updatedFamiliares }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const hasErrors = Object.values(errors).some(error => error);
        if (hasErrors) {
            console.error('Validation errors:', errors);
            return;
        }

        try {
            if (item && item._id) {
                await updateBeneficiario(item._id, formData);
                showToast('Beneficiario actualizado exitosamente', 'success'); // Mostrar alerta de éxito al actualizar
            } else {
                await createBeneficiario(formData);
                showToast('Beneficiario creado exitosamente', 'success'); // Mostrar alerta de éxito al crear
            }
            onClose();
        } catch (error) {
            console.error('Error al guardar el beneficiario:', error.response ? error.response.data : error.message);
            showToast('Error al guardar el beneficiario', 'error'); // Mostrar alerta de error
        }
    };

    return (
        <div className="bg-white p-8 rounded-lg shadow-2xl max-w-4xl mx-auto mt-8 mb-8 max-h-[90vh] overflow-y-auto">
            <div className="grid grid-cols-2 gap-8">
                <h2 className="col-span-2 text-3xl font-semibold mb-6 text-center text-gray-800">{item ? 'Editar Beneficiario' : 'Agregar Beneficiario'}</h2>
                <div className="col-span-2 grid grid-cols-2 gap-8">
                    <div>
                        <label className="block text-gray-700 text-sm font-medium mb-2">Tipo de Documento<span className="text-red-500 text-sm">*</span></label>
                        <select
                            name="tipoDocumento"
                            value={formData.tipoDocumento}
                            onChange={handleChange}
                            className="shadow-sm border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-300"
                        >
                            <option value="C.C">C.C</option>
                            <option value="C.E">C.E</option>
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
                        />
                        {errors.identificacion && <p className="text-red-500 text-sm">{errors.identificacion}</p>}
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-medium mb-2">Nombre<span className="text-red-500 text-sm">*</span></label>
                        <input
                            type="text"
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleChange}
                            className={`shadow-sm border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-300 ${errors.nombre ? 'border-red-500' : ''}`}
                        />
                        {errors.nombre && <p className="text-red-500 text-sm">{errors.nombre}</p>}
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-medium mb-2">Teléfono<span className="text-red-500 text-sm">*</span></label>
                        <input
                            type="text"
                            name="telefono"
                            value={formData.telefono}
                            onChange={handleChange}
                            className={`shadow-sm border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-300 ${errors.telefono ? 'border-red-500' : ''}`}
                        />
                        {errors.telefono && <p className="text-red-500 text-sm">{errors.telefono}</p>}
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
                        {errors.correoElectronico && <p className="text-red-500 text-sm">{errors.correoElectronico}</p>}
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-medium mb-2">Dirección<span className="text-red-500 text-sm">*</span></label>
                        <input
                            type="text"
                            name="direccion"
                            value={formData.direccion}
                            onChange={handleChange}
                            className={`shadow-sm border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-300 ${errors.direccion ? 'border-red-500' : ''}`}
                        />
                        {errors.direccion && <p className="text-red-500 text-sm">{errors.direccion}</p>}
                    </div>
                </div>
                <div className="col-span-2">
                    <label className="block text-gray-700 text-sm font-medium mb-2">Familiares</label>
                    {formData.familiares.map((familiar, index) => (
                        <div key={index} className="border rounded p-4 mb-4">
                            <h3 className="text-xl font-medium mb-2">Familiar #{index + 1}</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-gray-700 text-sm font-medium mb-2">Documento<span className="text-red-500 text-sm">*</span></label>
                                    <input
                                        type="text"
                                        name="documento"
                                        value={familiar.documento}
                                        onChange={(e) => handleFamiliarChange(e, index)}
                                        className="shadow-sm border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-300"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 text-sm font-medium mb-2">Nombre<span className="text-red-500 text-sm">*</span></label>
                                    <input
                                        type="text"
                                        name="nombre"
                                        value={familiar.nombre}
                                        onChange={(e) => handleFamiliarChange(e, index)}
                                        className="shadow-sm border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-300"
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-gray-700 text-sm font-medium mb-2">Condición Especial</label>
                                    <input
                                        type="text"
                                        name="condicionEspecial"
                                        value={familiar.condicionEspecial}
                                        onChange={(e) => handleFamiliarChange(e, index)}
                                        className="shadow-sm border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-300"
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-gray-700 text-sm font-medium mb-2">Parentesco<span className="text-red-500 text-sm">*</span></label>
                                    <input
                                        type="text"
                                        name="parentesco"
                                        value={familiar.parentesco}
                                        onChange={(e) => handleFamiliarChange(e, index)}
                                        className="shadow-sm border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-300"
                                    />
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => removeFamiliar(index)}
                                className="text-red-500 mt-2 hover:text-red-700 focus:outline-none border-2 border-gradient-to-r border-red-400  hover:border-red-600 hover:from-red-600 hover:to-red-700 py-1 px-2 rounded-lg "
                            >
                                <RiDeleteBin6Line className="inline-block mr-1" />
                                Eliminar Familiar
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={addFamiliar}
                        className="bg-gradient-to-l from-indigo-400 to-indigo-600 hover:from-indigo-600 hover:to-indigo-800 text-white font-bold py-2 px-6 rounded-lg focus:outline-none focus:shadow-outline"
                    >
                        <RiAddCircleLine className="inline-block mr-1" />
                        Agregar Familiar
                    </button>
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
                        {item ? 'Actualizar Beneficiario' : 'Agregar Beneficiaro'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModalBeneficiario;
