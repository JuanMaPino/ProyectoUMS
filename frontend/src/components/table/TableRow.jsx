import React from 'react';
import classNames from 'classnames';

const TableRow = ({ children, isActive, className, isMonetario, tipo, ...props }) => {
    let rowClass;
    
    if (isMonetario) {
        rowClass = "bg-gradient-to-r from-gray-200 from-40% to-indigo-100  shadow-inner";
    } else if (tipo === 'Material') {
        rowClass = "bg-gradient-to-r from-gray-200 from-40% to-indigo-100  shadow-inner";
    } else if (isActive) {
        rowClass = "bg-gradient-to-r from-gray-200 from-40% to-indigo-100  shadow-inner";
    } else {
        rowClass = "bg-gradient-to-r from-gray-200 from-40% to-red-50 shadow-inner";
    }

    return (
        <div className={classNames("grid grid-cols-1 md:grid-cols-6 gap-4 items-center mb-2 p-1.5 rounded-md", rowClass, className)} {...props}>
            {children}
        </div>
    );
};

export default TableRow;