import React, { useState, useEffect, useRef, ChangeEvent, FC } from "react";

interface Option {
    value: string;
    label: string;
}

interface SearchableSelectProps {
    options: Option[];
    defaultValue?: string;
    onSelect: (option: Option | null) => void;
    clearable?: boolean;
    className?: string;
}

const SearchableSelect: FC<SearchableSelectProps> = ({
    options,
    defaultValue,
    onSelect,
    clearable = true,
    className = "",
}) => {
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [selectedOption, setSelectedOption] = useState<Option | null>(null);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (defaultValue) {
            const defaultOption = options.find(
                (option) => option.value === defaultValue
            );
            setSelectedOption(defaultOption || null);
        }
    }, [defaultValue, options]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const filteredOptions = options.filter((option) =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSelect = (option: Option) => {
        setSelectedOption(option);
        onSelect(option);
        setIsOpen(false);
        setSearchTerm(""); // Clear search after selection
    };

    const handleClear = () => {
        setSelectedOption(null);
        onSelect(null);
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setIsOpen(true);
    };

    return (
        <div className="dropdown" ref={dropdownRef}>
            <div className="input-group mb-3">
                <input
                    type="text"
                    className={`form-control ${className}`}
                    value={searchTerm}
                    onChange={handleChange}
                    onFocus={() => setIsOpen(true)}
                    placeholder={
                        selectedOption ? selectedOption.label : "Search..."
                    }
                    aria-label="Search"
                />
                {clearable && selectedOption && (
                    <button
                        className="btn btn-outline-secondary"
                        type="button"
                        onClick={handleClear}
                    >
                        &times;
                    </button>
                )}
            </div>
            {isOpen && (
                <ul className="dropdown-menu show w-100" style={{overflowX:"scroll"}}>
                    {filteredOptions.length > 0 ? (
                        filteredOptions.map((option) => (
                            <li
                                key={option.value}
                                onClick={() => handleSelect(option)}
                            >
                                <button className="dropdown-item">
                                    {option.label}
                                </button>
                            </li>
                        ))
                    ) : (
                        <li className="dropdown-item text-muted">
                            No options found
                        </li>
                    )}
                </ul>
            )}
        </div>
    );
};

export default SearchableSelect;
