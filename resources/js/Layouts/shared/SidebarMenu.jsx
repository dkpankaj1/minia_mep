// import React, { useState, useEffect } from 'react';
// import { Link } from '@inertiajs/react';

// function MenuItem({ icon, text, link, active }) {
//     return (
//         <li className={active ? "mm-active" : ""}>
//             <Link href={link} className={active ? "active" : ""}>
//                 {icon && icon} {/* If you have icons */}
//                 <span>{text}</span>
//             </Link>
//         </li>
//     );
// }

// function CollapsibleMenuItem({ icon, text, children }) {
//     const [open, setOpen] = useState(false);

//     useEffect(() => {
//         setOpen(children.some(child => child.props.active));
//     }, [children]);

//     return (
//         <li className={open ? "mm-active show" : ""}>
//             <a onClick={() => setOpen(!open)} className="has-arrow">
//                 {icon && icon} {/* If you have icons */}
//                 <span>{text}</span>
//             </a>
//             <ul className={open ? "sub-menu mm-collapse mm-show" : "sub-menu mm-collapse"}>
//                 {children}
//             </ul>
//         </li>
//     );
// }

// export { MenuItem, CollapsibleMenuItem }


import React, { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';

function MenuItem({ icon, text, link, active }) {
    return (
        <li className={active ? "mm-active" : ""}>
            <Link href={link} className={active ? "active" : ""}>
                {icon && icon} {/* If you have icons */}
                <span>{text}</span>
            </Link>
        </li>
    );
}

function CollapsibleMenuItem({ icon, text, children }) {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        setOpen(children.some(child => React.isValidElement(child) && child.props.active));
    }, [children]);

    return (
        <li className={open ? "mm-active show" : ""}>
            <a onClick={() => setOpen(!open)} className="has-arrow">
                {icon && icon} {/* If you have icons */}
                <span>{text}</span>
            </a>
            <ul className={open ? "sub-menu mm-collapse mm-show" : "sub-menu mm-collapse"}>
                {children}
            </ul>
        </li>
    );
}

export { MenuItem, CollapsibleMenuItem };
