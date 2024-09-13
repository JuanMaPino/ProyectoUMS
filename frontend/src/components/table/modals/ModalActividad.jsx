import React, { useState, useEffect } from 'react';
import { useProyectos } from '../../../context/ProyectosContext';
import axios from 'axios';

const ModalActividad = ({ onClose, item, proyectoId }) => {
    const { createActividad, updateActividad } = useProyectos();
    const [insumos, setInsumos] = useState([]);
    const [tareas, setTareas] = useState([]);
    const [beneficiarios, setBeneficiarios] = useState([]);
    const [formData, setFormData] = useState({
        nombre: '',
        tipo: 'Recreativa',
        descripcion: '',
        tareas: [],
        insumos: [],
        beneficiarios: [],
        estado: 'activo'
    });
    
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const fetchInsumos = async () => {
            try {
                const response = await axios.get('http://localhost:3002/insumos');
                setInsumos(response.data);
            } catch (error) {
                console.error('Error fetching insumos:', error.message);
            }
        };

        const fetchTareas = async () => {
            try {
                const response = await axios.get('http://localhost:3002/tareas');
                setTareas(response.data);
            } catch (error) {
                console.error('Error fetching tareas:', error.message);
            }
        };

        const fetchBeneficiarios = async () => {
            try {
                const response = await axios.get('http://localhost:3002/beneficiarios');
                setBeneficiarios(response.data);
            } catch (error) {
                console.error('Error fetching beneficiarios:', error.message);
            }
        };

        fetchInsumos();
        fetchTareas();
        fetchBeneficiarios();

        if (item) {
            setFormData({
                nombre: item.nombre || '',
                tipo: item.tipo || 'Recreativa',
                descripcion: item.descripcion || '',
                tareas: item.tareas || [],
                insumos: item.insumos || [],
                beneficiarios: item.beneficiarios || [],
                estado: item.estado || 'activo',
            });
        }
    }, [item]);

    const handleValidation = (name, value) => {
        const newErrors = { ...errors };

        if (name === 'nombre' || name === 'descripcion') {
            if (!value) {
                newErrors[name] = `El campo ${name} es obligatorio`;
            } else if (!/^[A-Za-záéíóúüñÁÉÍÓÚÜÑ\s]+$/.test(value)) {
                newErrors[name] = `El campo ${name} solo permite letras y espacios.`;
            } else {
                delete newErrors[name];
            }
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
                await updateActividad(proyectoId, item._id, formData);
            } else {
                await createActividad(proyectoId, formData);
            }
            onClose();
        } catch (error) {
            console.error('Error saving activity:', error.message);
        }
    };

    // Tareas
    const handleAddTarea = () => {
        setFormData(prevState => ({
            ...prevState,
            tareas: [...prevState.tareas, { _id: '', nombre: '' }]
        }));
    };

    const handleRemoveTarea = (index) => {
        const newTareas = formData.tareas.filter((_, i) => i !== index);
        setFormData(prevState => ({
            ...prevState,
            tareas: newTareas
        }));
    };

    const handleTareaChange = (index, e) => {
        const { value } = e.target;
        const selectedTarea = tareas.find(t => t._id === value);
        const newTareas = [...formData.tareas];
        newTareas[index] = selectedTarea ? { _id: selectedTarea._id, nombre: selectedTarea.nombre } : {};
        setFormData(prevState => ({
            ...prevState,
            tareas: newTareas
        }));
    };

    // Insumos
    const handleAddInsumo = () => {
        setFormData(prevState => ({
            ...prevState,
            insumos: [...prevState.insumos, { insumo: '', cantidad: '' }]
        }));
    };

    const handleRemoveInsumo = (index) => {
        const newInsumos = formData.insumos.filter((_, i) => i !== index);
        setFormData(prevState => ({
            ...prevState,
            insumos: newInsumos
        }));
    };

    const handleInsumoChange = (index, field, value) => {
        const newInsumos = [...formData.insumos];
        if (field === 'insumo') {
            const selectedInsumo = insumos.find(i => i._id === value);
            newInsumos[index] = {
                ...newInsumos[index],
                insumo: value,
                nombre: selectedInsumo ? selectedInsumo.nombre : ''
            };
        } else {
            newInsumos[index] = {
                ...newInsumos[index],
                [field]: value
            };
        }
        setFormData(prevState => ({
            ...prevState,
            insumos: newInsumos
        }));
    };

    // Beneficiarios
    const handleAddBeneficiario = () => {
        setFormData(prevState => ({
            ...prevState,
            beneficiarios: [...prevState.beneficiarios, {_id: '', nombre: '' }]
        }));
    };

    const handleRemoveBeneficiario = (index) => {
        const newBeneficiarios = formData.beneficiarios.filter((_, i) => i !== index);
        setFormData(prevState => ({
            ...prevState,
            beneficiarios: newBeneficiarios
        }));
    };

    const handleBeneficiarioChange = (index, field, value) => {
        const newBeneficiarios = [...formData.beneficiarios];
        if (field === 'beneficiario') {
            const selectedBeneficiario = beneficiarios.find(b => b._id === value);
            newBeneficiarios[index] = {
                _id: value, // Corregir asignación del _id
                nombre: selectedBeneficiario ? selectedBeneficiario.nombre : '' // Corregir asignación del nombre
            };
        } else {
            newBeneficiarios[index] = {
                ...newBeneficiarios[index],
                [field]: value
            };
        }
        setFormData(prevState => ({
            ...prevState,
            beneficiarios: newBeneficiarios
        }));
    };

    return (
        <div className="bg-white rounded-lg shadow-2xl max-w-4xl mx-auto mt-8 mb-8 max-h-[90vh] overflow-y-auto">
            <div className="p-8">
                <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">{item ? 'Editar Actividad' : 'Agregar Actividad'}</h2>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-gray-700 text-sm font-medium mb-2">Nombre<span className="text-red-500 text-sm">*</span></label>
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
                        <label className="block text-gray-700 text-sm font-medium mb-2">Tipo<span className="text-red-500 text-sm">*</span></label>
                        <select
                            name="tipo"
                            value={formData.tipo}
                            onChange={handleChange}
                            className="shadow-sm border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-300"
                            required
                        >
                            <option value="Recreativa">Recreativa</option>
                            <option value="Educativa">Educativa</option>
                        </select>
                    </div>
                    <div className="sm:col-span-2">
                        <label className="block text-gray-700 text-sm font-medium mb-2">Descripción<span className="text-red-500 text-sm">*</span></label>
                        <textarea
                            name="descripcion"
                            value={formData.descripcion}
                            onChange={handleChange}
                            className={`shadow-sm border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-300 ${errors.descripcion ? 'border-red-500' : ''}`}
                            required
                        />
                        {errors.descripcion && <p className="text-red-500 text-sm mt-1">{errors.descripcion}</p>}
                    </div>

                    {/* Tareas */}
                    <div className="sm:col-span-2">
                        <label className="block text-gray-700 text-sm font-medium mb-2">Tareas</label>
                        {formData.tareas.map((tarea, index) => (
                            <div key={index} className="flex items-center space-x-4 mb-2">
                                <select
                                    value={tarea._id}
                                    onChange={(e) => handleTareaChange(index, e)}
                                    className="shadow-sm border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-300"
                                >
                                    <option value="">Selecciona una tarea</option>
                                    {tareas.map(t => (
                                        <option key={t._id} value={t._id}>{t.nombre}</option>
                                    ))}
                                </select>
                                <button
                                    type="button"
                                    onClick={() => handleRemoveTarea(index)}
                                    className="bg-red-500 text-white px-4 py-2 rounded"
                                >
                                    Eliminar
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={handleAddTarea}
                            className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
                        >
                            Agregar Tarea
                        </button>
                    </div>

                    {/* Insumos */}
                    <div className="sm:col-span-2">
                        <label className="block text-gray-700 text-sm font-medium mb-2">Insumos</label>
                        {formData.insumos.map((insumo, index) => (
                            <div key={index} className="flex items-center space-x-4 mb-2">
                                <select
                                    value={insumo.insumo}
                                    onChange={(e) => handleInsumoChange(index, 'insumo', e.target.value)}
                                    className="shadow-sm border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-300"
                                >
                                    <option value="">Selecciona un insumo</option>
                                    {insumos.map(i => (
                                        <option key={i._id} value={i._id}>{i.nombre}</option>
                                    ))}
                                </select>
                                <input
                                    type="number"
                                    value={insumo.cantidad}
                                    onChange={(e) => handleInsumoChange(index, 'cantidad', e.target.value)}
                                    className="shadow-sm border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-300"
                                    placeholder="Cantidad"
                                />
                                <button
                                    type="button"
                                    onClick={() => handleRemoveInsumo(index)}
                                    className="bg-red-500 text-white px-4 py-2 rounded"
                                >
                                    Eliminar
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={handleAddInsumo}
                            className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
                        >
                            Agregar Insumo
                        </button>
                    </div>

                    {/* Beneficiarios */}
                    <div className="sm:col-span-2">
                        <label className="block text-gray-700 text-sm font-medium mb-2">Beneficiarios</label>
                        {formData.beneficiarios.map((beneficiario, index) => (
                            <div key={index} className="flex items-center space-x-4 mb-2">
                                <select
                                    value={beneficiario._id} // Cambiado para que use _id en lugar de beneficiario.beneficiario
                                    onChange={(e) => handleBeneficiarioChange(index, 'beneficiario', e.target.value)}
                                    className="shadow-sm border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-300"
                                >
                                    <option value="">Selecciona un beneficiario</option>
                                    {beneficiarios.map(b => (
                                        <option key={b._id} value={b._id}>{b.nombre}</option>
                                    ))}
                                </select>
                                <button
                                    type="button"
                                    onClick={() => handleRemoveBeneficiario(index)}
                                    className="bg-red-500 text-white px-4 py-2 rounded"
                                >
                                    Eliminar
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={handleAddBeneficiario}
                            className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
                        >
                            Agregar Beneficiario
                        </button>
                    </div>

                    <div className="sm:col-span-2 flex justify-end">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-gray-500 text-white px-4 py-2 rounded mr-4"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-500 text-white px-4 py-2 rounded"
                        >
                            {item ? 'Actualizar' : 'Guardar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ModalActividad;
