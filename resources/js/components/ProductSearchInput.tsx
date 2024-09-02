import React from "react";

interface ProductSearchInputProps<T> {
    label?: string;
    placeholder?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    searchResult: T[];
    onSearchResultItemClick: (result: T) => void;
    renderResultItem: (result: T) => React.ReactNode;
}

function ProductSearchInput<T>({
    label = "Product",
    placeholder = "Scan/Search Product",
    value,
    onChange,
    searchResult,
    onSearchResultItemClick,
    renderResultItem,
}: ProductSearchInputProps<T>) {
    return (
        <div className="mb-4 search-container">
            <label className={`form-label`}>{label}</label>
            <div className="input-group">
                <div className="input-group-text px-4 search-input-prefix">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="bi bi-upc-scan"
                        viewBox="0 0 16 16"
                    >
                        <path d="M1.5 1a.5.5 0 0 0-.5.5v3a.5.5 0 0 1-1 0v-3A1.5 1.5 0 0 1 1.5 0h3a.5.5 0 0 1 0 1zM11 .5a.5.5 0 0 1 .5-.5h3A1.5 1.5 0 0 1 16 1.5v3a.5.5 0 0 1-1 0v-3a.5.5.0 0 0-.5-.5h-3a.5.5 0 0 1-.5-.5M.5 11a.5.5 0 0 1 .5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 1 0 1h-3A1.5 1.5 0 0 1 0 14.5v-3a.5.5 0 0 1 .5-.5m15 0a.5.5 0 0 1 .5.5v3a1.5 1.5 0 0 1-1.5 1.5h-3a.5.5 0 0 1 0-1h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 1 .5-.5M3 4.5a.5.5 0 0 1 1 0v7a.5.5 0 0 1-1 0zm2 0a.5.5 0 0 1 1 0v7a.5.5 0 0 1-1 0zm2 0a.5.5 0 0 1 1 0v7a.5.5 0 0 1-1 0zm2 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm3 0a.5.5 0 0 1 1 0v7a.5.5 0 0 1-1 0z" />
                    </svg>
                </div>
                <input
                    type="text"
                    className="form-control py-3 search-input"
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                />
            </div>
            {searchResult.length > 0 && (
                <ul className="searchResultContainer">
                    {searchResult.map((result, index) => (
                        <li
                            key={index}
                            className="searchResultItem"
                            onClick={() => onSearchResultItemClick(result)}
                        >
                            {renderResultItem(result)}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default ProductSearchInput;
