import React from "react";
import { usePermission } from "@/composable/usePermission";
import { Link } from "@inertiajs/react";
interface CreateBtnProps extends React.HTMLAttributes<HTMLAnchorElement> {
    ability: string;
    url: string;
    className?: string;
}
const CreateBtn: React.FC<CreateBtnProps> = ({ ability, url, className = "" }) => {
    const { hasPermission } = usePermission();

    return (
        <>
            {hasPermission(ability) && (
                <Link className={`btn btn-light ${className}`} href={url}>
                    <i className="bx bx-plus me-1"></i> Add New
                </Link>
            )}
        </>
    );
};

export default CreateBtn;
