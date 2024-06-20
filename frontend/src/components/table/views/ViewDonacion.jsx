import React from 'react';

const ViewDonacion = ({ onClose, item }) => {
    return (
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md mx-auto">
            <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">Detalles de la Donación</h2>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-gray-700"><span className="font-semibold">Documento del Donador:</span></label>
                    <p className="text-gray-800">{item.donadorIdentificacion}</p>
                </div>
                <div>
                    <label className="block text-gray-700"><span className="font-semibold">Fecha:</span></label>
                    <p className="text-gray-800">{new Date(item.fecha).toLocaleDateString()}</p>
                </div>
                <div>
                    <label className="block text-gray-700"><span className="font-semibold">Tipo:</span></label>
                    <p className="text-gray-800">{item.tipo}</p>
                </div>
                <div>
                    <label className="block text-gray-700"><span className="font-semibold">Donación:</span></label>
                    <p className="text-gray-800">{item.donacion}</p>
                </div>
                <div>
                    <label className="block text-gray-700"><span className="font-semibold">Nombre del Donador:</span></label>
                    <p className="text-gray-800">{item.donadorNombre}</p>
                </div>
            </div>
            <div className="mt-6 flex justify-center">
                <button
                    onClick={onClose}
                    className="bg-gradient-to-tr from-yellow-400 from-10% to-orange-600 hover:from-yellow-600 hover:to-orange-600 text-white font-bold py-2 px-6 rounded-xl focus:outline-none focus:shadow-outline"
                >
                    Cerrar
                </button>
            </div>
        </div>
    );
};

export default ViewDonacion;
