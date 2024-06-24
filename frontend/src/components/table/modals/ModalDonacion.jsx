import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { useDonaciones } from '../../../context/DonacionesContext';
import { getAllDonadoresRequest } from '../../../api/ApiDonador';

const ModalDonacion = ({ onClose, item }) => {
    const { createDonacion, updateDonacion } = useDonaciones();
    const [donadores, setDonadores] = useState([]);
    const [formData, setFormData] = useState({
        documento: '',
        donador: '',
        fecha: '',
        tipo: 'Monetaria',
        donacion: '',
        cantidad: ''
    });
    const [selectedDonador, setSelectedDonador] = useState(null); // Nuevo estado para almacenar el donador seleccionado

    useEffect(() => {
        if (item) {
            setFormData({
                documento: item.documento || '',
                donador: item.donador ? item.donador._id : '', // Actualización para usar _id del donador
                fecha: item.fecha || '',
                tipo: item.tipo || 'Monetaria',
                donacion: item.donacion || '',
                cantidad: item.cantidad || ''
            });
            setSelectedDonador(item.donador); // Actualización para establecer el donador seleccionado
        } else {
            setFormData({
                documento: '',
                donador: '',
                fecha: '',
                tipo: 'Monetaria',
                donacion: '',
                cantidad: ''
            });
            setSelectedDonador(null); // Limpiar donador seleccionado cuando no hay item
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));
    };

    const handleSelectChange = (selectedOption) => {
        const selectedDonador = donadores.find(donador => donador._id === selectedOption.value);
        setFormData(prevState => ({ ...prevState, donador: selectedOption.value }));
        setSelectedDonador(selectedDonador);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (item && item._id) {
                await updateDonacion(item._id, formData);
            } else {
                await createDonacion(formData);
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
        <div className="bg-white rounded-lg shadow-2xl max-w-lg mx-auto mt-8 mb-8">
            <div className="p-8 flex gap-8">
                <div className="flex-1">
                    <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">{item ? 'Editar Donación' : 'Agregar Donación'}</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-2">Documento</label>
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
                            <>
                                <div>
                                    <label className="block text-gray-700 text-sm font-medium mb-2">Nombre del Donador</label>
                                    <p className="text-gray-800">{selectedDonador.nombre}</p>
                                </div>
                            </>
                        )}
                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-2">Fecha</label>
                            <input
                                type="date"
                                name="fecha"
                                value={formData.fecha}
                                onChange={handleChange}
                                className="shadow-sm border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-300"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-2">Tipo de Donacion</label>
                            <select
                                name="tipo"
                                value={formData.tipo}
                                onChange={handleChange}
                                className="shadow-sm border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-300"
                                required
                            >
                                <option value="Monetaria">Monetaria</option>
                                <option value="Material">Material</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-2">Donación</label>
                            <input
                                type="text"
                                name="donacion"
                                value={formData.donacion}
                                onChange={handleChange}
                                className="shadow-sm border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-300"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-2">Cantidad</label>
                            <input
                                type="number"
                                name="cantidad"
                                value={formData.cantidad}
                                onChange={handleChange}
                                className="shadow-sm border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-300"
                                required
                            />
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

export default ModalDonacion;
