// import { usePage } from "@inertiajs/react";

// export function usePermission() {
//     const { auth } = usePage().props;
//     const userPermissions = auth.user.permissions;

//     const hasPermission = name => auth.user.roles.includes("super_admin") || userPermissions.includes(name);
//     const anyPermission = arr => auth.user.roles.includes("super_admin") || arr.some(item => userPermissions.includes(item));

//     return { hasPermission, anyPermission };
// }


import { usePage } from "@inertiajs/react";
import { useMemo } from "react";

export function usePermission() {
    const { auth } = usePage().props;
    const { user } = auth;
    const { roles, permissions } = user;

    const isSuperAdmin = useMemo(() => roles.includes("super_admin"), [roles]);
    const userPermissions = useMemo(() => new Set(permissions), [permissions]);

    const hasPermission = useMemo(
        () => (name) => isSuperAdmin || userPermissions.has(name),
        [isSuperAdmin, userPermissions]
    );

    const anyPermission = useMemo(
        () => (arr) => isSuperAdmin || arr.some((item) => userPermissions.has(item)),
        [isSuperAdmin, userPermissions]
    );

    return { hasPermission, anyPermission };
}
