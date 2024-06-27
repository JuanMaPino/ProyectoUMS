import React from 'react';
import { RiArrowLeftSLine } from 'react-icons/ri'; // Ajusta la importación según tu estructura de componentes

const ViewActividad = ({ onClose, item }) => {
    return (
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md mx-auto">
            <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">Detalles de la Actividad</h2>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-gray-700"><span className="font-semibold">ID de Actividad:</span></label>
                    <p className="text-gray-800">{item.id_actividad}</p>
                </div>
                <div>
                    <label className="block text-gray-700"><span className="font-semibold">Nombre:</span></label>
                    <p className="text-gray-800">{item.nombre}</p>
                </div>
                <div>
                    <label className="block text-gray-700"><span className="font-semibold">Fecha:</span></label>
                    <p className="text-gray-800">{item.fecha}</p>
                </div>
                <div>
                    <label className="block text-gray-700"><span className="font-semibold">Tipo:</span></label>
                    <p className="text-gray-800">{item.tipo}</p>
                </div>
                <div>
                    <label className="block text-gray-700"><span className="font-semibold">Descripción:</span></label>
                    <p className="text-gray-800">{item.descripcion}</p>
                </div>
                <div>
                    <label className="block text-gray-700"><span className="font-semibold">Tarea:</span></label>
                    <p className="text-gray-800">{item.tarea}</p>
                </div>
                <div>
                    <label className="block text-gray-700"><span className="font-semibold">Insumo:</span></label>
                    <p className="text-gray-800">{item.insumo}</p>
                </div>
                <div>
                    <label className="block text-gray-700"><span className="font-semibold">Estado:</span></label>
                    <p className={`text-gray-800 ${item.estado === 'activo' ? 'text-green-500' : 'text-red-500'}`}>
                        {item.estado}
                    </p>
                </div>
            </div>
            <div className="mt-6 flex justify-center">
                <button
                    onClick={onClose}
                    className="bg-gradient-to-tr from-red-400 from-10% to-red-600 hover:from-red-600 hover:to-red-600 text-white font-bold py-2 px-6 rounded-xl focus:outline-none focus:shadow-outline"
                >
                    {/* <RiArrowLeftSLine className="inline-block mr-2" /> */}
                    Cerrar
                </button>
            </div>
        </div>
    );
};

export default ViewActividad;
