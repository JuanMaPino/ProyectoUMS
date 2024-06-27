// src/components/table/TableActions.jsx
import React from 'react';
import { RiDeleteBin6Line, RiEyeLine, RiPencilFill, RiUserHeartFill, RiUserStarFill } from 'react-icons/ri';

// Componente de botón para ver
const ViewButton = ({ item, handleViewButtonClick }) => (
    <button
        onClick={() => handleViewButtonClick(item)}
        className="rounded-lg transition-colors text-white bg-gradient-to-r from-indigo-500 from-10% to-indigo-600 hover:from-indigo-700 hover:to-indigo-800 p-2"
    >
        <RiEyeLine />
    </button>
);

// Componente de botón para editar
const EditButton = ({ item, handleEditButtonClick }) => (
    <button
        onClick={() => handleEditButtonClick(item)}
        className={`rounded-lg transition-colors text-white ${item.estado === 'activo' ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-700 hover:to-indigo-800' : 'bg-gray-300 cursor-not-allowed'} p-2`}
        disabled={item.estado !== 'activo'}
    >
        <RiPencilFill />
    </button>
);

// Componente de botón para eliminar
const DeleteButton = ({ item, handleDeleteButtonClick }) => (
    <button
        onClick={() => handleDeleteButtonClick(item._id)}
        className={`rounded-lg transition-colors text-white ${item.estado === 'activo' ? 'bg-gradient-to-r from-rose-400 from-10% to-red-600 hover:from-rose-700 hover:to-red-700' : 'bg-gray-300 cursor-not-allowed'} p-2`}
        disabled={item.estado !== 'activo'}
    >
        <RiDeleteBin6Line />
    </button>
);

const RoleChangeButton = ({ item, handleRoleChange }) => (
    <button
        onClick={() => handleRoleChange(item._id)}
        className={`flex items-center rounded-full p-2 transition-colors ${
            item.rol === 'alfabetizador' ? 'bg-blue-400 text-white hover:bg-blue-500' : 'bg-indigo-400 text-white hover:bg-indigo-500'
        }`}
        disabled={item.estado !== 'activo'}
    >
        {item.rol === 'alfabetizador' ? (
            <>
                <RiUserHeartFill size={20} />
                <span className="ml-2">A</span>
            </>
        ) : (
            <>
                <RiUserStarFill size={20} />
                <span className="ml-2">V</span>
            </>
        )}
    </button>
);

const TableActions = ({ item, handleViewButtonClick, handleEditButtonClick, handleDeleteButtonClick, handleRoleChange }) => {
    return (
        <div className="flex gap-2">
            {/* Botón de ver */}
            {handleViewButtonClick && <ViewButton item={item} handleViewButtonClick={handleViewButtonClick} />}
            
            {/* Botón de editar */}
            {handleEditButtonClick && <EditButton item={item} handleEditButtonClick={handleEditButtonClick} />}
            
            {/* Botón de eliminar */}
            {handleDeleteButtonClick && <DeleteButton item={item} handleDeleteButtonClick={handleDeleteButtonClick} />}
            
            {/* Botón de cambiar rol */}
            {handleRoleChange && <RoleChangeButton item={item} handleRoleChange={handleRoleChange} />}
        </div>
    );
};

export default TableActions;
