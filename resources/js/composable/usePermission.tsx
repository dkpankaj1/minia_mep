import { TAuthType } from "@/types/auth.type";
import { usePage } from "@inertiajs/react";
import { useMemo } from "react";

export function usePermission() {
    const { auth } = usePage<TAuthType>().props;
    const { user } = auth;
    const { roles, permissions } = user;

    const isSuperAdmin = useMemo(() => roles.includes("super_admin"), [roles]);
    const userPermissions = useMemo(() => new Set(permissions), [permissions]);

    const hasRole = useMemo(
        () => (role:string) => roles.includes(role),
        [roles]
    );

    const hasPermission = useMemo(
        () => (name:string) => isSuperAdmin || userPermissions.has(name),
        [isSuperAdmin, userPermissions]
    );

    const anyPermission = useMemo(
        () => (arr:Array<string>) => isSuperAdmin || arr.some((item) => userPermissions.has(item)),
        [isSuperAdmin, userPermissions]
    );

    return { hasRole, hasPermission, anyPermission };
}
