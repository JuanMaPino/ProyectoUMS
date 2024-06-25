import React from 'react';

const ViewModal = ({ onClose, item }) => {
    return (
        <div className="bg-white p-8 rounded-lg shadow-2xl max-w-md mx-auto">
            <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">Detalles del Beneficiario</h2>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <p className="text-gray-700"><span className="font-medium">Tipo de documento:</span></p>
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
                    <p className="text-gray-700"><span className="font-medium">Cantidad de Familiares:</span></p>
                    <p className="text-gray-800">{item.cantidadFamiliares}</p>
                </div>
                {item.familiares && item.familiares.length > 0 && (
                    <div className="col-span-2 mt-6">
                        <h3 className="text-xl font-semibold mb-4 text-center text-gray-800">Familiares</h3>
                        {item.familiares.map((familiar, index) => (
                            <div key={index} className="border rounded p-4 mb-4">
                                <h4 className="text-lg font-semibold mb-2">Familiar {index + 1}</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-gray-700"><span className="font-medium">Documento:</span></p>
                                        <p className="text-gray-800">{familiar.documentoFamiliar}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-700"><span className="font-medium">Condición:</span></p>
                                        <p className="text-gray-800">{familiar.condicionFamiliar}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <div className="mt-6 flex justify-center">
                <button
                    onClick={onClose}
                    className="bg-gradient-to-tr from-yellow-400 to-orange-600 hover:from-yellow-600 hover:to-orange-600 text-white font-bold py-2 px-6 rounded-xl focus:outline-none focus:shadow-outline"
                >
                    Cerrar
                </button>
            </div>
        </div>
    );
};

export default ViewModal;
