import React from 'react'
import { Head, useForm, usePage } from '@inertiajs/react'

import AuthLayout from '../../Layouts/AuthLayout'
import Badge from '../../components/Badge';
import { Card, CardBody } from '../../components/Card';
import { CustomTable, THead, THeader, TBody, TRow, TData } from '../../components/Table';
import Pagination from '../../components/Pagination';
import SearchInput from '../../components/SearchInput';
import TableTopbar from '../../components/TableTopbar';
import AuthorizeLink from '../../components/AuthorizeLink';
import ConfirmDelete from '../../components/ConfirmDelete';
import { DataTableProvider } from '../../Factory/DataTable/DataTableContext';
import FilterComponent from '../../Factory/DataTable/FilterComponent';
import TableComponent from '../../Factory/DataTable/TableComponent';
import PaginationComponent from '../../Factory/DataTable/PaginationComponent';

function List({ suppliers, supplierCount }) {

    const columns = [
        { header: 'Company', accessor: 'company' },
        { header: 'Name', accessor: 'name' },
        { header: 'Email', accessor: 'email' },
        { header: 'Phone', accessor: 'phone' },
        { header: 'Address', accessor: 'address' },
        { header: 'Country', accessor: 'country' },
        {
            header: 'Status', accessor: 'is_active', render: (row) => (
                <Badge className={`rounded-pill font-size-12 fw-medium ${row.is_active ? ' bg-success-subtle text-success' : ' bg-danger-subtle text-danger'}`}>
                    {row.is_active ? "Active" : "Inactive"}
                </Badge>
            )
        },
        {
            header: 'Action', accessor: null, render: (supplier) => (
                <div className="d-flex flex-no-wrap gap-2">
                    <AuthorizeLink
                        className="btn btn-sm btn-soft-success"
                        ability='supplier.index'
                        href={route('supplier.show', supplier.id)}
                    >
                        <i className="bx bxs-show font-size-16 align-middle"></i>
                    </AuthorizeLink>

                    <AuthorizeLink
                        className="btn btn-sm btn-soft-primary"
                        ability='supplier.edit'
                        href={route('supplier.edit', supplier.id)}
                    >
                        <i className="bx bxs-edit font-size-16 align-middle"></i>
                    </AuthorizeLink>

                    <ConfirmDelete
                        ability='supplier.delete'
                        url={route('supplier.destroy', supplier.id)}
                        btnClass='btn btn-sm btn-soft-danger'
                        btnLabel={<i className="bx bxs-trash font-size-16 align-middle"></i>}
                    />
                </div>
            )
        }
    ];
    // Define searchable columns
    const searchableColumns = ['company','name','email','phone','address',];

    return (
        <AuthLayout>
            <Head title='Supplier | List -' />

            <Card>
                <CardBody>
                    <TableTopbar
                        title="Supplier List"
                        subTitle='View and Manage Users'
                        count={supplierCount}
                        url={route('supplier.create')}
                        ability={"supplier.create"}
                    />

                    <DataTableProvider dataSource={suppliers.data} searchableColumns={searchableColumns}>
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