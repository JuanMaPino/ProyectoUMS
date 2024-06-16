import React, { useState } from 'react';
import classNames from 'classnames';

const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) {
        return text;
    }
    return text.substring(0, maxLength) + '...';
};

const TableCell = ({ children, truncate, label, className, maxLength = 10, ...props }) => {
    const [isHovered, setIsHovered] = useState(false);
    const shouldTruncate = truncate && !isHovered;
    const content = shouldTruncate ? truncateText(children, maxLength) : children;
    const combinedClassName = classNames("flex flex-col md:flex-row lg:justify-items-center", className);

    return (
        <div
            className={combinedClassName}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            {...props}
        >
            {label && <h5 className="md:hidden text-white font-bold mb-2">{label}</h5>}
            <div>{content}</div>
        </div>
    );
};

export default TableCell;
