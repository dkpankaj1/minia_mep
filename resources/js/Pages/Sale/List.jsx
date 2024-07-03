import React, { useMemo } from 'react'

import AuthLayout from '../../Layouts/AuthLayout'
import { Head, usePage } from '@inertiajs/react'
import { Card, CardBody } from '../../components/Card'
import TableTopbar from '../../components/TableTopbar'
import { DataTableProvider } from '../../Factory/DataTable/DataTableContext'
import FilterComponent from '../../Factory/DataTable/FilterComponent'
import TableComponent from '../../Factory/DataTable/TableComponent'
import AuthorizeLink from '../../components/AuthorizeLink'
import ConfirmDelete from '../../components/ConfirmDelete'
import PaginationComponent from '../../Factory/DataTable/PaginationComponent'

function List({ sales }) {

    const { system } = usePage().props;
    const columns = useMemo(() => [
        { header: 'Date', accessor: 'date' },
        { header: 'Reference', accessor: 'reference' },
        { header: 'Finance Year', accessor: 'finance_year' },
        { header: 'Supplier', accessor: 'supplier' },
        { header: 'Warehouse', accessor: 'warehouse' },
        { header: `Grand Total (${system.currency.symbol})`, accessor: null, render: (purchase) => ( system.currency.symbol + " " + purchase.grand_total.toFixed(2)) },
        { header: `Paid Total (${system.currency.symbol})`, accessor: 'null' ,render: (purchase) => ( system.currency.symbol + " " + purchase.paid_amount.toFixed(2)) },
        { header: 'Order Status', accessor: 'status' },
        { header: 'Payment Status', accessor: 'payment_status' },
        { header: 'User', accessor: 'user' },
        {
            header: 'Action', accessor: null, render: (sale) => (
                <div className="d-flex flex-no-wrap gap-2">
                    <AuthorizeLink
                        className="btn btn-sm btn-soft-success"
                        ability='sale.index'
                        href={route('sale.show', sale.id)}
                    >
                        <i className="bx bxs-show font-size-16 align-middle"></i>
                    </AuthorizeLink>
                    <AuthorizeLink
                        className="btn btn-sm btn-soft-primary"
                        ability='sale.edit'
                        href={route('sale.edit', sale.id)}
                    >
                        <i className="bx bxs-edit font-size-16 align-middle"></i>
                    </AuthorizeLink>
                    <ConfirmDelete
                        ability='sale.delete'
                        url={route('sale.destroy', sale.id)}
                        btnClass='btn btn-sm btn-soft-danger'
                        btnLabel={<i className="bx bxs-trash font-size-16 align-middle"></i>}
                    />
                </div>
            )
        }
    ], [system]);




    return (
        <AuthLayout>
            <Head title='Sale | List - ' />

            <Card>
                <CardBody>
                    <TableTopbar
                        title="Sale List"
                        subTitle='View and Manage Sales'
                        count={0}
                        url={route('sale.create')}
                        ability={"sale.create"}
                    />

                    <DataTableProvider dataSource={sales.data}>
                        <FilterComponent />
                        <div className='table-responsive'>
                            <TableComponent columns={columns} />
                        </div>
                        <PaginationComponent />
                    </DataTableProvider>
                </CardBody>
            </Card>
        </AuthLayout>
    )
}

export default List