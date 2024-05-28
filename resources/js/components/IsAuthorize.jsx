import React from 'react';
import { usePermission } from '../composable/usePermission';

function IsAuthorize({ ability, children }) {
    const { hasPermission } = usePermission();

    return hasPermission(ability) && (
        <>
            {children}
        </>
    );
}

export default IsAuthorize;
