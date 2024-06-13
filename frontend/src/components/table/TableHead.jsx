import React from 'react';
import classNames from 'classnames';

const TableHead = ({ children, className, ...props }) => {
    return (
        <div className={classNames("hidden md:grid grid-cols-6 gap-4 mb-4 p-4 font-bold text-center", className)} {...props}>
            {children}
        </div>
    );
};

export default TableHead;
