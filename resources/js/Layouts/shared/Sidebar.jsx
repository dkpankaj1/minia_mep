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


                {
                    anyPermission([
                        'sale.index',
                    ])
                    && <CollapsibleMenuItem
                        icon={
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                                className="feather feather-shopping-bag">
                                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                                <line x1="3" y1="6" x2="21" y2="6"></line>
                                <path d="M16 10a4 4 0 0 1-8 0"></path>
                            </svg>
                        }
                        text={"Sale"}
                    >

                        {
                            hasPermission(
                                'sale.index'
                            )
                            && <MenuItem
                                text={"Sale"}
                                link={route('sale.index')}
                                active={route().current('sale.index')}
                            />
                        }

                        {
                            hasPermission(
                                'sale.create'
                            )
                            && <MenuItem
                                text={"Add new"}
                                link={route('sale.create')}
                                active={route().current('sale.create')}
                            />
                        }

                        {
                            hasPermission(
                                'sale.payment.index'
                            )
                            && <MenuItem
                                text={"Payment"}
                                link={route('sale.payment.index')}
                                active={route().current('sale.payment.index')}
                            />
                        }

                    </CollapsibleMenuItem>
                }

                {/* Purchase ::begin */}

                {
                    anyPermission([
                        'purchase.index',
                    ])
                    && <CollapsibleMenuItem
                        icon={
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-shopping-cart">
                                <circle cx="9" cy="21" r="1"></circle>
                                <circle cx="20" cy="21" r="1"></circle>
                                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                            </svg>
                        }
                        text={"Purchase"}
                    >

                        {
                            hasPermission(
                                'purchase.index'
                            )
                            && <MenuItem
                                text={"Purchase"}
                                link={route('purchase.index')}
                                active={route().current('purchase.index')}
                            />
                        }
                        {
                            hasPermission(
                                'purchase.create'
                            )
                            && <MenuItem
                                text={"Add new"}
                                link={route('purchase.create')}
                                active={route().current('purchase.create')}
                            />
                        }
                        {
                            hasPermission(
                                'purchase.payment.index'
                            )
                            && <MenuItem
                                text={"Payment"}
                                link={route('purchase.payment.index')}
                                active={route().current('purchase.payment.index')}
                            />
                        }


                    </CollapsibleMenuItem>
                }


                {/* Purchase ::end */}


                {/* Product ::begin */}
                {
                    anyPermission([
                        'category.index',
                        'product.index',
                        'sub-category.index',
                    ])
                    && <CollapsibleMenuItem
                        icon={
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path
                                    d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                                <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                                <line x1="12" y1="22.08" x2="12" y2="12"></line>
                            </svg>
                        }
                        text={"Products"}
                    >
                        {
                            hasPermission(
                                'product.index'
                            )
                            && <MenuItem
                                text={"Product"}
                                link={route('product.index')}
                                active={route().current('product.*')}
                            />
                        }

                        {
                            hasPermission(
                                'category.index'
                            )
                            && <MenuItem
                                text={"Category"}
                                link={route('category.index')}
                                active={route().current('category.*')}
                            />
                        }

                        {
                            hasPermission(
                                'sub-category.index'
                            )
                            && <MenuItem
                                text={"Sub Category"}
                                link={route('sub-category.index')}
                                active={route().current('sub-category.*')}
                            />
                        }

                    </CollapsibleMenuItem>
                }
                {/* Product ::end */}


                {/* Manufacturing::start */}
                <li className="menu-title" data-key="t-menu">Production</li>

                {
                    anyPermission([
                        'production.bill-of-material.index',
                        'production.production-order.index',
                        'production.stock-issue.index',
                        'production.stock-received.index'
                    ])
                    && <CollapsibleMenuItem
                        icon={
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-inbox">
                                <polyline points="22 12 16 12 14 15 10 15 8 12 2 12"></polyline>
                                <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"></path>
                            </svg>
                        }
                        text={"Production"}
                    >

                        {
                            hasPermission(
                                'production.bill-of-material.index'
                            )
                            && <MenuItem
                                text={"Bill Of Material"}
                                link={route('production.bill-of-material.index')}
                                active={route().current('production.bill-of-material.*')}
                            />
                        }

                        {
                            hasPermission(
                                'production.production-order.index'
                            )
                            && <MenuItem
                                text={"Production Order"}
                                link={route('production.production-order.index')}
                                active={route().current('production.production-order.*')}
                            />
                        }

                        {
                            hasPermission(
                                'production.stock-issue.index'
                            )
                            && <MenuItem
                                text={"Stock Issue"}
                                link={route('production.stock-issue.index')}
                                active={route().current('production.stock-issue.*')}
                            />
                        }

                        {
                            hasPermission(
                                'production.stock-received.index'
                            )
                            && <MenuItem
                                text={"Stock Received"}
                                link={route('production.stock-received.index')}
                                active={route().current('production.stock-received.*')}
                            />
                        }

                    </CollapsibleMenuItem>
                }
                {/* Manufacturing::end */}
                <li className="menu-title" data-key="t-menu">People</li>

                {/* Customer ::begin */}
                {
                    anyPermission([
                        'customer.index',
                        'customer-group.index',
                    ])
                    && <CollapsibleMenuItem
                        icon={
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                <circle cx="9" cy="7" r="4"></circle>
                                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                            </svg>
                        }
                        text={"Customer"}
                    >

                        {
                            hasPermission(
                                'customer.index'
                            )
                            && <MenuItem
                                text={"Customer"}
                                link={route('customer.index')}
                                active={route().current('customer.*')}
                            />
                        }

                        {
                            hasPermission(
                                'customer-group.index'
                            )
                            && <MenuItem
                                text={"Customer Group"}
                                link={route('customer-group.index')}
                                active={route().current('customer-group.*')}
                            />
                        }

                    </CollapsibleMenuItem>
                }
                {/* Customer ::end */}

                {/* Supplier ::begin */}

                {
                    anyPermission([
                        'supplier.index',
                    ])
                    && <CollapsibleMenuItem
                        icon={
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                <circle cx="9" cy="7" r="4"></circle>
                                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                            </svg>
                        }
                        text={"Supplier"}
                    >

                        {
                            hasPermission(
                                'supplier.index'
                            )
                            && <MenuItem
                                text={"Supplier"}
                                link={route('supplier.index')}
                                active={route().current('supplier.index')}
                            />
                        }

                        {
                            hasPermission(
                                'supplier.create'
                            )
                            && <MenuItem
                                text={"Add new"}
                                link={route('supplier.create')}
                                active={route().current('supplier.create')}
                            />
                        }


                    </CollapsibleMenuItem>
                }

                {/* Supplier ::end */}


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
                                active={route().current('user.*')}
                            />
                        }

                        {
                            hasPermission(
                                'role.index'
                            )
                            && <MenuItem
                                text={"Role & Permission"}
                                link={route('role.index')}
                                active={route().current('role.*')}
                            />
                        }

                    </CollapsibleMenuItem>
                }

                {/* user ,role and permission :: end */}

                <li className="menu-title" data-key="t-menu">Masters & settings</li>

                {/* masters :: begin */}

                {
                    anyPermission([
                        'brand.index',
                        'currency.index',
                        'finance-years.index',
                        'unit.index',
                        'warehouse.index'
                    ])
                    && <CollapsibleMenuItem
                        icon={
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-sliders">
                                <line x1="4" y1="21" x2="4" y2="14"></line>
                                <line x1="4" y1="10" x2="4" y2="3"></line>
                                <line x1="12" y1="21" x2="12" y2="12"></line>
                                <line x1="12" y1="8" x2="12" y2="3"></line>
                                <line x1="20" y1="21" x2="20" y2="16"></line>
                                <line x1="20" y1="12" x2="20" y2="3"></line>
                                <line x1="1" y1="14" x2="7" y2="14"></line>
                                <line x1="9" y1="8" x2="15" y2="8"></line>
                                <line x1="17" y1="16" x2="23" y2="16"></line>
                            </svg>
                        }
                        text={"Masters"}
                    >
                        {
                            hasPermission(
                                'brand.index'
                            )
                            && <MenuItem
                                text={"Brand"}
                                link={route('brand.index')}
                                active={route().current('brand.*')}
                            />
                        }
                        {
                            hasPermission(
                                'currency.index'
                            )
                            && <MenuItem
                                text={"Currency"}
                                link={route('currency.index')}
                                active={route().current('currency.*')}
                            />
                        }
                        {
                            hasPermission(
                                'finance-years.index'
                            )
                            && <MenuItem
                                text={"Finance Years"}
                                link={route('finance-year.index')}
                                active={route().current('finance-year.*')}
                            />
                        }
                        {
                            hasPermission(
                                'unit.index'
                            )
                            && <MenuItem
                                text={"Unit"}
                                link={route('unit.index')}
                                active={route().current('unit.*')}
                            />
                        }
                        {
                            hasPermission(
                                'warehouse.index'
                            )
                            && <MenuItem
                                text={"Warehouse"}
                                link={route('warehouse.index')}
                                active={route().current('warehouse.*')}
                            />
                        }
                        {
                            hasPermission(
                                'workstation.index'
                            )
                            && <MenuItem
                                text={"WorkStation"}
                                link={route('workstation.index')}
                                active={route().current('workstation.*')}
                            />
                        }

                    </CollapsibleMenuItem>
                }
                {/* masters :: end */}

                {/* setting :: begin */}

                <CollapsibleMenuItem
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
                            'company.index'
                        )
                        && <MenuItem
                            text={"Company"}
                            link={route('company.index')}
                            active={route().current('company.*')}
                        />
                    }

                    {
                        hasPermission(
                            'systemSetting.index'
                        )
                        && <MenuItem
                            text={"System"}
                            link={route('system.index')}
                            active={route().current('system.index')}
                        />
                    }

                    <MenuItem
                        text={"My Setting"}
                        link={route('my-setting.index')}
                        active={route().current('my-setting.index')}
                    />


                </CollapsibleMenuItem>

                {/* setting :: end */}

            </ul>
        </div>
    )
}

export default Sidebar