import React from 'react';
import { FiPlus } from 'react-icons/fi';

const CreateButton = ({ onClick }) => {
    return (
        <button
            onClick={onClick}
            className="flex items-center gap-2  transition ease-in-out delay-150 bg-gradient-to-bl from-indigo-200 to-indigo-500 hover:from-indigo-300 hover:to-indigo-700 text-white px-3 py-2 rounded-xl  hover:bg-blue-600 "
        >
            <FiPlus className="text-xl" />
            <span>Agregar</span>
        </button>
    );
};

export default CreateButton;
