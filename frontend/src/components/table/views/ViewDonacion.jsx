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
                {/* Iterar sobre las donaciones */}
                {item.donaciones.map((donacion, index) => (
                    <React.Fragment key={index}>
                        <div>
                            <label className="block text-gray-700"><span className="font-semibold">Nombre de la Donación {index + 1}:</span></label>
                            <p className="text-gray-800">{donacion.nombre}</p>
                        </div>
                        <div>
                            <label className="block text-gray-700"><span className="font-semibold">Cantidad de la Donación {index + 1}:</span></label>
                            <p className="text-gray-800">{donacion.cantidad}</p>
                        </div>
                    </React.Fragment>
                ))}
                <div>
                    <label className="block text-gray-700"><span className="font-semibold">Nombre del Donador:</span></label>
                    <p className="text-gray-800">{item.donadorNombre}</p>
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

export default ViewDonacion;

