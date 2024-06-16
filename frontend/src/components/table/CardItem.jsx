import React from 'react';
import { RiDeleteBin6Line, RiPlaneFill, RiEyeLine } from 'react-icons/ri';
import Switch from './Switch'; // Asegúrate de importar tu componente de Switch adecuadamente

const CardItem = ({ item, onEdit, onView, onDelete, onSwitchChange, isActive }) => {
    const cardClass = isActive ? "shadow-inner bg-gradient-to-r from-gray-200 from-35% via-sky-300 via-55% to-blue-500 shadow-inner" : "bg-gradient-to-r from-gray-200 from-35% via-red-300 to-red-600 shadow-inner animate-pulse";

    return (
        <div className={`rounded-lg ml-4 p-4 mb-4 ${cardClass}`}>
            <div className="flex items-center mb-2">
                <span className="font-semibold">ID:</span>
                <span className="ml-2">{item.identificacion}</span>
            </div>
            <div className="flex items-center mb-2">
                <span className="font-semibold">Nombre:</span>
                <span className="ml-2">{item.nombre}</span>
            </div>
            <div className="flex items-center mb-2">
                <span className="font-semibold">Teléfono:</span>
                <span className="ml-2">{item.telefono}</span>
            </div>
            <div className="flex items-center mb-2">
                <span className="font-semibold">Estatus:</span>
                <span className={`ml-2 py-1 px-2 ${item.estado === 'activo' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'} rounded-lg`}>
                    {item.estado}
                </span>
            </div>
            <div className="flex items-center mb-2">
                <span className="font-semibold">Estado:</span>
                <Switch
                    name="estado"
                    checked={item.estado === 'activo'}
                    onChange={() => onSwitchChange(item._id)}
                />
            </div>
            <div className="flex justify-between m-2 ">
                <button onClick={() => onView(item)} className="rounded-lg transition-colors text-white bg-gradient-to-r from-cyan-200 from-10% to-cyan-600 hover:from-cyan-400 hover:to-cyan-700 p-2">
                    <RiEyeLine />
                </button>
                <button onClick={() => onEdit(item)} className="rounded-lg transition-colors text-white bg-gradient-to-r from-violet-500 to-blue-600 hover:from-violet-700 hover:to-blue-800 p-2">
                    <RiPlaneFill />
                </button>
                <button onClick={() => onDelete(item._id)} className="rounded-lg transition-colors text-white bg-gradient-to-r from-rose-400 from-10% to-red-600 hover:from-rose-700 hover:to-red-700 p-2">
                    <RiDeleteBin6Line />
                </button>
            </div>
        </div>
    );
};

export default CardItem;
