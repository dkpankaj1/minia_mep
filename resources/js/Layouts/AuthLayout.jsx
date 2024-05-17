import React, { useContext, lazy } from 'react';
import { LayoutContext } from '../context/Layout';
import MasterLayout from './MasterLayout';
import Sidebar from './shared/Sidebar';

const Breadcrumb = lazy(() => import('../components/Breadcrumb'));
const Footer = lazy(() => import('./shared/Footer'));
const NavbarBrand = lazy(() => import('./shared/NavbarBrand'));
const TopbarSearch = lazy(() => import('./shared/TopbarSearch'));
const UserProfileMenu = lazy(() => import('./shared/UserProfileMenu'));

const AuthLayout = (props) => {

    console.log('render')

    const layoutContext = useContext(LayoutContext);
    return (
        <MasterLayout>
            <div id="layout-wrapper">
                <header id="page-topbar">
                    <div className="navbar-header">
                        <div className="d-flex">
                            <NavbarBrand />
                            <button type="button" className="btn btn-sm px-3 font-size-16 header-item" onClick={layoutContext.handleVerticalMenuToggle} id="vertical-menu-btn">
                                <i className="fa fa-fw fa-bars"></i>
                            </button>
                            <TopbarSearch />
                        </div>
                        <div className="d-flex">
                            <UserProfileMenu />
                        </div>
                    </div>
                </header>

                <div className="vertical-menu" style={{ overflowY: layoutContext.sidebarSize !== "lg" ? "" : "scroll", cursor: "pointer" }}>
                    <div className="h-100">
                        <Sidebar />
                    </div>
                </div>

                <div className="main-content">
                    <div className="page-content">
                        <div className="container-fluid">
                            <div className="row">
                                <div className="col-12">
                                    <div className="page-title-box d-sm-flex align-items-center justify-content-between">
                                        <div className="page-title-right">
                                            <Breadcrumb />
                                        </div>
                                        {/* <h4 className="mb-sm-0 font-size-18">Starter Page</h4> */}
                                    </div>
                                </div>
                            </div>

                            {React.Children.map(props.children, child =>
                                React.cloneElement(child, {})
                            )}
                        </div>
                    </div>
                    <Footer />
                </div>
            </div>
        </MasterLayout>
    );
}

export default React.memo(AuthLayout);


