import React from 'react';

const ViewModal = ({ onClose, item }) => {
    return (
        <div className="bg-white p-8 rounded-lg shadow-2xl max-w-md mx-auto">
            <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">Detalles del Beneficiario</h2>
            <div className="space-y-4 text-gray-700">
                <p><span className="font-medium">Identificación:</span> {item.identificacion}</p>
                <p><span className="font-medium">Nombre:</span> {item.nombre}</p>
                <p><span className="font-medium">Teléfono:</span> {item.telefono}</p>
                <p><span className="font-medium">Estado:</span> {item.estado}</p>
            </div>
            <div className="mt-6 flex justify-center">
                <button
                    onClick={onClose}
                    className="bg-gradient-to-r from-yellow-400 from-10% to-orange-600 hover:from-yellow-600 hover:to-orange-600 text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline"
                >
                    Cerrar
                </button>
            </div>
        </div>
    );
};

export default ViewModal;
