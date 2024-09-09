import React from 'react';
import classNames from 'classnames';

const TableRow = ({ children, isActive, className, cols, isMonetario, tipo, ...props }) => {
    const gridColsClass = {
        1: 'grid-cols-1',
        2: 'grid-cols-2',
        3: 'grid-cols-3',
        4: 'grid-cols-4',
        5: 'grid-cols-5',
        6: 'grid-cols-6',
        7: 'grid-cols-7',
        8: 'grid-cols-8',
        9: 'grid-cols-9',
        10: 'grid-cols-10',
    };

    let rowClass;
    
    if (isMonetario) {
        rowClass = "bg-gradient-to-r from-gray-200 from-40% to-indigo-100 shadow-inner";
    } else if (tipo === 'Material') {
        rowClass = "bg-gradient-to-r from-gray-200 from-40% to-indigo-100 shadow-inner";
    } else if (isActive) {
        rowClass = "bg-gradient-to-r from-gray-200 from-40% to-indigo-100 shadow-inner";
    } else {
        rowClass = "bg-gradient-to-r from-gray-200 from-40% to-red-50 shadow-inner";
    }

    return (
        <div
            className={classNames(`grid gap-4 items-center mb-2 p-1.5 rounded-md`, gridColsClass[cols], rowClass, className)}
            {...props}
        >
            {children}
        </div>
    );
};

export default TableRow;
