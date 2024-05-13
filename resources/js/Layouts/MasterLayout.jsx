import React, { useEffect } from 'react'

import { usePage } from '@inertiajs/react';
import { ToastContainer, toast } from 'react-toastify';

function MasterLayout(props) {

    const { flash } = usePage().props;
    useEffect(() => {
        flash.success && toast.success(flash.success);
        flash.danger && toast.error(flash.danger);
    }, [flash]);

    return (
        <>
            {props.children}
            <ToastContainer autoClose={3000} />
        </>
    )
}

export default MasterLayout