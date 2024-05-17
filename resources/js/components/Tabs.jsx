import React from 'react'

export const Tabs = ({ children, className = "", ...rest }) => (
    <ul className={`nav ${className}`} {...rest}>
        {children}
    </ul>
);
export const TabItems = ({ children, className = "", ...rest }) => {
    return (
        <li className={`nav-item ${className}`} {...rest}>
            {children}
        </li>
    )
}
export const TabContent = ({ children, className = "", ...rest }) => (
    <div className={`tab-content ${className}`} {...rest}>{children}</div>
);

export const TabPane = ({ children, index, activeIndex, className = "", ...rest }) => (
    <div
        className={`tab-pane ${className} ${index === activeIndex ? 'active show' : ''}`}
        {...rest}
    >
        {children}
    </div>
);

