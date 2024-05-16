import React from 'react';

function CustomTable({ children, className = "", ...rest }) {
    return (
        <table className={`table ${className}`} {...rest}>
            {children}
        </table>
    );
}

function THead({ children, ...rest }) {
    return (
        <thead {...rest}>
            {children}
        </thead>
    );
}

function TBody({ children, ...rest }) {
    return (
        <tbody {...rest}>
            {children}
        </tbody>
    );
}
function THeader({ children, ...rest }) {
    return (
        <th {...rest}>
            {children}
        </th>
    );
}

function TRow({ children, ...rest }) {
    return (
        <tr {...rest}>
            {children}
        </tr>
    );
}

function TData({ children, ...rest }) {
    return (
        <td {...rest}>
            {children}
        </td>
    );
}

export { CustomTable,THead,THeader,TBody,TRow,TData };