import React from 'react';
import { Link, router } from '@inertiajs/react';
import Filter from '../TableFactory/Filter';
const TableFactory = ({ columns, dataSource, url, queryParam }) => {

    const searchFieldChange = (name, value) => {
        const updatedQueryParam = { ...queryParam };
        if (value) {
            updatedQueryParam[name] = value;
        } else {
            delete updatedQueryParam[name];
        }
        if (name === "limit") {
            delete updatedQueryParam['page'];
        }
        router.get(url, updatedQueryParam); // Using get method to fetch data
    };

    const onKeyDownHandler = (name, event) => {
        if (event.key !== "Enter") return;
        searchFieldChange(name, event.target.value);
    };

    return (
        <>
            <div className="row my-3 gap-1 justify-content-between align-content-baseline">
                <div className="col-sm-12 col-md-5 col-lg-3">
                    <label className='mb-0'>
                        Show &nbsp;&nbsp;
                        <select
                            className="ml-2 px-3 py-2 bg-success border-0 rounded text-light"
                            value={queryParam.limit || ''}
                            onChange={(e) => searchFieldChange("limit", e.target.value)}
                        >
                            {[10, 25, 50, 100].map((size) => (
                                <option key={size} value={size}>
                                    {size}
                                </option>
                            ))}
                        </select>
                        &nbsp;&nbsp;entries
                    </label>
                </div>
                <div className="col-sm-12 col-md-5 col-lg-3">
                    <div className="input-group">
                        <input
                            type="text"
                            className="form-control form-control-sm"
                            placeholder="Search records..."
                            defaultValue={queryParam.search || ''}
                            onBlur={(e) => searchFieldChange("search", e.target.value)}
                            onKeyDown={(e) => onKeyDownHandler('search', e)}
                        />
                        <div className="input-group-text">Search</div>
                    </div>
                </div>
            </div>


            <div className="table-responsive">
                <table className="table no-wrap">
                    <thead className="table-light">
                        <tr>
                            <th>SR</th>
                            {columns.map((column, index) => (
                                <th key={index}>{column.header}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {dataSource.data.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length + 1} className="text-center">No Data Found...</td>
                            </tr>
                        ) : (
                            dataSource.data.map((row, rowIndex) => (
                                <tr key={row.id}>
                                    <td>{rowIndex + 1}</td>
                                    {columns.map((column, colIndex) => (
                                        <td key={colIndex}>
                                            {column.render ? column.render(row) : row[column.accessor]}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <nav aria-label="Page navigation">
                <ul className="pagination">
                    {dataSource.links && dataSource.links.map((item, index) => (
                        <li
                            key={index}
                            className={`page-item ${item.active && "active"}`}
                        >
                            <Link
                                className="page-link"
                                href={item.url}
                                dangerouslySetInnerHTML={{ __html: item.label }} // Safely render HTML entities
                            />
                        </li>
                    ))}
                </ul>
            </nav>
        </>
    );
};

export default TableFactory;
