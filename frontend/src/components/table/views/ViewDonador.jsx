import React from 'react';

const ViewDonador = ({ onClose, item }) => {
    return (
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md mx-auto">
            <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">Detalles del Donador</h2>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-gray-700"><span className="font-semibold">Identificación:</span></label>
                    <p className="text-gray-800">{item.identificacion}</p>
                </div>
                <div>
                    <label className="block text-gray-700"><span className="font-semibold">Nombre:</span></label>
                    <p className="text-gray-800">{item.nombre}</p>
                </div>
                <div>
                    <label className="block text-gray-700"><span className="font-semibold">Tipo de Donador:</span></label>
                    <p className="text-gray-800">{item.tipoDonador}</p>
                </div>
                <div>
                    <label className="block text-gray-700"><span className="font-semibold">Tipo de Documento:</span></label>
                    <p className="text-gray-800">{item.tipoDocumen}</p>
                </div>
                <div>
                    <label className="block text-gray-700"><span className="font-semibold">Teléfono:</span></label>
                    <p className="text-gray-800">{item.telefono || '-'}</p>
                </div>
                <div>
                    <label className="block text-gray-700"><span className="font-semibold">Dirección:</span></label>
                    <p className="text-gray-800">{item.direccion}</p>
                </div>
                <div>
                    <label className="block text-gray-700"><span className="font-semibold">Correo Electrónico:</span></label>
                    <p className="text-gray-800">{item.correoElectronico}</p>
                </div>
                <div>
                    <label className="block text-gray-700"><span className="font-semibold">Estado:</span></label>
                    <p className="text-gray-800">{item.estado}</p>
                </div>
                <div>
                    <label className="block text-gray-700"><span className="font-semibold">Contacto:</span></label>
                    <p className="text-gray-800">{item.contacto}</p>
                </div>
            </div>
            <div className="mt-6 flex justify-center">
                <button
                    onClick={onClose}
                    className="bg-gradient-to-tr from-red-400 from-10% to-red-600 hover:from-red-600 hover:to-red-600 text-white font-bold py-2 px-6 rounded-xl focus:outline-none focus:shadow-outline"
                >
                    Cerrar
                </button>
            </div>
        </div>
    );
};

export default ViewDonador;
