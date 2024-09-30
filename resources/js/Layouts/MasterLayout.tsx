import React, { useEffect } from "react";

import { Head, usePage } from "@inertiajs/react";
import { ToastContainer, toast } from "react-toastify";
import { PageProp } from "@/types/global";
import { TFlashType } from "@/types/flash.type";
import { TSystemPagePropType } from "@/types/type";

interface IPropsType {
    children: React.ReactNode;
}
interface IPageProps extends PageProp {
    system: TSystemPagePropType;
    flash: TFlashType;
}

function MasterLayout(props: IPropsType) {
    const { flash, system } = usePage<IPageProps>().props;
    useEffect(() => {
        flash.success && toast.success(flash.success);
        flash.danger && toast.error(flash.danger);
    }, [flash]);

    return (
        <>
            <Head>
                <link
                    rel="icon"
                    type="image/svg+xml"
                    href={system.favicon || ""}
                />
            </Head>
            {props.children}
            <ToastContainer autoClose={3000} />
        </>
    );
}

export default MasterLayout;
