import React, { useState, useEffect } from 'react';
import { useBeneficiarios } from '../../../context/BeneficiariosContext';
import { RiCloseLine, RiDeleteBin6Line, RiAddCircleLine } from 'react-icons/ri';
import { show_alert } from '../alertFunctions'; // Asegúrate de importar correctamente la función show_alert

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
                    condicionEspecial: familiar.condicionEspecial || ''
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
                show_alert('Beneficiario actualizado exitosamente', 'success'); // Mostrar alerta de éxito al actualizar
            } else {
                await createBeneficiario(formData);
                show_alert('Beneficiario creado exitosamente', 'success'); // Mostrar alerta de éxito al crear
            }
            onClose();
        } catch (error) {
            console.error('Error al guardar el beneficiario:', error.response ? error.response.data : error.message);
            show_alert('Error al guardar el beneficiario', 'error'); // Mostrar alerta de error
        }
    };

    return (
        <div className="bg-white p-8 rounded-lg shadow-2xl max-w-4xl mx-auto mt-8 mb-8">
            <div className="grid grid-cols-2 gap-8">
                <h2 className="col-span-2 text-3xl font-semibold mb-6 text-center text-gray-800">{item ? 'Editar Beneficiario' : 'Agregar Beneficiario'}</h2>
                <div className="col-span-2 grid grid-cols-2 gap-8">
                    <div>
                        <label className="block text-gray-700 text-sm font-medium mb-2">Tipo de Documento</label>
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
                        <label className="block text-gray-700 text-sm font-medium mb-2">Identificación</label>
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
                        <label className="block text-gray-700 text-sm font-medium mb-2">Nombre</label>
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
                        <label className="block text-gray-700 text-sm font-medium mb-2">Teléfono</label>
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
                        <label className="block text-gray-700 text-sm font-medium mb-2">Dirección</label>
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
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-gray-700 text-sm font-medium mb-2">Documento</label>
                                    <input
                                        type="text"
                                        name="documento"
                                        value={familiar.documento}
                                        onChange={(e) => handleFamiliarChange(e, index)}
                                        className="shadow-sm border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-300"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 text-sm font-medium mb-2">Nombre</label>
                                    <input
                                        type="text"
                                        name="nombre"
                                        value={familiar.nombre}
                                        onChange={(e) => handleFamiliarChange(e, index)}
                                        className="shadow-sm border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-300"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-gray-700 text-sm font-medium mb-2">Condición Especial</label>
                                    <input
                                        type="text"
                                        name="condicionEspecial"
                                        value={familiar.condicionEspecial}
                                        onChange={(e) => handleFamiliarChange(e, index)}
                                        className="shadow-sm border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-300"
                                    />
                                </div>
                                <div className="flex justify-end items-end">
                                    <button
                                        type="button"
                                        onClick={() => removeFamiliar(index)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        <RiDeleteBin6Line size={24} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={addFamiliar}
                        className="flex items-center text-green-500 hover:text-green-700"
                    >
                        <RiAddCircleLine size={24} className="mr-2" /> Agregar Familiar
                    </button>
                </div>
                <div className="col-span-2 flex justify-end mt-6">
                    <button
                        type="button"
                        onClick={onClose}
                        className="bg-gray-500 text-white px-4 py-2 rounded-lg mr-4"
                    >
                        <RiCloseLine size={24} className="inline-block align-middle" /> Cancelar
                    </button>
                    <button
                        type="submit"
                        onClick={handleSubmit}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                    >
                        {item ? 'Actualizar Beneficiario' : 'Agregar Beneficiario'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModalBeneficiario;
