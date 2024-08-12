import React, { useState } from 'react';
import { useDataTableContext } from './DataTableContext';

const FilterComponent = () => {
  const { globalFilter, setGlobalFilter, pageSize, setPageSize, setCurrentPage } = useDataTableContext();
  const [search, setSearch] = useState("")

  const handleFilterChange = (e) => {
    setSearch(e.target.value);
  };

  const handlePageSizeChange = (e) => {
    setCurrentPage(0)
    setPageSize(Number(e.target.value));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      setCurrentPage(0);
      setGlobalFilter(search);
    }
  };

  const handleOnBlur = () => {
    setCurrentPage(0);
    setGlobalFilter(search);
  };

  return (
    <div className="row my-3 gap-1 justify-content-between align-content-baseline">
      <div className="col-sm-12 col-md-5 col-lg-3">
        <label className='mb-0'>
          Show &nbsp;&nbsp;
          <select className="ml-2 px-3 py-2 bg-success border-0 rounded text-light"
            value={pageSize}
            onChange={handlePageSizeChange}
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
            value={search}
            onChange={handleFilterChange}
            onKeyDown={handleKeyPress}
            onBlur={handleOnBlur}
            placeholder="Search records..."
          />
          <div className="input-group-text">Search</div>
        </div>
      </div>
    </div>
  );
};

export default FilterComponent;
