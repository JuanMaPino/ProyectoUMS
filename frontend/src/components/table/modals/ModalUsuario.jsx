import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useRoles } from '../../../context/RolesContext'; // Agregamos el uso del contexto de roles
import { showToast } from '../../table/alertFunctions';
import { RiEyeCloseLine, RiEyeLine } from 'react-icons/ri'; // Iconos de visibilidad de contraseña

const ModalUsuario = ({ onClose, item }) => {
    const { signup } = useAuth();
    const { roles } = useRoles(); // Obtenemos los roles disponibles
    const [formData, setFormData] = useState({
        usuario: '',
        email: '',
        contraseña: '',
        confirmarContraseña: '', // Agregado para la confirmación de contraseña
        tipo: 'Administrador',
        active: true,
      
    });
    const [errors, setErrors] = useState({});
    const [passwordVisible, setPasswordVisible] = useState(false); // Estado para controlar la visibilidad de la contraseña

    useEffect(() => {
        if (item) {
            setFormData({
                usuario: item.usuario || '',
                email: item.email || '',
                contraseña: '',
                confirmarContraseña: '',
                tipo: item.tipo || 'Administrador',
                active: item.active || true,
    
            });
        } else {
            setFormData({
                usuario: '',
                email: '',
                contraseña: '',
                confirmarContraseña: '',
                tipo: 'Administrador',
                active: true,
    
            });
        }
    }, [item]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (type === 'checkbox') {
            setFormData((prevState) => ({
                ...prevState,
            }));
        } else {
            setFormData((prevState) => ({
                ...prevState,
                [name]: value
            }));
        }
    };

    const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);
    const validatePassword = (contraseña) => contraseña.length >= 6;

    const validateForm = () => {
        let formErrors = {};
        if (!formData.usuario) formErrors.usuario = 'El usuario es requerido';
        if (!formData.email || !validateEmail(formData.email)) formErrors.email = 'Ingrese un correo electrónico válido';
        if (!item && (!formData.contraseña || !validatePassword(formData.contraseña))) formErrors.contraseña = 'La contraseña debe tener al menos 6 caracteres';
        if (formData.contraseña !== formData.confirmarContraseña) formErrors.confirmarContraseña = 'Las contraseñas no coinciden';
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
                await signup(formData);
                showToast('Usuario creado exitosamente', 'success');
            }
            onClose();
        } catch (error) {
            console.error('Error al guardar el usuario:', error.response ? error.response.data : error.message);
            showToast('Error al guardar el usuario', 'error');
        }
    };

    const handleTogglePasswordVisibility = () => {
        setPasswordVisible(prev => !prev);
    };

    const rolOptions = roles.map(rol => ({
        value: rol._id,
        label: rol.nombre,
    }));

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
                    <>
                        <div className="relative">
                            <label className="block text-gray-700 text-sm font-medium mb-2">Contraseña</label>
                            <input
                                type={passwordVisible ? "text" : "password"}
                                name="contraseña"
                                value={formData.contraseña}
                                onChange={handleChange}
                                className={`shadow-sm border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-300 ${errors.contraseña ? 'border-red-500' : ''}`}
                            />
                            <button
                                type="button"
                                onClick={handleTogglePasswordVisibility}
                                className="absolute inset-y-0 right-0 flex items-center p-3 text-gray-700"
                            >
                                {passwordVisible ? <RiEyeLine /> : <RiEyeCloseLine />}
                            </button>
                            {errors.contraseña && <p className="text-red-500 text-sm">{errors.contraseña}</p>}
                        </div>
                        <div className="relative">
                            <label className="block text-gray-700 text-sm font-medium mb-2">Confirmar Contraseña</label>
                            <input
                                type={passwordVisible ? "text" : "password"}
                                name="confirmarContraseña"
                                value={formData.confirmarContraseña}
                                onChange={handleChange}
                                className={`shadow-sm border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-300 ${errors.confirmarContraseña ? 'border-red-500' : ''}`}
                            />
                            {errors.confirmarContraseña && <p className="text-red-500 text-sm">{errors.confirmarContraseña}</p>}
                        </div>
                    </>
                )}
                <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">Tipo de Usuario</label>
                    <select
                        name="tipo"
                        value={formData.tipo}
                        onChange={handleChange}
                        className="shadow-sm border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-300"
                    >
                        {rolOptions.map(rol => (
                            <option key={rol.value} value={rol.value}>{rol.label}</option>
                        ))}
                    </select>
                </div>
                <div className="col-span-2 mt-6 flex space-x-2 justify-center">
                <button
                        type="button"
                        onClick={onClose}
                        className="bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-red-700 border-2 border-gradient-to-r border-red-400 hover:border-red-600 hover:from-red-600 hover:to-red-700 font-bold py-2 px-6 rounded-lg focus:outline-none focus:shadow-outline"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring"
                    >
                        {item ? 'Actualizar Usuario' : 'Agregar Usuario'}
                    </button>
                    
                </div>
            </form>
        </div>
    );
};

export default ModalUsuario;
