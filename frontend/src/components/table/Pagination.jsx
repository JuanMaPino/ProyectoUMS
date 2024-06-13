import React from 'react';
import classNames from 'classnames';

const Pagination = ({ totalItems, itemsPerPage, currentPage, onPageChange }) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    return (
        <div className="flex justify-center mt-4">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-secondary-100 rounded-lg mx-1"
            >
                Anterior
            </button>
            {[...Array(totalPages)].map((_, index) => (
                <button
                    key={index}
                    onClick={() => onPageChange(index + 1)}
                    className={classNames("px-4 py-2 rounded-lg mx-1", {
                        "bg-secondary-500 text-white": currentPage === index + 1,
                        "bg-secondary-100": currentPage !== index + 1
                    })}
                >
                    {index + 1}
                </button>
            ))}
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-secondary-100 rounded-lg mx-1"
            >
                Siguiente
            </button>
        </div>
    );
};

export default Pagination;
