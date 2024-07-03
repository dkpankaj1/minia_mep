import React, { useMemo } from 'react'
import { Head } from '@inertiajs/react'

import AuthLayout from '../../../Layouts/AuthLayout'
import Badge from '../../../components/Badge';
import { Card, CardBody } from '../../../components/Card';

import TableTopbar from '../../../components/TableTopbar';
import AuthorizeLink from '../../../components/AuthorizeLink';
import ConfirmDelete from '../../../components/ConfirmDelete';
import useDownloadFile from '../../../hooks/useDownloadFile';

import { DataTableProvider } from '../../../Factory/DataTable/DataTableContext';
import TableComponent from '../../../Factory/DataTable/TableComponent';
import PaginationComponent from '../../../Factory/DataTable/PaginationComponent';
import FilterComponent from '../../../Factory/DataTable/FilterComponent';

function List({ customers, customerCount }) {

    const { isLoading, downloadFile } = useDownloadFile(route('customer.export'), "customers.xlsx")

    const columns = [
        { header: 'Name', accessor: 'name' },
        { header: 'Email', accessor: 'email' },
        { header: 'Phone', accessor: 'phone' },
        { header: 'Address', accessor: 'address' },
        { header: 'Country', accessor: 'country' },
        { header: 'Group', accessor: 'customer_group' },
        {
            header: 'Status', accessor: 'is_active', render: (row) => (
                <Badge className={`rounded-pill font-size-12 fw-medium ${row.is_active ? ' bg-success-subtle text-success' : ' bg-danger-subtle text-danger'}`}>
                    {row.is_active ? "Active" : "Inactive"}
                </Badge>
            )
        },
        {
            header: 'Action', accessor: null, render: (customer) => (
                <div className="d-flex flex-no-wrap gap-2">
                    <AuthorizeLink
                        className="btn btn-sm btn-soft-success"
                        ability='customer.index'
                        href={route('customer.show', customer.id)}
                    >
                        <i className="bx bxs-show font-size-16 align-middle"></i>
                    </AuthorizeLink>

                    <AuthorizeLink
                        className="btn btn-sm btn-soft-primary"
                        ability='customer.edit'
                        href={route('customer.edit', customer.id)}
                    >
                        <i className="bx bxs-edit font-size-16 align-middle"></i>
                    </AuthorizeLink>

                    <ConfirmDelete
                        ability='customer.delete'
                        url={route('customer.destroy', customer.id)}
                        btnClass='btn btn-sm btn-soft-danger'
                        btnLabel={<i className="bx bxs-trash font-size-16 align-middle"></i>}
                    />
                </div>
            )
        }
    ]
    // Define searchable columns
    const searchableColumns = ['name', 'email','phone','address'];

    return (
        <AuthLayout>
            <Head title='Customer | List - ' />

            <Card>
                <CardBody>
                    <TableTopbar
                        title="Customer List"
                        subTitle='View and Manage Customer'
                        count={customerCount}
                        url={route('customer.create')}
                        ability={"customer.create"}
                    />

                    <div className="d-flex my-3 gap-1 justify-content-end">
                        <AuthorizeLink as="button" ability={"customer.index"} className="btn btn-success w-xs" onClick={downloadFile} disabled={isLoading}>
                            {isLoading ? "Exporting.." : "Export"}
                        </AuthorizeLink>
                        {/* <div className="btn-group">
                            <button type="button" className="btn btn-danger w-xs" disabled={true}> <i className='bx bxs-file-pdf'></i></button>
                            <button type="button" className="btn btn-success w-xs" onClick={downloadFile} disabled={isLoading}>
                                {isLoading ? <i className="bx bx-loader label-icon"></i> : <i className='bx bxs-file-export'></i>}
                            </button>
                            <button type="button" className="btn btn-info w-xs" disabled={true}><i className='bx bx-printer'></i></button>
                        </div> */}
                    </div>

                    <DataTableProvider dataSource={customers.data} searchableColumns={searchableColumns}>
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