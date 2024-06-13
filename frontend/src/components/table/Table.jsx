import React from 'react';
import classNames from 'classnames';

const Table = ({ children, className, ...props }) => {
    return (
        <div className={classNames("bg-gray-100  p-8 rounded-xl shadow-inner items-center", className)} {...props}>
            {children}
        </div>
    );
};

export default Table;