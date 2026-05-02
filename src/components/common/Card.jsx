import React from 'react';
import PropTypes from 'prop-types';

const Card = ({ children, className = '' }) => {
    return (
        <div className={`bg-white rounded-lg shadow-md border border-gray-200 ${className}`}>
            {children}
        </div>
    );
};

Card.propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
};

export default Card;