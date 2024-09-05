import React, { useState, useEffect, useRef, ChangeEvent, FC } from "react";

export interface ISearchableSelectOption {
    value: string | number;
    label: string;
}

interface SearchableSelectProps {
    options: ISearchableSelectOption[];
    defaultValue: string | number;
    onSelect: (option: ISearchableSelectOption | null) => void;
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
    const [selectedOption, setSelectedOption] =
        useState<ISearchableSelectOption | null>(null);
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

    const handleSelect = (option: ISearchableSelectOption) => {
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
        <div
            className="dropdown"
            ref={dropdownRef}
            style={{ position: "relative" }}
        >
            <input
                type="text"
                className={`form-control ${className}`}
                value={searchTerm}
                onChange={handleChange}
                onFocus={() => setIsOpen(true)}
                placeholder={
                    selectedOption ? selectedOption.label : " --- select ---"
                }
                aria-label="Search"
                style={{ cursor: "pointer", paddingRight: "30px" }}
            />
            {clearable && selectedOption && (
                <div
                    onClick={handleClear}
                    style={{
                        position: "absolute",
                        right: "30px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        cursor: "pointer",
                    }}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="bi bi-x"
                        viewBox="0 0 16 16"
                    >
                        <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708" />
                    </svg>
                </div>
            )}

            <div
                style={{
                    position: "absolute",
                    right: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    cursor: "pointer",
                }}
                onClick={() => setIsOpen(true)}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-chevron-down"
                    viewBox="0 0 16 16"
                >
                    <path
                        fillRule="evenodd"
                        d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708"
                    />
                </svg>
            </div>

            {isOpen && (
                <ul
                    className="dropdown-menu show w-100"
                    style={{ overflowX: "scroll" }}
                >
                    {filteredOptions.length > 0 ? (
                        filteredOptions.map((option) => (
                            <li
                                key={option.value}
                                onClick={() => handleSelect(option)}
                            >
                                <button
                                    className={
                                        selectedOption &&
                                        selectedOption.label === option.label
                                            ? "dropdown-item active"
                                            : "dropdown-item"
                                    }
                                >
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
