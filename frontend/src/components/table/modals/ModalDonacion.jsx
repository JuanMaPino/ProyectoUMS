import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { useDonaciones } from '../../../context/DonacionesContext';
import { useInsumos } from '../../../context/InsumosContext';
import { getAllDonadoresRequest } from '../../../api/ApiDonador';

const ModalDonacion = ({ onClose, item }) => {
    const { createDonacion, updateDonacion } = useDonaciones();
    const [donadores, setDonadores] = useState([]);
    const [formData, setFormData] = useState({
        documento: '',
        donador: '',
        fecha: '',
        tipo: 'Monetaria',
        donaciones: [], // Array para múltiples donaciones
    });
    const [selectedDonador, setSelectedDonador] = useState(null);
    const [validationErrors, setValidationErrors] = useState({});
    const { createInsumo, insumos, updateInsumo } = useInsumos();

    useEffect(() => {
        if (item) {
            setFormData({
                documento: item.documento || '',
                donador: item.donador ? item.donador._id : '',
                fecha: item.fecha || '',
                tipo: item.tipo || 'Monetaria',
                donaciones: item.donaciones || [],
            });
            setSelectedDonador(item.donador);
        } else {
            setFormData({
                documento: '',
                donador: '',
                fecha: '',
                tipo: 'Monetaria',
                donaciones: [],
            });
            setSelectedDonador(null);
        }
    }, [item]);

    useEffect(() => {
        const fetchDonadores = async () => {
            try {
                const res = await getAllDonadoresRequest();
                setDonadores(res.data);
            } catch (error) {
                console.error('Failed to fetch donadores', error);
            }
        };

        fetchDonadores();
    }, []);

    const validateField = (name, value) => {
        let error = '';
        switch (name) {
            case 'cantidad':
                if (value <= 0 || isNaN(value)) {
                    error = 'La cantidad debe ser un número mayor a 0.';
                }
                break;
            case 'nombre':
                if (!/^[A-Za-záéíóúüñÁÉÍÓÚÜÑ\s]+$/.test(value)) {
                    error = 'El nombre de la donación solo puede contener letras y espacios.';
                }
                break;
            default:
                if (!/^[A-ZÁÉÍÓÚÜÑ][a-záéíóúüñ\s]*$/.test(value)) {
                    error = 'Debe comenzar con mayúscula y contener solo letras y espacios.';
                }
                break;
        }
        setValidationErrors(prevState => ({ ...prevState, [name]: error }));
    };

    const handleChange = (e, index) => {
        const { name, value } = e.target;
        const updatedDonaciones = [...formData.donaciones];
        updatedDonaciones[index] = { ...updatedDonaciones[index], [name]: value };
        setFormData(prevState => ({ ...prevState, donaciones: updatedDonaciones }));
        validateField(name, value);
    };

    const handleSelectChange = (selectedOption) => {
        const selectedDonador = donadores.find(donador => donador._id === selectedOption.value);
        setFormData(prevState => ({ ...prevState, donador: selectedOption.value }));
        setSelectedDonador(selectedDonador);
    };

    const addDonacion = () => {
        setFormData(prevState => ({
            ...prevState,
            donaciones: [...prevState.donaciones, { nombre: '', cantidad: '' }],
        }));
    };

    const removeDonacion = (index) => {
        const updatedDonaciones = [...formData.donaciones];
        updatedDonaciones.splice(index, 1);
        setFormData(prevState => ({ ...prevState, donaciones: updatedDonaciones }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const hasErrors = Object.values(validationErrors).some(error => error);
        if (hasErrors) {
            console.error('Validation errors:', validationErrors);
            return;
        }
        try {
            const { donaciones, ...restData } = formData;
            if (item && item._id) {
                await updateDonacion(item._id, { ...restData, donaciones });
            } else {
                await createDonacion({ ...restData, donaciones });
            }
            onClose();
        } catch (error) {
            console.error('Error saving item:', error.response ? error.response.data : error.message);
        }
    };

    const documentOptions = donadores.map(donador => ({
        value: donador._id,
        label: `${donador.nombre} - ${donador.identificacion}`
    }));

    return (
        <div className="bg-white p-8 rounded-lg shadow-2xl max-w-4xl mx-auto mt-8 mb-8">
            <div className="grid grid-cols-2 gap-8">
                <h2 className="col-span-2 text-3xl font-semibold mb-6 text-center text-gray-800">{item ? 'Editar Donación' : 'Agregar Donación'}</h2>
                <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">Documento <span className="text-red-500">*</span></label>
                    <Select
                        name="donador"
                        value={documentOptions.find(option => option.value === formData.donador)}
                        onChange={handleSelectChange}
                        options={documentOptions}
                        className="shadow-sm border rounded w-full text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-300"
                        required
                    />
                </div>
                {selectedDonador && (
                    <div>
                        <label className="block text-gray-700 text-sm font-medium mb-2">Nombre del Donador <span className="text-red-500">*</span></label>
                        <p className="text-gray-800">{selectedDonador.nombre}</p>
                    </div>
                )}
                <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">Fecha <span className="text-red-500">*</span></label>
                    <input
                        type="date"
                        name="fecha"
                        value={formData.fecha}
                        onChange={(e) => setFormData(prevState => ({ ...prevState, fecha: e.target.value }))}
                        className="shadow-sm border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-300"
                        required
                    />
                </div>
                <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">Tipo de Donación <span className="text-red-500">*</span></label>
                    <select
                        name="tipo"
                        value={formData.tipo}
                        onChange={(e) => setFormData(prevState => ({ ...prevState, tipo: e.target.value }))}
                        className="shadow-sm border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-300"
                        required
                    >
                        <option value="Monetaria">Monetaria</option>
                        <option value="Material">Material</option>
                    </select>
                </div>
                {formData.donaciones.map((donacion, index) => (
                    <div key={index}>
                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-2">Donación {index + 1} <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                name="nombre"
                                value={donacion.nombre}
                                onChange={(e) => handleChange(e, index)}
                                className="shadow-sm border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-300"
                                required
                            />
                            {validationErrors.nombre && <p className="text-red-500 text-sm">{validationErrors.nombre}</p>}
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-2">Cantidad <span className="text-red-500">*</span></label>
                            <input
                                type="number"
                                name="cantidad"
                                value={donacion.cantidad}
                                onChange={(e) => handleChange(e, index)}
                                className="shadow-sm border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-300"
                                required
                            />
                            {validationErrors.cantidad && <p className="text-red-500 text-sm">{validationErrors.cantidad}</p>}
                        </div>
                        {index > 0 && (
                            <button
                                type="button"
                                onClick={() => removeDonacion(index)}
                                className="text-sm text-red-500 hover:text-red-700 focus:outline-none"
                            >
                                Eliminar donación
                            </button>
                        )}
                    </div>
                ))}
                <div className="col-span-2 flex justify-end">
                    <button
                        type="button"
                        onClick={addDonacion}
                        className="text-sm text-blue-500 hover:text-blue-700 focus:outline-none"
                    >
                        + Agregar otra donación
                    </button>
                </div>
            </div>
            <div className="flex justify-end mt-6">
                <button
                    onClick={handleSubmit}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                    {item ? 'Guardar cambios' : 'Agregar'}
                </button>
                <button
                    onClick={onClose}
                    className="ml-4 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                    Cancelar
                </button>
            </div>
        </div>
    );
};

export default ModalDonacion;
