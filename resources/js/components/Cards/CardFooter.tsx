import React, { FC,HTMLAttributes, ReactNode } from 'react'

interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
  children : ReactNode;
}
const CardFooter : FC<CardFooterProps> = ({
  children,
  ...props
}) => {
  return <div className="card-footer" {...props}>{children}</div>;
}

export default CardFooter