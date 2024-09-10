import React from 'react';
import classNames from 'classnames';

const TableHead = ({ children, className, cols, ...props }) => {
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

    return (
        <div
            className={classNames(`hidden md:grid gap-4 mb-4 p-4 font-bold text-center`, gridColsClass[cols], className)}
            {...props}
        >
            {children}
        </div>
    );
};

export default TableHead;
