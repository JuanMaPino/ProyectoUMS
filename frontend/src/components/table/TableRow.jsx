import React from 'react';
import classNames from 'classnames';

const TableRow = ({ children, isActive, className, ...props }) => {
    const rowClass = isActive ? "bg-gradient-to-r from-gray-200 from-40% via-sky-300 to-blue-500 shadow-inner" : "bg-gradient-to-r from-gray-200 from-40% via-red-300 to-red-600 shadow-inner animate-pulse";
    return (
        <div className={classNames("grid grid-cols-1 md:grid-cols-6 gap-4 items-center mb-2 p-1.5 rounded-md", rowClass, className)} {...props}>
            {children}
        </div>
    );
};

export default TableRow;
