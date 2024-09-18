import React, { useState, useEffect } from 'react';
import { useRoles } from '../../../context/RolesContext';

const ModalRol = ({ onClose, item }) => {
    const { createRol, updateRol, permisos, fetchPermisos } = useRoles(); // Traemos las funciones del contexto
    const [formData, setFormData] = useState({
        nombre: '',
        descripcion: '',
        permisos: [],
        estado: 'activo'
    });
    const [errors, setErrors] = useState({}); // Manejamos los errores del formulario

    // Llamada para obtener los permisos disponibles cuando se monta el componente
    useEffect(() => {
        fetchPermisos();
    }, []);

    // Actualizar el estado formData cuando recibimos un item para editar
    useEffect(() => {
        if (item && permisos.length > 0) {
            // Filtramos los permisos para quedarnos solo con los que ya tiene el item
            const updateDePermisos = permisos.filter(permiso =>
                item.permisos.some(itemPermiso => itemPermiso._id === permiso._id)
            );

            // Actualizamos el formData con los datos del item
            setFormData({
                nombre: item.nombre || '',
                descripcion: item.descripcion || '',
                permisos: updateDePermisos, // Cargamos los permisos que ya tiene el item
                estado: item.estado || 'activo'
            });
        } else {
            // Si no hay item, lo dejamos en blanco (crear un nuevo rol)
            setFormData({
                nombre: '',
                descripcion: '',
                permisos: [],
                estado: 'activo'
            });
        }
    }, [item, permisos]); // Este useEffect se dispara cuando cambian el item o los permisos

    // Validar los campos cuando cambian
    const handleValidation = (name, value) => {
        const newErrors = { ...errors };
        if (name === 'nombre' && !value) {
            newErrors.nombre = 'Este campo es obligatorio';
        } else {
            delete newErrors[name];
        }
        setErrors(newErrors);
    };

    // Manejador de cambios en el formulario, tanto para texto como para checkboxes
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (type === 'checkbox') {
            setFormData(prevState => {
                // Encontrar el permiso seleccionado por su ID
                const permisoSeleccionado = permisos.find(permiso => permiso._id === value);

                return {
                    ...prevState,
                    permisos: checked
                        ? [...prevState.permisos, permisoSeleccionado] // Agregar permiso si se selecciona
                        : prevState.permisos.filter(permiso => permiso._id !== value) // Eliminar permiso si se deselecciona
                };
            });
        } else {
            setFormData(prevState => ({
                ...prevState,
                [name]: value // Actualizamos el campo de texto correspondiente
            }));
        }

        // Validamos el campo que está cambiando
        handleValidation(name, value);
    };

    // Manejador del envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validamos todos los campos antes de enviar
        Object.keys(formData).forEach(key => handleValidation(key, formData[key]));

        if (Object.keys(errors).length > 0) return; // Si hay errores, no continuamos

        try {
            const dataToSend = { ...formData };

            // Si estamos editando un rol, llamamos a updateRol
            if (item && item._id) {
                await updateRol(item._id, dataToSend);
            } else {
                // Si estamos creando un nuevo rol, llamamos a createRol
                await createRol(dataToSend);
            }

            // Cerramos el modal después de guardar los datos
            onClose();
        } catch (error) {
            console.error('Error al guardar el rol:', error.response ? error.response.data : error.message);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-2xl max-w-4xl mx-auto mt-8 mb-8 max-h-[90vh] overflow-y-auto">
            <div className="p-8">
                <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">
                    {item ? 'Editar Rol' : 'Agregar Rol'} {/* Cambia el título según estemos creando o editando */}
                </h2>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-gray-700 text-sm font-medium mb-2">Nombre del Rol</label>
                        <input
                            type="text"
                            name="nombre"
                            value={formData.nombre} // Valor del nombre
                            onChange={handleChange} // Manejador de cambios
                            className={`shadow-sm border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-300 ${errors.nombre ? 'border-red-500' : ''}`}
                            required
                        />
                        {errors.nombre && <p className="text-red-500 text-sm mt-1">{errors.nombre}</p>}
                    </div>
                    <div className="sm:col-span-2">
                        <label className="block text-gray-700 text-sm font-medium mb-2">Descripción</label>
                        <input
                            type="text"
                            name="descripcion"
                            value={formData.descripcion} // Valor de la descripción
                            onChange={handleChange} // Manejador de cambios
                            className="shadow-sm border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-300"
                        />
                    </div>
                    <div className="sm:col-span-2">
                        <label className="block text-gray-700 text-sm font-medium mb-2">Permisos</label>
                        <div className="grid grid-cols-2 gap-4">
                            {permisos.map(permiso => (
                                <div key={permiso._id} className="flex items-center">
                                    <input
                                        type="checkbox"
                                        name="permisos"
                                        value={permiso._id} // El valor del checkbox es el ID del permiso
                                        checked={formData.permisos.some(p => p._id === permiso._id)} // Verificamos si el permiso está seleccionado
                                        onChange={handleChange} // Manejador de cambios para checkboxes
                                        className="mr-2 leading-tight"
                                    />
                                    <span className="text-gray-700">{permiso.nombre}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="sm:col-span-2 flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-red-700 border-2 border-gradient-to-r border-red-400 hover:border-red-600 hover:from-red-600 hover:to-red-700 font-bold py-2 px-6 rounded-lg focus:outline-none focus:shadow-outline"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="bg-gradient-to-l from-indigo-400 to-indigo-600 hover:from-indigo-600 hover:to-indigo-800 text-white px-4 py-2 rounded-lg"
                        >
                            {item ? 'Actualizar Rol' : 'Guardar Rol'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ModalRol;