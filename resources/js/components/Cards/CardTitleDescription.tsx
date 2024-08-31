import React, { FC, ReactNode, HTMLAttributes } from "react";

interface CardTitleDescriptionProps
    extends HTMLAttributes<HTMLParagraphElement> {
    className?: string;
    children: ReactNode;
}
const CardTitleDescription: FC<CardTitleDescriptionProps> = ({
    className = "",
    children,
    ...props
}) => {
    return (
        <p className={`card-title-description ${className}`} {...props}>
            {children}
        </p>
    );
};

export default CardTitleDescription;
