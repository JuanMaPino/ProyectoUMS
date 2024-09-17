import React, { useState, useEffect } from 'react';
import { useProyectos } from '../../../context/ProyectosContext';
import axios from 'axios';
import showToast, { showAlert } from '../alertFunctions';

const ModalActividad = ({ onClose, item, proyectoId }) => {
    const { createActividad, updateActividad } = useProyectos();
    const [insumos, setInsumos] = useState([]);
    const [tareas, setTareas] = useState([]);
    const [beneficiarios, setBeneficiarios] = useState([]);
    const [ayudantes, setAyudantes] = useState([]); // Para almacenar los ayudantes disponibles
    const [formData, setFormData] = useState({
        nombre: '',
        tipo: 'Recreativa',
        descripcion: '',
        tareas: [],
        insumos: [],
        beneficiarios: [],
        estado: 'activo'
    });
    
    console.log("idproyecto",proyectoId)
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

        const fetchAyudantes = async () => {
            try {
                const response = await axios.get('http://localhost:3002/ayudantes');
                setAyudantes(response.data);
            } catch (error) {
                console.error('Error fetching ayudantes:', error.message);
            }
        };

        fetchInsumos();
        fetchTareas();
        fetchBeneficiarios();
        fetchAyudantes();

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

        if (name === 'insumos') {
            if (formData.insumos.some(insumo => !insumo.insumo || !insumo.cantidad)) {
                newErrors[name] = `Todos los insumos deben estar completos`;
            } else {
                delete newErrors[name];
            }
        }

        if (name === 'tareas') {
            if (formData.tareas.some(tarea => !tarea._id)) {
                newErrors[name] = `Todas las tareas deben ser seleccionadas`;
            } else {
                delete newErrors[name];
            }
        }

        setErrors(newErrors);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData(prevState => {
            const newFormData = {
                ...prevState,
                [name]: value
            };

            handleValidation(name, value);

            return newFormData;
        });
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
        setFormData(prevState => {
            const newFormData = {
                ...prevState,
                insumos: newInsumos
            };

            handleValidation('insumos', newInsumos);

            return newFormData;
        });
    };

    const handleTareaChange = (index, e) => {
        const { value } = e.target;
        const selectedTarea = tareas.find(t => t._id === value);
        const newTareas = [...formData.tareas];
        newTareas[index] = selectedTarea ? { _id: selectedTarea._id, nombre: selectedTarea.nombre } : {};
        setFormData(prevState => {
            const newFormData = {
                ...prevState,
                tareas: newTareas
            };

            handleValidation('tareas', newTareas);

            return newFormData;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        Object.keys(formData).forEach(key => handleValidation(key, formData[key]));

        if (Object.keys(errors).length > 0) {
            return;
        }

        try {
            // Verificar cantidades disponibles
            const insumosResponse = await axios.get('http://localhost:3002/insumos');
            const insumosDisponibles = insumosResponse.data;

            for (const insumo of formData.insumos) {
                const insumoDisponible = insumosDisponibles.find(i => i._id === insumo.insumo);
                if (insumoDisponible && insumo.cantidad > insumoDisponible.cantidad) {
                    showToast(`La cantidad de ${insumoDisponible.nombre} excede el disponible.`,`error`);
                    return;
                }
            }

            if (item && item._id) {
                await updateActividad(proyectoId, item._id, formData);
                showToast('Actividad actualizado correctamente.', 'success');
            } else {
                await createActividad(proyectoId, formData);
                showToast('Actividad creado correctamente.', 'success');
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
            tareas: [...prevState.tareas, { _id: '', ayudante: '' }]
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
        newTareas[index] = selectedTarea ? { _id: selectedTarea._id, ayudante: '' } : {};
        setFormData(prevState => ({
            ...prevState,
            tareas: newTareas
        }));
    };

    const handleAyudanteChange = (index, e) => {
        const { value } = e.target;
        const newTareas = [...formData.tareas];
        newTareas[index].ayudante = value;
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

                                {/* Select para elegir ayudante */}
                                <select
                                    value={tarea.ayudante}
                                    onChange={(e) => handleAyudanteChange(index, e)}
                                    className="shadow-sm border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-300"
                                >
                                    <option value="">Selecciona un ayudante</option>
                                    {ayudantes.map(a => (
                                        <option key={a._id} value={a._id}>{a.nombre}</option>
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
                                    value={beneficiario._id} 
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
