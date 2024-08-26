import { useState, useEffect, useRef } from 'react';
import useClickOutside from '@/hooks/useClickOutside';

const CustomSelect = ({ options, value, onChange, placeholder = 'Select an option', className = "" }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOption, setSelectedOption] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
  useClickOutside(dropdownRef, () => setIsOpen(false))

  useEffect(() => {
    const selected = options.find(option => option.value === value);
    setSelectedOption(selected);
    setSearchTerm(selected ? selected.label : '');
  }, [value, options]);

  const handleInputChange = (event) => {
    const newValue = event.target.value;
    setSearchTerm(newValue);
    if (!isOpen) setIsOpen(true);

    if (newValue === '') {
      setSelectedOption(null);
      onChange("");
    }
  };

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setIsOpen(false);
    setSearchTerm(option.label);
    onChange(option.value);
  };

  const handleClearClick = () => {
    setSearchTerm('');
    setSelectedOption(null);
    onChange('');
    inputRef.current.focus(); // Optionally focus back to the input field
  };

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const dropdownMenuStyle = {
    maxHeight: '200px',
    overflowY: 'auto'
  };

  return (
    <div className="dropdown" style={{ position: 'relative' }} ref={dropdownRef}>
      <input
        type="text"
        className={`form-control ${className}`}
        value={searchTerm}
        onChange={handleInputChange}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        placeholder={searchTerm === '' ? placeholder : selectedOption ? selectedOption.label : 'Select an option'}
        ref={inputRef}
        style={{ cursor: 'pointer', paddingRight: '30px' }} // Add padding for icon
      />
      {searchTerm && (
        <div
          onClick={handleClearClick}
          style={{
            position: 'absolute',
            right: '10px',
            top: '50%',
            transform: 'translateY(-50%)',
            cursor: 'pointer'
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x" viewBox="0 0 16 16">
            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708" />
          </svg>
        </div>
      )}
      {isOpen && (
        <div className="dropdown-menu w-100 show" style={dropdownMenuStyle}>
          <ul className="list-unstyled" style={{ padding: 0, margin: 0 }}>
            {filteredOptions.map(option => (
              <li
                key={option.value}
                className="dropdown-item"
                onClick={() => handleOptionClick(option)}
                style={{ cursor: 'pointer' }}
              >
                {option.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CustomSelect;
