import { usePage } from "@inertiajs/react";

export function usePermission() {
    const { auth } = usePage().props;
    const userPermissions = auth.user.permissions;

    const hasPermission = name => auth.user.roles.includes("super_admin") || userPermissions.includes(name);
    const anyPermission = arr => auth.user.roles.includes("super_admin") || arr.some(item => userPermissions.includes(item));

    return { hasPermission, anyPermission };
}
