import React from 'react'

function FormSelect({children,className="",...rest}) {
    return (
        <select className={`form-select ${className}`} {...rest}>
            <option> --- Select ---</option>
            {children}
        </select>
    )
}

export default FormSelect