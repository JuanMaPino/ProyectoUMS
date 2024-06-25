import React from 'react';
import { RiDeleteBin6Line, RiPlaneFill, RiEyeLine } from 'react-icons/ri';
import Switch from '../Switch'; // Asegúrate de importar tu componente de Switch adecuadamente

const CardTarea = ({ item, onEdit, onView, onDelete, onSwitchChange, isMonetario }) => {
    const cardClass = isMonetario ? "shadow-inner bg-gradient-to-r from-gray-200 from-35% via-sky-300 via-55% to-blue-500 shadow-inner" : "bg-gradient-to-r from-gray-200 from-35% via-red-300 to-red-600 shadow-inner animate-pulse";

    const handleEditClick = () => {
        if (item.tipo === 'activo') {
            onEdit(item);
        }
        // Puedes agregar un mensaje o alerta aquí si deseas
    };

    const handleDeleteClick = () => {
        if (item.tipo === 'activo') {
            onDelete(item._id);
        }
        // Puedes agregar un mensaje o alerta aquí si deseas
    };

    

    return (
        <div className={`rounded-lg ml-4 p-4 mb-4 ${cardClass}`}>
            <div className="flex items-center mb-2">
                <span className="font-semibold">Documento: </span>
                <span className="ml-2">{item.donadorIdentificacion}</span>
            </div>
            <div className="flex items-center mb-2">
                <span className="font-semibold">Donador: </span>
                <span className="ml-2">{item.donadorNombre}</span>
            </div>
            <div className="flex items-center mb-2">
                <span className="font-semibold">Fecha: </span>
                <span className="ml-2">{item.fecha}</span>
            </div>
            <div className="flex items-center mb-2">
                <span className="font-semibold">Tipo: </span>
                <span className="ml-2">{item.tipo}</span>
            </div>
            <div className="flex items-center mb-2">
                <span className="font-semibold">Donacion: </span>
                <span className="ml-2">{item.donacion}</span>
            </div>
            {/* <div className="flex items-center mb-2">
                <span className="font-semibold">Condición: </span>
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
            </div> */}
            <div className="flex justify-between m-2 ">
                <button
                    onClick={() => onView(item)}
                    className="rounded-lg transition-colors text-white bg-gradient-to-r from-cyan-200 from-10% to-cyan-600 hover:from-cyan-400 hover:to-cyan-700 p-2"
                >
                    <RiEyeLine />
                </button>
               
            </div>
        </div>
    );
};

export default CardTarea;
