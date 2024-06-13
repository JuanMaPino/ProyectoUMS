import React from 'react';
import { FiDownload } from 'react-icons/fi';

const ExportButton = ({ onClick, type }) => {
    const buttonLabel = type === 'pdf' ? 'Exportar a PDF' : 'Exportar a Excel';
    const buttonColor = type === 'pdf' ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600';

    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-2 text-white px-3 py-2 rounded-md transition-colors ${buttonColor}`}
        >
            <FiDownload className="text-xl" />
            <span>{buttonLabel}</span>
        </button>
    );
};

export default ExportButton;
