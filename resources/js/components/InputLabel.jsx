import React from 'react';

function InputLabel({ label, className = '', ...props }) {
    return (
        <label className={`form-label ${className}`} {...props}>{label}</label>
    );
}

export default InputLabel;
