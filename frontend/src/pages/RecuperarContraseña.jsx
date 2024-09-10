import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { sendRecoveryCode, validateRecoveryCode, changePassword } from '../api/ApiAuth';
import logo from "../assets/img/logoums.png";
import bosque from "../assets/img/bosquesito.jpeg";
import { RiEyeCloseLine, RiEyeLine } from 'react-icons/ri';

function ResetPassword() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({ usernameOrEmail: '', code: ['', '', '', '', '', ''], newPassword: '' });
    const [userId, setUserId] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const [passwordVisible, setPasswordVisible] = useState(false);

    const handleTogglePasswordVisibility = () => {
        setPasswordVisible(prev => !prev);
    };

    const handleCodeChange = (e, index) => {
        const newCode = [...formData.code];
        newCode[index] = e.target.value;
        setFormData({ ...formData, code: newCode });

        if (e.target.value && index < formData.code.length - 1) {
            document.getElementById(`code-${index + 1}`).focus();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            if (step === 1) {
                const response = await sendRecoveryCode(formData.usernameOrEmail);
                setUserId(response.data.usuario._id);
                setStep(2);
            } else if (step === 2) {
                const code = formData.code.join('');
                await validateRecoveryCode(userId, code);
                setStep(3);
            } else if (step === 3) {
                await changePassword(userId, formData.newPassword);
                setMessage('Contraseña cambiada exitosamente. Redirigiendo al login...');
                setTimeout(() => navigate('/login'), 3000);
            }
        } catch (error) {
            setMessage(error.response?.data?.message || 'Error en el proceso de recuperación');
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-cover bg-center bg-fixed"
            style={{ backgroundImage: `url(${bosque})` }}
        >
            <div className="w-full max-w-sm p-8 bg-white rounded-lg shadow-md">
                <img src={logo} className="w-24 mx-auto mb-4" alt="Avatar Image" />
                <h1 className="text-2xl font-semibold text-center mb-6">
                    {step === 1 ? 'Recuperar Contraseña' : step === 2 ? 'Ingresar Código' : 'Nueva Contraseña'}
                </h1>
                <form onSubmit={handleSubmit}>
                    {step === 1 && (
                        <>
                            <label htmlFor="usernameOrEmail" className="block mb-2 text-sm font-medium text-gray-700">Usuario o Email</label>
                            <input type="text" name="usernameOrEmail" placeholder="Ingrese su usuario o email" onChange={handleChange} value={formData.usernameOrEmail} required className="w-full p-2 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600" />
                        </>
                    )}
                    {step === 2 && (
                        <>
                            <label htmlFor="code" className="block mb-2 text-sm font-medium text-gray-700">Código de Verificación</label>
                            <div className="flex justify-between">
                                {formData.code.map((value, index) => (
                                    <input
                                        key={index}
                                        id={`code-${index}`}
                                        type="text"
                                        maxLength="1"
                                        value={value}
                                        onChange={(e) => handleCodeChange(e, index)}
                                        className="w-12 p-2 mb-4 text-center border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 "
                                    />
                                ))}
                            </div>
                        </>
                    )}
                    {step === 3 && (
                        <>
                            <label htmlFor="newPassword" className="block mb-2 text-sm font-medium text-gray-700">Nueva Contraseña</label>
                            <div className="relative">
                                <input 
                                    type={passwordVisible ? "text" : "password"} 
                                    name="newPassword" 
                                    placeholder="Ingrese su nueva contraseña" 
                                    onChange={handleChange} 
                                    value={formData.newPassword} 
                                    required 
                                    className="w-full p-2 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600" 
                                />
                                <button
                                    type="button"
                                    onClick={handleTogglePasswordVisibility}
                                    className="absolute inset-y-0 -translate-y-2 right-0 flex items-center p-3 text-gray-700"
                                >
                                    {passwordVisible ? <RiEyeLine /> : <RiEyeCloseLine />}
                                </button>
                            </div>
                        </>
                    )}
                    <input type="submit" value={loading ? 'Cargando...' : 'Continuar'} disabled={loading} className="w-full p-2 bg-blue-600 text-white rounded-md cursor-pointer hover:bg-blue-700 disabled:bg-gray-400" />
                    {message && <p className="mt-4 text-sm text-red-500 text-center">{message}</p>}
                    <div className="flex justify-center mt-4 text-sm text-gray-600 hover:text-blue-800">
                        <Link to ="/login"><u>Volver</u></Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ResetPassword;
