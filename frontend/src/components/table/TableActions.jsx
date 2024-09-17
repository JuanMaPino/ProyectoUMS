import React from 'react';
import { RiDeleteBin6Line, RiFolderLine, RiEyeLine, RiPencilFill, RiUserHeartFill, RiUserStarFill, RiGroupLine } from 'react-icons/ri';  // Añadido icono de grupo

// Componente de botón para ver beneficiarios
const ViewBeneficiariosButton = ({ item, handleViewBeneficiariosClick }) => (
    <button
        onClick={() => handleViewBeneficiariosClick(item)}
        className="rounded-lg transition-colors text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-700 hover:to-blue-800 p-2"
    >
        <RiGroupLine />  {/* Icono para ver beneficiarios */}
    </button>
);

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
        className={`rounded-lg transition-colors text-white ${item.estado === 'activo' ? 'bg-gradient-to-r from-pink-600 to-pink-700 hover:from-red-700 hover:to-red-800' : 'bg-gray-300 cursor-not-allowed'} p-2`}
        disabled={item.estado !== 'activo'}
    >
        <RiDeleteBin6Line />
    </button>
);

// Componente de botón para cambiar rol
const RoleChangeButton = ({ item, handleRoleChange }) => (
    <button
        onClick={() => handleRoleChange(item._id)}
        className={`flex items-center rounded-full p-2 transition-colors ${
            item.rol === 'alfabetizador' ? 'bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white ' : 'bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-700 hover:to-indigo-800 text-white'
        } ${item.estado !== 'activo' ? 'opacity-20 cursor-not-allowed' : ''}`}
        disabled={item.estado !== 'activo'}
        style={{ pointerEvents: item.estado !== 'activo' ? 'none' : 'auto' }}
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

// Componente de botón para ver actividades
const ViewActividadesButton = ({ item, handleViewActividadesButtonClick }) => (
    <button
        onClick={() => handleViewActividadesButtonClick(item._id)}
        className="rounded-lg transition-colors text-white bg-gradient-to-r from-neutral-400 from-10% to-neutral-500 hover:from-neutral-500 hover:to-neutral-600 p-2"
    >
        <RiFolderLine />
    </button>
);

const TableActions = ({ item, handleViewButtonClick, handleEditButtonClick, handleDeleteButtonClick, handleRoleChange, handleViewActividadesButtonClick, handleViewBeneficiariosClick }) => {
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
            
            {/* Botón de ver actividades */}
            {handleViewActividadesButtonClick && <ViewActividadesButton item={item} handleViewActividadesButtonClick={handleViewActividadesButtonClick} />}
            
            {/* Botón de ver beneficiarios */}
            {handleViewBeneficiariosClick && <ViewBeneficiariosButton item={item} handleViewBeneficiariosClick={handleViewBeneficiariosClick} />}
        </div>
    );
};

export default TableActions;
