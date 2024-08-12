import React from "react";

type TPropsType = {
    children: React.ReactNode;
    className?: string;
    type?: "button" | "submit" | "reset"; // Add the type property here
    disabled?:boolean;
    onClick?: React.MouseEventHandler<HTMLButtonElement>; // Add onClick if you plan to use it
};

function Button({ children, className = "", ...props }: TPropsType) {
    return (
        <button className={`btn ${className}`} {...props}>
            {children}
        </button>
    );
}

export default Button;
