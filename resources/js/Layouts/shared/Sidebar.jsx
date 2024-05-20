import React from 'react'
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

                {/* user ,role and permission :: begin */}
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
                {/* user ,role and permission :: end */}


                {/* settings :: begin */}

                {
                    anyPermission([
                        'setting.finance',
                        'setting.user',
                        'setting.general',
                        'setting.company',
                    ])
                    && <CollapsibleMenuItem
                        icon={
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-settings">
                                <circle cx="12" cy="12" r="3"></circle>
                                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                            </svg>
                        }
                        text={"Settings"}
                    >

                        {
                            hasPermission(
                                'setting.finance'
                            )
                            && <MenuItem
                                text={"Finance Years"}
                                link={route('finance-year.index')}
                                active={route().current('finance-year.index')}
                            />
                        }

                        {
                            hasPermission(
                                'setting.user'
                            )
                            && <MenuItem
                                text={"My Setting"}
                                link={route('role.index')}
                                active={route().current('role.index')}
                            />
                        }

                    </CollapsibleMenuItem>
                }
                {/* settings :: end */}

            </ul>
        </div>
    )
}

export default Sidebar