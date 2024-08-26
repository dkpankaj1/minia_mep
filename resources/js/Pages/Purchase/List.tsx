import React, { useMemo } from 'react';
import AuthLayout from '../../Layouts/AuthLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import { Card, CardBody } from '../../components/Card';

import useDownloadFile from '../../hooks/useDownloadFile';

import AuthorizeLink from '../../components/AuthorizeLink';
import Badge from '../../components/Badge';
import ConfirmDelete from '../../components/ConfirmDelete';
import TableTopbar from '../../components/TableTopbar';
import TableFactory from '../../Factory/Table/TableFactory';
import EllipsisMenu from '@/components/EllipsisMenu';
import IsAuthorize from '@/components/IsAuthorize';
import { Dropdown } from 'react-bootstrap';


function List({ purchases, purchaseCount, queryParam = null }:any) {

    const { system } = usePage<any>().props;
    queryParam = queryParam || {}

    // const { isLoading, downloadFile } = useDownloadFile(route('purchase.export'), "purchases.xlsx")

    type TStatus = "paid" | "partial" | "pending"

    const columns = useMemo(() => [
        { header: 'Date', accessor: 'date' },
        { header: 'Reference', accessor: 'reference' },
        { header: 'Finance Year', accessor: 'finance_year' },
        { header: 'Supplier', accessor: 'supplier' },
        { header: 'Warehouse', accessor: 'warehouse' },
        { header: `Grand Total (${system.currency.symbol})`, accessor: null, render: (purchase:any) => (system.currency.symbol + " " + purchase.grand_total.toFixed(2)) },
        { header: `Paid Total (${system.currency.symbol})`, accessor: 'null', render: (purchase:any) => (system.currency.symbol + " " + purchase.paid_amount.toFixed(2)) },
        { header: 'Order Status', accessor: 'status' },
        {
            header: 'Payment Status',render: (purchase:any) => (
                <Badge className={`rounded-pill font-size-12 fw-medium ${purchase.payment_status === "paid" ? ' bg-success-subtle text-success' : ' bg-danger-subtle text-danger'}`}>
                    {purchase.payment_status}
                </Badge>
            )
        },
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
        },
        {
            header: "More",
            accessor: null,
            render: (purchase) => (
                <EllipsisMenu>
                    <IsAuthorize ability={"payment.purchase.create"}>
                        <Link className="dropdown-item" href={route('purchase.payment.create', { purchase: purchase.id })}>
                            <i className="mdi mdi-credit-card-outline me-2"></i>
                            Payment
                        </Link>
                    </IsAuthorize>

                    <IsAuthorize ability={"purchase.index"}>
                        <a
                            href={route("purchase.print", purchase.id)}
                            target="_blank"
                            className="dropdown-item"
                        >
                            <i className="mdi mdi-printer-outline me-2"></i>
                            Print Invoice
                        </a>
                    </IsAuthorize>

                    <IsAuthorize ability={"purchase.index"}>
                        <Dropdown.Item>
                            <i className="mdi mdi-send-outline me-2"></i>
                            Send Invoice
                        </Dropdown.Item>
                    </IsAuthorize>
                </EllipsisMenu>
            ),
        },
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

                    <TableFactory
                        columns={columns}
                        dataSource={purchases}
                        queryParam={queryParam}
                        url={route('purchase.index')}
                    />

                </CardBody>
            </Card>
        </AuthLayout>
    );
}

export default List;
