import React from 'react';
import { FiPlus } from 'react-icons/fi';

const CreateButton = ({ onClick }) => {
    return (
        <button
            onClick={onClick}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-200 to-blue-500 hover:from-blue-300 hover:to-blue-700 text-white px-3 py-2 rounded-md hover:bg-blue-600 transition-colors"
        >
            <FiPlus className="text-xl" />
            <span>Agregar</span>
        </button>
    );
};

export default CreateButton;
