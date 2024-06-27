import { usePage } from "@inertiajs/react";
import { useMemo } from "react";

export function usePermission() {
    const { auth } = usePage().props;
    const { user } = auth;
    const { roles, permissions } = user;

    const isSuperAdmin = useMemo(() => roles.includes("super_admin"), [roles]);
    const userPermissions = useMemo(() => new Set(permissions), [permissions]);

    const hasRole = useMemo(
        () => (role) => roles.includes(role),
        [roles]
    );

    const hasPermission = useMemo(
        () => (name) => isSuperAdmin || userPermissions.has(name),
        [isSuperAdmin, userPermissions]
    );

    const anyPermission = useMemo(
        () => (arr) => isSuperAdmin || arr.some((item) => userPermissions.has(item)),
        [isSuperAdmin, userPermissions]
    );

    return { hasRole, hasPermission, anyPermission };
}
