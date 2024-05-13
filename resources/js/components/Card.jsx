import React from 'react';

export const Card = ({ style, children }) => {
  return (
    <div className="card" style={style}>
      {children}
    </div>
  );
};

export const CardBody = ({ children }) => {
  return <div className="card-body">{children}</div>;
};

export const CardTitle = ({ tag: Tag, children }) => {
  return <Tag className="card-title">{children}</Tag>;
};

export const CardSubtitle = ({ tag: Tag, className, children }) => {
  return <Tag className={`card-subtitle text-muted ${className}`}>{children}</Tag>;
};


