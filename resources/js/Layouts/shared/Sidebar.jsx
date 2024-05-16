import React, { lazy } from 'react'
import { MenuItem, CollapsibleMenuItem } from '../shared/SidebarMenu'
import { usePermission } from '../../composable/usePermission'

function Sidebar() {
    const { hasPermission, anyPermission } = usePermission()

    return (

        <div id="sidebar-menu">
            <ul className="metismenu list-unstyled">

                <li className="menu-title" data-key="t-menu">Menu</li>

                <MenuItem
                    icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" ><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>}
                    text={"Dashboard"}
                    link={route('dashboard')}
                    active={route().current('dashboard')}
                />


                {
                    anyPermission([
                        'role.index',
                        'role.create',
                        'role.edit',
                        'role.delete',
                        'user.index',
                        'user.create',
                        'user.edit',
                        'user.delete'
                    ])
                    && <CollapsibleMenuItem
                        icon={
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                        }
                        text={"User Management"}
                    >

                        {
                            hasPermission(
                                'user.index'
                            )
                            && <MenuItem
                                text={"Users"}
                                link={route('user.index')}
                                active={route().current('user.index')}
                            />
                        }

                        {
                            hasPermission(
                                'role.index'
                            )
                            && <MenuItem
                                text={"Role & Permission"}
                                link={route('role.index')}
                                active={route().current('role.index')}
                            />
                        }

                    </CollapsibleMenuItem>
                }



            </ul>
        </div>
    )
}

export default Sidebar