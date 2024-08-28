import React from 'react';
import { RiDeleteBin6Line, RiPlaneFill, RiEyeLine } from 'react-icons/ri';
import Switch from '../Switch'; // Ajusta la ruta según tu estructura de componentes
import { useProyectos } from '../../../context/ProyectosContext'; // Ajusta la ruta según tu estructura de contexto

const CardDonador = ({ item, onEdit, onView, onDelete, onSwitchChange, isActive }) => {
    const { disableActividad } = useProyectos();

    const cardClass = isActive ? "shadow-inner bg-gradient-to-r from-gray-200 from-35% via-sky-300 via-55% to-blue-500 shadow-inner" : "bg-gradient-to-r from-gray-200 from-35% via-red-300 to-red-600 shadow-inner animate-pulse";

    const handleEditClick = () => {
        if (item.estado === 'activo') {
            onEdit(item);
        }
    };

    const handleDeleteClick = async () => {
        if (item.estado === 'activo') {
            await disableActividad(item._id);
            onDelete(item._id);
        }
    };


    return (
        <div className={`rounded-lg ml-4 p-4 mb-4 ${cardClass}`}>
            <div className="flex items-center mb-2">
                <span className="font-semibold">ID:</span>
                <span className="ml-2">{item.id_actividad}</span>
            </div>
            <div className="flex items-center mb-2">
                <span className="font-semibold">Nombre:</span>
                <span className="ml-2">{item.nombre}</span>
            </div>
            <div className="flex items-center mb-2">
                <span className="font-semibold">Fecha:</span>
                <span className="ml-2">{item.fecha}</span>
            </div>
            <div className="flex items-center mb-2">
                <span className="font-semibold">Tipo:</span>
                <span className="ml-2">{item.tipo}</span>
            </div>
            <div className="flex items-center mb-2">
                <span className="font-semibold">Descripción:</span>
                <span className="ml-2">{item.descripcion}</span>
            </div>
            <div className="flex items-center mb-2">
                <span className="font-semibold">Tarea:</span>
                <span className="ml-2">{item.tarea}</span>
            </div>
            <div className="flex items-center mb-2">
                <span className="font-semibold">Insumo:</span>
                <span className="ml-2">{item.insumo}</span>
            </div>
            <div className="flex items-center mb-2">
                <span className="font-semibold">Estado:</span>
                <span className={`ml-2 py-1 px-2 ${item.estado === 'activo' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'} rounded-lg`}>
                    {item.estado}
                </span>
            </div>
            <div className="flex items-center mb-2">
                <span className="font-semibold">Activo:</span>
                <Switch
                    name="estado"
                    checked={item.estado === 'activo'}
                    onChange={() => onSwitchChange(item._id)}
                />
            </div>
            <div className="flex justify-between m-2 ">
                <button
                    onClick={() => onView(item)}
                    className="rounded-lg transition-colors text-white bg-gradient-to-r from-cyan-200 from-10% to-cyan-600 hover:from-cyan-400 hover:to-cyan-700 p-2"
                >
                    <RiEyeLine />
                </button>
                <button
                    onClick={handleEditClick}
                    className={`rounded-lg transition-colors text-white ${item.estado === 'activo' ? 'bg-gradient-to-r from-violet-500 to-blue-600 hover:from-violet-700 hover:to-blue-800' : 'bg-gray-300 cursor-not-allowed'} p-2`}
                    disabled={item.estado !== 'activo'}
                    title={item.estado !== 'activo' ? 'No se puede editar una actividad inactiva' : ''}
                >
                    <RiPlaneFill />
                </button>
                <button
                    onClick={handleDeleteClick}
                    className={`rounded-lg transition-colors text-white ${item.estado === 'activo' ? 'bg-gradient-to-r from-rose-400 from-10% to-red-600 hover:from-rose-700 hover:to-red-700' : 'bg-gray-300 cursor-not-allowed'} p-2`}
                    disabled={item.estado !== 'activo'}
                    title={item.estado !== 'activo' ? 'No se puede eliminar una actividad inactiva' : ''}
                >
                    <RiDeleteBin6Line />
                </button>
            </div>
        </div>
    );
};

export default CardDonador;
