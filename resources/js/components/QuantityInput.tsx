import React from "react";

interface PropType {
    index: number;
    value: number;
    setValue: (index: number, newValue: number) => void;
    maxValue?: number;
    minValue?: number;
}

const QuantityInput = ({
    index,
    value,
    setValue,
    maxValue = 100,
    minValue = 1,
}: PropType) => {
    const handleDecrease = () => {
        const newValue = Math.max(value - 1, minValue);
        setValue(index, newValue);
    };

    const handleIncrease = () => {
        const newValue = Math.min(value + 1, maxValue); // use Math.min to ensure value does not exceed maxValue
        setValue(index, newValue);
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = +event.target.value;
        if (!isNaN(newValue)) {
            setValue(index, Math.min(Math.max(newValue, minValue), maxValue));
        }
    };

    return (
        <div className="d-flex gap-1">
            <button onClick={handleDecrease} className="btn btn-sm btn-danger">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-dash-lg"
                    viewBox="0 0 16 16"
                >
                    <path
                        fillRule="evenodd"
                        d="M2 8a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11A.5.5 0 0 1 2 8"
                    />
                </svg>
            </button>
            <input
                step={0.1}
                type="number"
                value={value}
                onChange={handleChange}
                style={{ width: "65px" }}
            />
            <button onClick={handleIncrease} className="btn btn-sm btn-success">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-plus-lg"
                    viewBox="0 0 16 16"
                >
                    <path
                        fillRule="evenodd"
                        d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2"
                    />
                </svg>
            </button>
        </div>
    );
};

export default QuantityInput;
