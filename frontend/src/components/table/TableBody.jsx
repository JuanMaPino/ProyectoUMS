import React from 'react';
import classNames from 'classnames';

const TableBody = ({ children, className, ...props }) => {
    return (
        <div className={classNames("flex flex-col", className)} {...props}>
            {children}
        </div>
    );
};

export default TableBody;
