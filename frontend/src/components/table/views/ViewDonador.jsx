import React from 'react';

const ViewModal = ({ onClose, item }) => {
    return (
        <div className="bg-white p-8 rounded-lg shadow-2xl max-w-md mx-auto">
            <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">Detalles del Donador</h2>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <p className="text-gray-700"><span className="font-medium">Tipo de Documento:</span></p>
                    <p className="text-gray-800">{item.tipoDocumento}</p>
                </div>
                <div>
                    <p className="text-gray-700"><span className="font-medium">Identificación:</span></p>
                    <p className="text-gray-800">{item.identificacion}</p>
                </div>
                <div>
                    <p className="text-gray-700"><span className="font-medium">Nombre:</span></p>
                    <p className="text-gray-800">{item.nombre}</p>
                </div>
                <div>
                    <p className="text-gray-700"><span className="font-medium">Teléfono:</span></p>
                    <p className="text-gray-800">{item.telefono}</p>
                </div>
                <div>
                    <p className="text-gray-700"><span className="font-medium">Estado:</span></p>
                    <p className="text-gray-800">{item.estado}</p>
                </div>
                <div>
                    <p className="text-gray-700"><span className="font-medium">Correo Electrónico:</span></p>
                    <p className="text-gray-800">{item.correoElectronico}</p>
                </div>
                <div>
                    <p className="text-gray-700"><span className="font-medium">Dirección:</span></p>
                    <p className="text-gray-800">{item.direccion}</p>
                </div>
                <div>
                    <p className="text-gray-700"><span className="font-medium">Tipo de Donador:</span></p>
                    <p className="text-gray-800">{item.tipoDonador}</p>
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

export default ViewModal;
