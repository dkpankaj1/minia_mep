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

function List({ products, productCount }) {


    const { system } = usePage().props;

    const { isLoading, downloadFile } = useDownloadFile(route('product.export'), "products.xlsx")

    const columns = useMemo(() => [
        { header: '#', accessor: 'image', render: (row) => <img src={row.image} className="avatar-sm h-auto d-block rounded" alt="Product" /> },
        { header: 'Code', accessor: 'code' },
        { header: 'Name', accessor: 'name' },
        { header: 'Category', accessor: 'category' },
        { header: 'Sub Category', accessor: 'sub_category' },
        { header: 'Brand', accessor: 'brand' },
        { header: 'Unit', accessor: 'unit' },
        { header: `Cost (${system.currency.symbol})`, accessor: 'cost' },
        { header: `Price (${system.currency.symbol})`, accessor: 'price' },
        {
            header: 'Status', accessor: 'is_active', render: (row) => (
                <Badge className={`rounded-pill font-size-12 fw-medium ${row.is_active ? ' bg-success-subtle text-success' : ' bg-danger-subtle text-danger'}`}>
                    {row.is_active ? "Active" : "Inactive"}
                </Badge>
            )
        },
        {
            header: 'Action', accessor: null, render: (product) => (
                <div className="d-flex flex-no-wrap gap-2">
                    <AuthorizeLink
                        className="btn btn-sm btn-soft-success"
                        ability='product.index'
                        href={route('product.show', product.id)}
                    >
                        <i className="bx bxs-show font-size-16 align-middle"></i>
                    </AuthorizeLink>
                    <AuthorizeLink
                        className="btn btn-sm btn-soft-primary"
                        ability='product.edit'
                        href={route('product.edit', product.id)}
                    >
                        <i className="bx bxs-edit font-size-16 align-middle"></i>
                    </AuthorizeLink>
                    <ConfirmDelete
                        ability='product.delete'
                        url={route('product.destroy', product.id)}
                        btnClass='btn btn-sm btn-soft-danger'
                        btnLabel={<i className="bx bxs-trash font-size-16 align-middle"></i>}
                    />
                </div>
            )
        }
    ], [system]);

    return (
        <AuthLayout>
            <Head title='Product | List - ' />

            <Card>
                <CardBody>
                    <TableTopbar
                        title="Product List"
                        subTitle='View and Manage Product'
                        count={productCount}
                        url={route('product.create')}
                        ability={"product.create"}
                    />

                    <div className="d-flex my-3 gap-1 justify-content-end">
                        <AuthorizeLink as="button" ability={"product.index"} className="btn btn-success w-xs" onClick={downloadFile} disabled={isLoading}>
                            {isLoading ? "Exporting.." : "Export"}
                        </AuthorizeLink>
                    </div>

                    <DataTableProvider dataSource={products.data}>
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
