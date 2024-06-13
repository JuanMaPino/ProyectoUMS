import React from 'react';

const ViewModal = ({ onClose, item }) => {
    return (
        <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl mb-4">Detalles del Beneficiario</h2>
            <p><strong>Identificación:</strong> {item.identificacion}</p>
            <p><strong>Nombre:</strong> {item.nombre}</p>
            <p><strong>Teléfono:</strong> {item.telefono}</p>
            <p><strong>Estado:</strong> {item.estado}</p>
            <button
                onClick={onClose}
                className="mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
                Cerrar
            </button>
        </div>
    );
};

export default ViewModal;
