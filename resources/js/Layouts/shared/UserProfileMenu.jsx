import React, { useRef, useState } from 'react'
import userAvatar from '../../../images/user.svg';
import useClickOutside from '../../hooks/useClickOutside';
import { Link, useForm, usePage } from '@inertiajs/react';

function UserProfileMenu() {
    const [openProfile, setOpenProfile] = useState(false);
    const { post, processing } = useForm()
    const { auth } = usePage().props
    const profileDropdownRef = useRef(null)
    const toggleProfile = () => setOpenProfile(!openProfile);
    const handleLogout = () => post(route('logout'))

    useClickOutside(profileDropdownRef, () => setOpenProfile(false))

    return (
        <div className="dropdown d-inline-block" ref={profileDropdownRef}>
            <button type="button" className={`btn header-item bg-light-subtle border-start border-end ${openProfile ? "show" : ""}`} onClick={toggleProfile}>
                <img className="rounded-circle header-profile-user" src={auth.user.avatar || userAvatar} alt="Header Avatar" />
                <span className="d-none d-xl-inline-block ms-1 fw-medium">{auth.user.name}</span>
                <i className="mdi mdi-chevron-down d-none d-xl-inline-block"></i>
            </button>
            <div className={`dropdown-menu ${openProfile ? "show" : ""} dropdown-menu-end`} style={{ position: "absolute", inset: "0px 0px auto auto", margin: "0px" }}>
                <a className="dropdown-item" href="apps-contacts-profile.html"><i className="mdi mdi mdi-face-man font-size-16 align-middle me-1"></i> Profile</a>
                <a className="dropdown-item" href="auth-lock-screen.html"><i className="mdi mdi-lock font-size-16 align-middle me-1"></i> Lock Screen</a>
                <div className="dropdown-divider"></div>
                <button as='button' className="dropdown-item" onClick={handleLogout} disabled={processing}>
                    <i className="mdi mdi-logout font-size-16 align-middle me-1"></i>
                    {processing ? "Logout..." : "Logout"}
                </button>
            </div>
        </div>
    )
}

export default UserProfileMenu