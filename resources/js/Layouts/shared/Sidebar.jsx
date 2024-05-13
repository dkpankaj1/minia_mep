import React, { lazy } from 'react'

const DashboardMenu = lazy(() => import('../sidebarMenus/DashboardMenu'))
const UserMenu = lazy(() => import('../sidebarMenus/UserMenu'))

function Sidebar() {

    return (

        <div id="sidebar-menu">
            <ul className="metismenu list-unstyled">

                <li className="menu-title" data-key="t-menu">Menu</li>

                <DashboardMenu />
                <UserMenu />

            </ul>
        </div>
    )
}

export default Sidebar