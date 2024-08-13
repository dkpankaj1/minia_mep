import React from 'react';

const Card = ({ className = "", style = {}, children }) => {
  return (
    <div className={`card ${className}`} style={style}>
      {children}
    </div>
  );
};

const CardBody = ({ children }) => {
  return <div className="card-body">{children}</div>;
};

const CardHeader = ({ children, className = "" }) => {
  return <div className={`card-header ${className}`}>{children}</div>;
};

const CardTableHeader = ({ title = "", subTitle = "", count = 0, children }) => {
  return (
    <div className="row align-items-center">
      <div className="col-6">
        <div className="mb-3">
          <h5 className="card-title">{title}<span className="text-muted fw-normal ms-2">({count && count})</span></h5>
          <p className='card-title-desc'>{subTitle}</p>
        </div>
      </div>

      <div className="col-6">
        <div className="d-flex flex-wrap align-items-center justify-content-end gap-2 mb-3">
          <div>
            {children}
          </div>
        </div>

      </div>
    </div>
  )
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

export { Card, CardBody, CardHeader,CardTableHeader, CardFooter, CardTitle, CardSubtitle };

