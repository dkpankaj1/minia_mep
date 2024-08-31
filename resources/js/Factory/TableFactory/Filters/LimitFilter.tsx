import React from "react";

interface ILimitFilterProps {
    limit: number | string | null;
    limitFieldChange: (name: string, value: string | number) => void;
}

function LimitFilter({ limit, limitFieldChange }:ILimitFilterProps) {
    return (
        <label className="mb-0">
            Show &nbsp;&nbsp;
            <select
                className="ml-2 px-3 py-2 bg-success border-0 rounded text-light"
                value={limit || ""}
                onChange={(e) => limitFieldChange("limit", e.target.value)}
            >
                {[10, 25, 50, 100].map((size) => (
                    <option key={size} value={size}>
                        {size}
                    </option>
                ))}
            </select>
            &nbsp;&nbsp;entries
        </label>
    );
}

export default LimitFilter;
