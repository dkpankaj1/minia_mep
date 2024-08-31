import React, { FC, ReactNode, HTMLAttributes } from 'react';
import CardTitleDescription from './CardTitleDescription';

// Define the props for the CardTitle component
interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  className?: string;
  children: ReactNode;
}

// Create the CardTitle component
const CardTitle: FC<CardTitleProps> & {
  Description: typeof CardTitleDescription;
} = ({ className = '', children, ...props }) => {
  return (
    <h5 className={`card-title ${className}`} {...props}>
      {children}
    </h5>
  );
};

// Attach the Description subComponent to CardTitle
CardTitle.Description = CardTitleDescription;

export default CardTitle;
