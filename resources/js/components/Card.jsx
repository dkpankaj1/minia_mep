import React from 'react';

const Card = ({ className="" ,style, children }) => {
  return (
    <div className={`card ${className}`} style={style}>
      {children}
    </div>
  );
};

const CardBody = ({ children }) => {
  return <div className="card-body">{children}</div>;
};

const CardHeader = ({ children,className="" }) => {
  return <div className={`card-header ${className}`}>{children}</div>;
};

const CardFooter = ({ children }) => {
  return <div className="card-footer">{children}</div>;
};

const CardTitle = ({ tag: Tag = 'h5', children }) => {
  const TagName = Tag;
  return <TagName className="card-title">{children}</TagName>;
};

const CardSubtitle = ({ tag: Tag = 'h6', className = '', children }) => {
  const TagName = Tag;
  return <TagName className={`card-subtitle text-muted ${className}`}>{children}</TagName>;
};

export { Card, CardBody, CardHeader, CardFooter, CardTitle, CardSubtitle };

