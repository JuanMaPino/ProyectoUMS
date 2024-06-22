import React from 'react';

const ViewInsumo = ({ onClose, item }) => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl mb-4">Detalles del Insumo</h2>
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Nombre de insumo</label>
                <p>{item.nombre}</p>
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Fecha</label>
                <p>{new Date(item.fecha).toLocaleDateString()}</p>
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Cantidad</label>
                <p>{item.cantidad}</p>
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Estado</label>
                <p>{item.estado}</p>
            </div>
            <button
                onClick={onClose}
                className="bg-gradient-to-tr from-yellow-400 from-10% to-orange-600 hover:from-yellow-600 hover:to-orange-600 text-white font-bold py-2 px-6 rounded-xl focus:outline-none focus:shadow-outline"
            >
                Cerrar
            </button>
        </div>
    );
};

export default ViewInsumo;

                   
        