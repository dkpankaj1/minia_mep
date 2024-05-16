// SearchInput.js
import React from 'react';
import FormInput from './FormInput';

const SearchInput = ({ value, onChange, onKeyUp }) => {
  return (
    <div className="input-group">
      <FormInput 
        type="text" 
        className="form-control form-control-sm"
        value={value}
        onChange={onChange}
        onKeyUpCapture={onKeyUp}
      />
      <div className="input-group-text">Search</div>
    </div>
  );
};

export default SearchInput;
