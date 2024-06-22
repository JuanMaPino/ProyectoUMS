import React from 'react';

const ViewTarea = ({ onClose, item }) => {
    return (
        <div className="bg-white p-8 rounded-lg shadow-2xl max-w-md mx-auto">
            <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">Detalles de la Tarea</h2>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <p className="text-gray-700"><span className="font-medium">Nombre:</span></p>
                    <p className="text-gray-800">{item.nombre}</p>
                </div>
                <div>
                    <p className="text-gray-700"><span className="font-medium">Acción:</span></p>
                    <p className="text-gray-800">{item.accion}</p>
                </div>
                <div>
                    <p className="text-gray-700"><span className="font-medium">Cantidad de Horas:</span></p>
                    <p className="text-gray-800">{item.cantidadHoras}</p>
                </div>
                <div>
                    <p className="text-gray-700"><span className="font-medium">Fecha:</span></p>
                    <p className="text-gray-800">{item.fecha}</p>
                </div>
                <div>
                    <p className="text-gray-700"><span className="font-medium">Ayudante:</span></p>
                    <p className="text-gray-800">{item.ayudante.nombre} ({item.ayudante.identificacion})</p>
                </div>
                <div>
                    <p className="text-gray-700"><span className="font-medium">Estado:</span></p>
                    <p className="text-gray-800">{item.estado}</p>
                </div>
            </div>
            <div className="flex justify-center mt-6">
                <button
                    onClick={onClose}
                    className="bg-gradient-to-r from-yellow-300 to-yellow-400 hover:from-yellow-400 hover:to-yellow-500 text-white font-bold py-2 px-6 rounded-lg focus:outline-none focus:shadow-outline"
                >
                    Cerrar
                </button>
            </div>
        </div>
    );
};

export default ViewTarea;
