import React from 'react';
import { FiPlus } from 'react-icons/fi';

const CreateButton = ({ onClick }) => {
    return (
        <button
            onClick={onClick}
            className="flex items-center gap-2  transition ease-in-out delay-150 bg-gradient-to-r from-violet-500 to-blue-600 hover:from-violet-500  hover:to-blue-600 text-white px-3 py-2 rounded-xl  hover:bg-blue-600 "
        >
            <FiPlus className="text-xl" />
            <span>Agregar</span>
        </button>
    );
};

export default CreateButton;
