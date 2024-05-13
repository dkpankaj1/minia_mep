import React, { useState, useEffect, createContext } from "react";

// Create context
export const LayoutContext = createContext(null);

// LayoutProvider component
export const LayoutProvider = (props) => {
    // State variables
    const [sidebarSize, setSidebarSize] = useState(() => {
        const dataSidebarSize = document.body.getAttribute("data-sidebar-size");
        return dataSidebarSize || "lg";
    });
    const [sidebarTheme, setSidebarTheme] = useState("dark");

    // Toggle sidebar
    const toggleSidebar = () => {
        document.body.classList.toggle("sidebar-enable");
    };

    // Handle vertical menu toggle
    const handleVerticalMenuToggle = () => {
        toggleSidebar();
        const windowWidth = window.innerWidth;
        if (windowWidth >= 992) {
            setSidebarSize(prevSize => prevSize === "lg" ? "sm" : "lg");
        }
    };

    // Toggle theme
    const toggleTheme = () => {
        setSidebarTheme(prevTheme => prevTheme === "light" ? "dark" : "light");
    };

    // Effect for updating body attributes
    useEffect(() => {
        document.body.setAttribute("data-sidebar-size", sidebarSize);
        document.body.setAttribute("data-sidebar", sidebarTheme);
    }, [sidebarSize, sidebarTheme]);

    // Provide context value
    const contextValue = {
        handleVerticalMenuToggle,
        sidebarSize,
        toggleTheme,
        sidebarTheme
    };

    // Render LayoutProvider with context
    return (
        <LayoutContext.Provider value={contextValue}>
            {props.children}
        </LayoutContext.Provider>
    );
};
