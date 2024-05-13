import React from 'react'
import logoIcon from '../../../images/logo-sm.svg';

function NavbarBrand() {
    return (
        <div className="navbar-brand-box">
            <a href="index.html" className="logo logo-dark">
                <span className="logo-sm">
                    <img src={logoIcon} alt="" height="24" />
                </span>
                <span className="logo-lg">
                    <img src={logoIcon} alt="" height="24" /> <span className="logo-txt">Minia</span>
                </span>
            </a>
            <a href="index.html" className="logo logo-light">
                <span className="logo-sm">
                    <img src={logoIcon} alt="" height="24" />
                </span>
                <span className="logo-lg">
                    <img src={logoIcon} alt="" height="24" /> <span className="logo-txt">Minia</span>
                </span>
            </a>
        </div>
    )
}

export default NavbarBrand