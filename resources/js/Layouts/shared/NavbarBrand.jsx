import React from 'react'
import logoIcon from '../../../images/logo-sm.svg';
import { Link, usePage } from '@inertiajs/react';

function NavbarBrand() {
    const {system} = usePage().props

    return (
        <div className="navbar-brand-box">
            <Link href={route('dashboard')} className="logo logo-dark">
                <span className="logo-sm">
                    <img src={logoIcon} alt="" height="24" />
                </span>
                <span className="logo-lg">
                    <img src={logoIcon} alt="" height="24" /> <span className="logo-txt">{system.app_name}</span>
                </span>
            </Link>
            <Link href={route('dashboard')} className="logo logo-light">
                <span className="logo-sm">
                    <img src={logoIcon} alt="" height="24" />
                </span>
                <span className="logo-lg">
                    <img src={system.logo} alt="" height="24" /> <span className="logo-txt">{system.app_name}</span>
                </span>
            </Link>
        </div>
    )
}

export default NavbarBrand