import React from 'react';
import { RiArrowLeftSLine } from 'react-icons/ri';

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
                    <label className="block text-gray-700"><span className="font-semibold">Tipo:</span></label>
                    <p className="text-gray-800">{item.tipo}</p>
                </div>
                <div>
                    <label className="block text-gray-700"><span className="font-semibold">Descripción:</span></label>
                    <p className="text-gray-800">{item.descripcion}</p>
                </div>
                <div className="col-span-2">
                    <label className="block text-gray-700"><span className="font-semibold">Tareas y Ayudantes:</span></label>
                    {item.tareas && item.tareas.length > 0 ? (
                        <ul className="list-disc list-inside">
                            {item.tareas.map((tarea, index) => (
                                <li key={index} className="text-gray-800">
                                    <p>{tarea.nombre || "Nombre de tarea no disponible"}</p>
                                    <p className="text-sm text-gray-500">
                                        {tarea.ayudante?.nombre 
                                            ? `Ayudante: ${tarea.ayudante.nombre}`
                                            : "Ayudante no asignado"}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-800">No hay tareas asignadas</p>
                    )}
                </div>
                <div className="col-span-2">
                    <label className="block text-gray-700"><span className="font-semibold">Insumos:</span></label>
                    {item.insumos && item.insumos.length > 0 ? (
                        <ul className="list-disc list-inside">
                            {item.insumos.map((insumo, index) => (
                                <li key={index} className="text-gray-800">
                                    {insumo.nombre || "Nombre de insumo no disponible"} - Cantidad: {insumo.cantidad}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-800">No hay insumos asignados</p>
                    )}
                </div>
                <div>
                    <label className="block text-gray-700"><span className="font-semibold">Estado:</span></label>
                    <p className={`text-gray-800 ${item.estado === 'activo' ? 'text-green-500' : 'text-red-500'}`}>
                        {item.estado}
                    </p>
                </div>
            </div>
            <div className="flex justify-center mt-6">
                <button
                    onClick={onClose}
                    className="bg-gradient-to-tr from-red-400 from-10% to-red-600 hover:from-red-600 hover:to-red-600 text-white font-bold py-2 px-6 rounded-xl focus:outline-none focus:shadow-outline"
                >
                    <RiArrowLeftSLine className="inline-block mr-2" />
                    Cerrar
                </button>
            </div>
        </div>
    );
};

export default ViewActividad;
