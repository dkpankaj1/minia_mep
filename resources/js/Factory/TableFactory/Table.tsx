import React from "react";
import Pagination from "./Pagination";
import Filter from "./Filter";

interface ColumnType<T> {
    header: string;
    accessor?: keyof T | null;
    render?: (row: T) => React.ReactNode;
}
interface TableProps<T> {
    isResponsive?: boolean;
    noWrap?: boolean;
    columns: Array<ColumnType<T>>;
    dataSource: Array<T>;
}
function Table<T>({
    columns,
    dataSource,
    isResponsive = true,
    noWrap = true,
}: TableProps<T>) {
    return (
        <div className={isResponsive ? "table-responsive" : ""}>
            <table className={`table ${noWrap ?? "no-wrap"}`}>
                <thead className="table-light">
                    <tr>
                        <th>SR</th>
                        {columns.map((column, index) => (
                            <th key={index}>{column.header}</th>
                        ))}
                    </tr>
                </thead>

                <tbody>
                    {dataSource.length === 0 ? (
                        <tr>
                            <td
                                colSpan={columns.length + 1}
                                className="text-center"
                            >
                                No Record Found...
                            </td>
                        </tr>
                    ) : (
                        dataSource.map((row, rowIndex) => (
                            <tr key={rowIndex}>
                                <td>{rowIndex + 1}</td>
                                {columns.map((column, colIndex) => (
                                    <td key={colIndex}>
                                        {column.render
                                            ? column.render(row)
                                            : (row[
                                                  column.accessor as keyof T
                                              ] as React.ReactNode)}
                                    </td>
                                ))}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}

Table.Pagination = Pagination;
Table.Filter = Filter;

export default Table;
