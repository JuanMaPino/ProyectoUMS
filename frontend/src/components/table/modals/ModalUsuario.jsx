import React, { useState, useEffect } from 'react';
import { useUsuarios } from '../../../context/UsuariosContext';
import { showToast } from '../../table/alertFunctions';

const ModalUsuario = ({ onClose, item }) => {
    const { createUsuario, updateUsuario } = useUsuarios();
    const [formData, setFormData] = useState({
        usuario: '',
        email: '',
        contraseña: '',
        tipo: 'Administrador',
        active: true,
        permisos: []  // Aquí almacenamos los permisos seleccionados
    });
    const [errors, setErrors] = useState({});

    const permisosDisponibles = ['permiso1', 'permiso2', 'permiso3', 'permiso4']; // Lista de permisos disponibles

    // Cargar el estado del usuario y los permisos si se está editando
    useEffect(() => {
        if (item) {
            setFormData({
                usuario: item.usuario || '',
                email: item.email || '',
                contraseña: '',
                tipo: item.tipo || 'Administrador',
                active: item.active || true,
                permisos: item.permisos || []  // Cargar los permisos del usuario
            });
        } else {
            setFormData({
                usuario: '',
                email: '',
                contraseña: '',
                tipo: 'Administrador',
                active: true,
                permisos: [] // Inicializar permisos vacíos
            });
        }
    }, [item]);

    // Actualizar el estado del formulario cuando cambian los valores
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (type === 'checkbox') {
            const newPermisos = checked
                ? [...formData.permisos, name]  // Agregar el permiso si se selecciona
                : formData.permisos.filter((permiso) => permiso !== name);  // Quitar el permiso si se deselecciona
            setFormData((prevState) => ({
                ...prevState,
                permisos: newPermisos
            }));
        } else {
            setFormData((prevState) => ({
                ...prevState,
                [name]: value
            }));
        }
    };

    const validateForm = () => {
        let formErrors = {};
        if (!formData.usuario) formErrors.usuario = 'El usuario es requerido';
        if (!formData.email || !/.+@.+\..+/.test(formData.email)) formErrors.email = 'Ingrese un correo electrónico válido';
        if (!item && !formData.contraseña) formErrors.contraseña = 'La contraseña es requerida para crear un usuario';
        setErrors(formErrors);
        return Object.keys(formErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            if (item && item._id) {
                await updateUsuario(item._id, formData);
                showToast('Usuario actualizado exitosamente', 'success');
            } else {
                await createUsuario(formData);
                showToast('Usuario creado exitosamente', 'success');
            }
            onClose();
        } catch (error) {
            console.error('Error al guardar el usuario:', error.response ? error.response.data : error.message);
            showToast('Error al guardar el usuario', 'error');
        }
    };

    return (
        <div className="bg-white p-8 rounded-lg shadow-2xl max-w-4xl mx-auto mt-8 mb-8">
            <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">{item ? 'Editar Usuario' : 'Agregar Usuario'}</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">Usuario</label>
                    <input
                        type="text"
                        name="usuario"
                        value={formData.usuario}
                        onChange={handleChange}
                        className={`shadow-sm border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-300 ${errors.usuario ? 'border-red-500' : ''}`}
                    />
                    {errors.usuario && <p className="text-red-500 text-sm">{errors.usuario}</p>}
                </div>
                <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`shadow-sm border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-300 ${errors.email ? 'border-red-500' : ''}`}
                    />
                    {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                </div>
                {!item && (
                    <div>
                        <label className="block text-gray-700 text-sm font-medium mb-2">Contraseña</label>
                        <input
                            type="password"
                            name="contraseña"
                            value={formData.contraseña}
                            onChange={handleChange}
                            className={`shadow-sm border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-300 ${errors.contraseña ? 'border-red-500' : ''}`}
                        />
                        {errors.contraseña && <p className="text-red-500 text-sm">{errors.contraseña}</p>}
                    </div>
                )}
                <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">Tipo de Usuario</label>
                    <select
                        name="tipo"
                        value={formData.tipo}
                        onChange={handleChange}
                        className="shadow-sm border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-300"
                    >
                        <option value="Administrador">Administrador</option>
                        <option value="Usuario">Usuario</option>
                    </select>
                </div>
                <div className="col-span-2">
                    <label className="block text-gray-700 text-sm font-medium mb-2">Permisos</label>
                    <div className="grid grid-cols-2 gap-2">
                        {permisosDisponibles.map((permiso) => (
                            <label key={permiso} className="flex items-center">
                                <input
                                    type="checkbox"
                                    name={permiso}
                                    checked={formData.permisos.includes(permiso)} // Marca los checkboxes según los permisos
                                    onChange={handleChange}
                                    className="mr-2"
                                />
                                {permiso}
                            </label>
                        ))}
                    </div>
                </div>
                <div className="col-span-2 mt-6 flex justify-center">
                    <button
                        type="submit"
                        className="bg-gradient-to-tr from-blue-400 to-blue-600 hover:from-blue-600 hover:to-blue-600 text-white font-bold py-2 px-6 rounded-xl focus:outline-none focus:shadow-outline"
                    >
                        {item ? 'Actualizar' : 'Crear'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ModalUsuario;
