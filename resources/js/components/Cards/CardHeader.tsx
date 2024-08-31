import React, { FC, HTMLAttributes, ReactNode } from "react";

interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
    className?: string;
    children: ReactNode;
}

const CardHeader: FC<CardHeaderProps> = ({
    className = "",
    children,
    ...props
}) => {
    return (
        <div className={`card-header ${className}`} {...props}>
            {children}
        </div>
    );
};

export default CardHeader;
