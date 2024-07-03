import React from 'react';
import { useDataTableContext } from './DataTableContext';

const TableComponent = ({ columns }) => {
  const { selectedData, currentPage, pageSize } = useDataTableContext();

  return (
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
        {selectedData.length === 0 ? (
          <tr>
            <td colSpan={columns.length + 1} className="text-center">No Data Found...</td>
          </tr>
        ) : (
          selectedData.map((row, rowIndex) => (
            <tr key={row.id}>
              <td>{currentPage * pageSize + rowIndex + 1}</td>
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
  );
};

export default TableComponent;
