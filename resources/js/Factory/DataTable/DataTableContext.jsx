import React, { createContext, useContext, useState, useEffect } from 'react';

const DataTableContext = createContext();

export const useDataTableContext = () => {
  return useContext(DataTableContext);
};

export const DataTableProvider = ({ children, dataSource }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [globalFilter, setGlobalFilter] = useState('');
  const [data, setData] = useState(dataSource);

  useEffect(() => {
    console.log('useEffect call from DataTableProvider')
    setData(dataSource);
  }, [dataSource]);

  const filteredData = data.filter(item =>
    Object.values(item).some(value =>
      typeof value === 'string' && value.toLowerCase().includes(globalFilter.toLowerCase())
    )
  );

  const pageCount = Math.ceil(filteredData.length / pageSize);
  const startIndex = currentPage * pageSize;
  const selectedData = filteredData.slice(startIndex, startIndex + pageSize);

  return (
    <DataTableContext.Provider
      value={{
        currentPage,
        setCurrentPage,
        pageSize,
        setPageSize,
        globalFilter,
        setGlobalFilter,
        pageCount,
        selectedData,
        data,
        setData
      }}
    >
      {children}
    </DataTableContext.Provider>
  );
};
