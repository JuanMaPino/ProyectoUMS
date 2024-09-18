import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { useDonaciones } from '../../../context/DonacionesContext';
import { useInsumos } from '../../../context/InsumosContext';
import { getAllDonadoresRequest } from '../../../api/ApiDonador';
import { showToast } from '../../table/alertFunctions'; // Ajusta la ruta según tu estructura

const ModalDonacion = ({ onClose, item }) => {
    const { createDonacion, updateDonacion } = useDonaciones();
    const { insumos, createInsumo, updateInsumo } = useInsumos();
    const [donadores, setDonadores] = useState([]);
    const [formData, setFormData] = useState({
        donador: '',
        fecha: '',
        tipo: 'Monetaria',
        donaciones: [],
    });
    const [validationErrors, setValidationErrors] = useState({});

    useEffect(() => {
        if (item) {
            setFormData({
                donador: item.donador ? item.donador._id : '',
                fecha: item.fecha ? item.fecha.split('T')[0] : '',
                tipo: item.tipo || 'Monetaria',
                donaciones: item.donaciones.map(donacion => ({
                    nombre: donacion.nombre || '',
                    cantidad: donacion.cantidad || 0
                }))
            });
        } else {
            setFormData({
                donador: '',
                fecha: '',
                tipo: 'Monetaria',
                donaciones: [],
            });
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
        setFormData(prevState => ({
            ...prevState,
            donador: selectedOption.value,
        }));
    };

    const addDonacion = () => {
        setFormData(prevState => ({
            ...prevState,
            donaciones: [...prevState.donaciones, { nombre: '', cantidad: 0 }],
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
            const donacionesValidadas = formData.donaciones.filter(donacion => donacion.nombre && donacion.cantidad > 0);

            if (donacionesValidadas.length !== formData.donaciones.length) {
                console.error('Cada donación debe tener un nombre y una cantidad mayor a 0.');
                return;
            }

            const { ...restData } = formData;

            if (item && item._id) {
                await updateDonacion(item._id, { ...restData, donaciones: donacionesValidadas });
                showToast('Donación actualizada correctamente.', 'success');
            } else {
                await createDonacion({ ...restData, donaciones: donacionesValidadas });
                showToast('Donación creada correctamente.', 'success');
            }

            // Ensure insumos are created for each donation
            for (const donacion of donacionesValidadas) {
                await ensureInsumoExists({
                    nombre: donacion.nombre,
                    fecha: formData.fecha,
                    cantidad: donacion.cantidad
                });
            }

            onClose();
        } catch (error) {
            console.error('Error al guardar la donación:', error.response ? error.response.data : error.message);
            showToast('Error al guardar la donación.', 'error');
        }
    };

    const ensureInsumoExists = async ({ nombre, fecha, cantidad }) => {
        const existingInsumo = insumos.find(insumo => insumo.nombre === nombre);
        if (!existingInsumo) {
            await createInsumo({
                nombre,
                fecha,
                cantidad: parseInt(cantidad, 10),
                estado: 'activo'
            });
        } else {
            await updateInsumo(existingInsumo._id, { cantidad: existingInsumo.cantidad + parseInt(cantidad, 10) });
        }
    };

    const documentOptions = donadores.map(donador => ({
        value: donador._id,
        label: `${donador.nombre} - ${donador.identificacion}`
    }));

    return (
        <div className="bg-white p-8 rounded-lg shadow-2xl max-w-4xl mx-auto mt-8 mb-8 max-h-[90vh] overflow-y-auto">
            <div className="grid grid-cols-2 gap-8">
                <h2 className="col-span-2 text-3xl font-semibold mb-6 text-center text-gray-800">{item ? 'Editar Donación' : 'Agregar Donación'}</h2>
                <div className="col-span-2">
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
                <div className="grid grid-cols-2 gap-8 col-span-2">
                    <div>
                        <label className="block text-gray-700 text-xs font-medium mb-2">Fecha <span className="text-red-500">*</span></label>
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
                        <label className="block text-gray-700 text-xs font-medium mb-2">Tipo de Donación <span className="text-red-500">*</span></label>
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
                </div>
                {formData.donaciones.map((donacion, index) => (
                    <div key={index} className="col-span-2">
                        <label className="block text-gray-700 text-xs font-medium mb-2">Donación {index + 1} <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            name="nombre"
                            value={donacion.nombre}
                            onChange={(e) => handleChange(e, index)}
                            className="shadow-sm border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-300"
                            required
                        />
                        {validationErrors.nombre && <p className="text-red-500 text-sm">{validationErrors.nombre}</p>}
                        <label className="block text-gray-700 text-xs font-medium mb-2">Cantidad <span className="text-red-500">*</span></label>
                        <input
                            type="number"
                            name="cantidad"
                            value={donacion.cantidad}
                            onChange={(e) => handleChange(e, index)}
                            className="shadow-sm border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-300"
                            required
                        />
                        {validationErrors.cantidad && <p className="text-red-500 text-sm">{validationErrors.cantidad}</p>}
                        <button
                            type="button"
                            onClick={() => removeDonacion(index)}
                            className="bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-red-700 border-2  border-gradient-to-r border-red-400  hover:border-red-600 hover:from-red-600 hover:to-red-700  font-bold py-2 px-6 rounded-lg focus:outline-none focus:shadow-outline"
                        >
                            Eliminar Donación
                        </button>
                    </div>
                ))}
                <button
                    type="button"
                    onClick={addDonacion}
                    className="col-span-2 bg-gradient-to-l from-indigo-400 to-indigo-600 hover:from-indigo-600 hover:to-indigo-800 text-white px-4 py-2 rounded-lg"
                >
                    Agregar Donación
                </button>
                </div >
                        <div className="flex pt-2 justify-end space-x-4">
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
                                className="bg-gradient-to-l from-indigo-400 to-indigo-600 hover:from-indigo-600 hover:to-indigo-800 rounded-lg text-white font-bold py-2 px-6  focus:outline-none focus:shadow-outline"
                            >
                                {item ? 'Actualizar Donación' : 'Agregar Donación'}
                            </button>
                        </div>
            
        </div>
    );
};

export default ModalDonacion;

