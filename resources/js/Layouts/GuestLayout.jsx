import React from 'react'
import LogoIcon from "../../images/logo-sm.svg"
import MasterLayout from './MasterLayout'

function GuestLayout(props) {
    return (
        <MasterLayout>
            <div className="auth-page">
                <div className="container-fluid p-0">
                    <div className="row g-0">
                        <div className="col-xxl-3 col-lg-4 col-md-5">
                            <div className="auth-full-page-content d-flex p-sm-5 p-4">
                                <div className="w-100">
                                    <div className="d-flex flex-column h-100">
                                        <div className="mb-4 mb-md-5 text-center">
                                            <a href="index.html" className="d-block auth-logo">
                                                <img src={LogoIcon} alt="" height="28" /> <span className="logo-txt">Minia</span>
                                            </a>
                                        </div>

                                        {props.children}

                                        <div className="mt-4 mt-md-5 text-center">
                                            <p className="mb-0">© 2024 Minia. Crafted with <i className="mdi mdi-heart text-danger"></i> by CortexItSolution</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-xxl-9 col-lg-8 col-md-7">
                            <div className="auth-bg pt-md-5 p-4 d-flex">
                                <div className="bg-overlay bg-primary"></div>
                                <ul className="bg-bubbles">
                                    <li></li>
                                    <li></li>
                                    <li></li>
                                    <li></li>
                                    <li></li>
                                    <li></li>
                                    <li></li>
                                    <li></li>
                                    <li></li>
                                    <li></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MasterLayout>
    )
}

export default GuestLayout