import React, { useMemo } from 'react';
import AuthLayout from '../../Layouts/AuthLayout';
import { Head, usePage } from '@inertiajs/react';
import { Card, CardBody } from '../../components/Card';

import useDownloadFile from '../../hooks/useDownloadFile';

import AuthorizeLink from '../../components/AuthorizeLink';
import Badge from '../../components/Badge';
import ConfirmDelete from '../../components/ConfirmDelete';
import TableTopbar from '../../components/TableTopbar';

import { DataTableProvider } from '../../Factory/DataTable/DataTableContext';
import TableComponent from '../../Factory/DataTable/TableComponent';
import PaginationComponent from '../../Factory/DataTable/PaginationComponent';
import FilterComponent from '../../Factory/DataTable/FilterComponent';

function List({ purchases, purchaseCount }) {

    const { system } = usePage().props;

    // const { isLoading, downloadFile } = useDownloadFile(route('purchase.export'), "purchases.xlsx")

    const columns = useMemo(() => [
        { header: 'Date', accessor: 'date' },
        { header: 'Reference', accessor: 'reference' },
        { header: 'Finance Year', accessor: 'finance_year' },
        { header: 'Supplier', accessor: 'supplier' },
        { header: 'Warehouse', accessor: 'warehouse' },
        { header: `Grand Total (${system.currency.symbol})`, accessor: null, render: (purchase) => ( system.currency.symbol + " " + purchase.grand_total) },
        { header: `Paid Total (${system.currency.symbol})`, accessor: 'null' ,render: (purchase) => ( system.currency.symbol + " " + purchase.paid_amount) },
        { header: 'Order Status', accessor: 'status' },
        { header: 'Payment Status', accessor: 'payment_status' },
        { header: 'User', accessor: 'user' },
        {
            header: 'Action', accessor: null, render: (purchase) => (
                <div className="d-flex flex-no-wrap gap-2">
                    <AuthorizeLink
                        className="btn btn-sm btn-soft-success"
                        ability='purchase.index'
                        href={route('purchase.show', purchase.id)}
                    >
                        <i className="bx bxs-show font-size-16 align-middle"></i>
                    </AuthorizeLink>
                    <AuthorizeLink
                        className="btn btn-sm btn-soft-primary"
                        ability='purchase.edit'
                        href={route('purchase.edit', purchase.id)}
                    >
                        <i className="bx bxs-edit font-size-16 align-middle"></i>
                    </AuthorizeLink>
                    <ConfirmDelete
                        ability='purchase.delete'
                        url={route('purchase.destroy', purchase.id)}
                        btnClass='btn btn-sm btn-soft-danger'
                        btnLabel={<i className="bx bxs-trash font-size-16 align-middle"></i>}
                    />
                </div>
            )
        }
    ], [system]);

    return (
        <AuthLayout>
            <Head title='Purchase | List - ' />

            <Card>
                <CardBody>
                    <TableTopbar
                        title="Purchase List"
                        subTitle='View and Manage Purchase'
                        count={purchaseCount}
                        url={route('purchase.create')}
                        ability={"purchase.create"}
                    />

                    {/* <div className="d-flex my-3 gap-1 justify-content-end">
                        <AuthorizeLink as="button" ability={"purchase.index"} className="btn btn-success w-xs" onClick={downloadFile} disabled={isLoading}>
                            {isLoading ? "Exporting.." : "Export"}
                        </AuthorizeLink>
                    </div> */}

                    <DataTableProvider dataSource={purchases.data}>
                        <FilterComponent />
                        <div className='table-responsive'>
                            <TableComponent columns={columns} />
                        </div>
                        <PaginationComponent />
                    </DataTableProvider>
                </CardBody>
            </Card>
        </AuthLayout>
    );
}

export default List;