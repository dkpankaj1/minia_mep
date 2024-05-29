import React, { useEffect } from 'react'

import { Head, usePage } from '@inertiajs/react';
import { ToastContainer, toast } from 'react-toastify';

function MasterLayout(props) {

    const { flash,system } = usePage().props;
    useEffect(() => {
        flash.success && toast.success(flash.success);
        flash.danger && toast.error(flash.danger);
    }, [flash]);

    return (
        <>
            <Head>
                <link rel="icon" type="image/svg+xml" href={system.favicon || ""} />
            </Head>
            {props.children}
            <ToastContainer autoClose={3000} />
        </>
    )
}

export default MasterLayout