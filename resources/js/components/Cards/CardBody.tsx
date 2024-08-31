import React, { FC, HTMLAttributes, ReactNode } from "react";

interface CardBodyProps extends HTMLAttributes<HTMLDivElement> {
    className?: string;
    children: ReactNode;
}
const CardBody: FC<CardBodyProps> = ({
    className = "",
    children,
    ...props
}) => {
    return (
        <div className={`card-body ${className}`} {...props}>
            {children}
        </div>
    );
};

export default CardBody;
