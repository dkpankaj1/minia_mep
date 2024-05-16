import React from 'react'
import logoIcon from '../../../images/logo-sm.svg';
import { Link } from '@inertiajs/react';

function NavbarBrand() {
    return (
        <div className="navbar-brand-box">
            <Link href={route('dashboard')} className="logo logo-dark">
                <span className="logo-sm">
                    <img src={logoIcon} alt="" height="24" />
                </span>
                <span className="logo-lg">
                    <img src={logoIcon} alt="" height="24" /> <span className="logo-txt">Minia</span>
                </span>
            </Link>
            <Link href={route('dashboard')} className="logo logo-light">
                <span className="logo-sm">
                    <img src={logoIcon} alt="" height="24" />
                </span>
                <span className="logo-lg">
                    <img src={logoIcon} alt="" height="24" /> <span className="logo-txt">Minia</span>
                </span>
            </Link>
        </div>
    )
}

export default NavbarBrand