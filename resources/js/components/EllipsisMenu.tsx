// import React, { ReactNode } from "react";
// import { Dropdown, Button } from "react-bootstrap";

// interface EllipsisMenuProps {
//     children: ReactNode;
// }

// const EllipsisMenu: React.FC<EllipsisMenuProps> = ({ children }) => {
//     return (
//         <Dropdown align="end">
//             <Dropdown.Toggle
//                 as={Button}
//                 variant="link"
//                 size="sm"
//                 className="btn btn-link font-size-16 shadow-none py-0 text-muted dropdown-toggle"
//             >
//                 <i className="bx bx-dots-horizontal-rounded"></i>
//             </Dropdown.Toggle>

//             <Dropdown.Menu
//                 popperConfig={{
//                     modifiers: [
//                         {
//                             name: "preventOverflow",
//                             options: { boundary: "viewport" },
//                         },
//                     ],
//                 }}
//             >
//                 {children}
//             </Dropdown.Menu>
//         </Dropdown>
//     );
// };

// export default EllipsisMenu;

import React, { ReactNode, useState, useEffect, useRef } from "react";
import { Dropdown, Button } from "react-bootstrap";

interface EllipsisMenuProps {
    children: ReactNode;
}

const EllipsisMenu: React.FC<EllipsisMenuProps> = ({ children }) => {
    const [dropdownPosition, setDropdownPosition] = useState<{
        top: number;
        left: number;
    }>({ top: 0, left: 0 });
    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleToggle = (isOpen: boolean) => {
        if (isOpen && dropdownRef.current) {
            const rect = dropdownRef.current.getBoundingClientRect();
            setDropdownPosition({
                top: rect.top + window.scrollY,
                left: rect.left + window.scrollX,
            });
        }
    };

    return (
        <Dropdown align="end" onToggle={handleToggle}>
            <Dropdown.Toggle
                as={Button}
                variant="link"
                size="sm"
                className="btn btn-link font-size-16 shadow-none py-0 text-muted dropdown-toggle"
                ref={dropdownRef}
            >
                <i className="bx bx-dots-horizontal-rounded"></i>
            </Dropdown.Toggle>

            <Dropdown.Menu
                popperConfig={{
                    modifiers: [
                        {
                            name: "preventOverflow",
                            options: { boundary: "viewport" },
                        },
                    ],
                }}
                style={{
                    top: dropdownPosition.top,
                    left: dropdownPosition.left,
                }}
            >
                {children}
            </Dropdown.Menu>
        </Dropdown>
    );
};

export default EllipsisMenu;
