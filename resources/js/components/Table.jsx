import { useForm, usePage } from '@inertiajs/react';
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
function TFilter({ routeName }) {
    const { data, setData, get } = useForm({
        limit: 10,
        search: ""
    })

    const { system } = usePage().props

    const handleLimits = (e) => {
        () => setData({
            ...data,
            limit: e.target.value
        });
        
        console.log(data)

        // get(route(routeName))
    }



    return (
        <div className="row my-3 gap-1 justify-content-between align-content-baseline">
            <div className="col-sm-12 col-md-5 col-lg-3">
                <label className='mb-0'>
                    Show &nbsp;&nbsp;
                    <select className="ml-2 px-3 py-2 bg-success border-0 rounded text-light" defaultValue={data.limit} onChange={e => handleLimits(e)}>
                        <option value={'10'}>10</option>
                        <option value={'25'}>25</option>
                        <option value={'50'}>50</option>
                        <option value={'-1'}>All</option>
                    </select>
                    &nbsp;&nbsp;entries
                </label>
            </div>
            <div className="col-sm-12 col-md-5 col-lg-3">
                <div className="input-group">
                    <input
                        type="text"
                        className="form-control form-control-sm"
                        value={data.search}
                        onChange={e => setData('search', e.target.value)}
                    />
                    <div className="input-group-text">Search</div>
                </div>
            </div>
        </div>
    )
}

export { CustomTable, THead, THeader, TBody, TRow, TData, TFilter };