import React from 'react';

const ViewUsuario = ({ onClose, item }) => {
    return (
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md mx-auto overflow-y-auto">
            <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">Detalles del Usuario</h2>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-gray-700"><span className="font-semibold">Usuario:</span></label>
                    <p className="text-gray-800">{item.usuario}</p>
                </div>
                <div>
                    <label className="block text-gray-700"><span className="font-semibold">Email:</span></label>
                    <p className="text-gray-800">{item.email}</p>
                </div>
                <div>
                    <label className="block text-gray-700"><span className="font-semibold">Tipo de Usuario:</span></label>
                    <p className="text-gray-800">{item.tipo?.nombre}</p>
                </div>
                <div>
                    <label className="block text-gray-700"><span className="font-semibold">Estado:</span></label>
                    <p className="text-gray-800">{item.active ? 'Activo' : 'Inactivo'}</p>
                </div>
            </div>
            <div className="mt-6 flex justify-center">
                <button
                    onClick={onClose}
                    className="bg-gradient-to-tr from-red-400 to-red-600 hover:from-red-600 hover:to-red-600 text-white font-bold py-2 px-6 rounded-xl focus:outline-none focus:shadow-outline"
                >
                    Cerrar
                </button>
            </div>
        </div>
    );
};

export default ViewUsuario;