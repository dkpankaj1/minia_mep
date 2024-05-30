import React from 'react'
import { Head, useForm, usePage } from '@inertiajs/react'

import AuthLayout from '../../../Layouts/AuthLayout'
import Badge from '../../../components/Badge';
import { Card, CardBody } from '../../../components/Card';
import { CustomTable, THead, THeader, TBody, TRow, TData } from '../../../components/Table';
import Pagination from '../../../components/Pagination';
import SearchInput from '../../../components/SearchInput';
import TableTopbar from '../../../components/TableTopbar';
import AuthorizeLink from '../../../components/AuthorizeLink';
import ConfirmDelete from '../../../components/ConfirmDelete';

function List({ customers, customerCount }) {

    const { request } = usePage().props;
    const { data, setData, get } = useForm({
        search: request.query?.search || "",
    });

    const handleSearch = () => {
        const timeout = setTimeout(() => {
            get(route('customer.index', data), {
                preserveState: true,
                replace: true
            });
        }, 250);
        return () => clearTimeout(timeout);
    };

    const handleExport = (type) => {
        console.log(`${type} - Exporting ...`)
    }

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

                    <div className="row my-3 gap-1 justify-content-between">
                        <div className="col-sm-12 col-md-5 col-lg-3">
                            <div className="btn-group">
                                <button type="button" className="btn btn-danger w-xs" onClick={e => handleExport('PDF')}><i className='bx bxs-file-pdf'></i></button>
                                <button type="button" className="btn btn-success w-xs" onClick={e => handleExport('EXCEL')}><i className='bx bxs-file-export'></i></button>
                                <button type="button" className="btn btn-info w-xs" onClick={e => handleExport('PRINT')}><i className='bx bx-printer'></i></button>
                            </div>
                        </div>
                        <div className="col-sm-12 col-md-5 col-lg-3">
                            <SearchInput
                                value={data.name}
                                onChange={e => setData("search", e.target.value)}
                                onKeyUp={handleSearch}
                            />
                        </div>
                    </div>

                    <div className='table-responsive'>
                        <CustomTable className='table no-wrap'>
                            <THead className="table-light">
                                <TRow>
                                    <THeader>#</THeader>
                                    <THeader>Name</THeader>
                                    <THeader>Email</THeader>
                                    <THeader>Phone</THeader>
                                    <THeader>Address</THeader>
                                    <THeader>Country</THeader>
                                    <THeader>Status</THeader>
                                    <THeader>Action</THeader>
                                </TRow>
                            </THead>
                            <TBody>
                                {
                                    customers.data.length <= 0
                                        ? <TRow > <TData colSpan="8" className="text-center">No Customer Found..</TData></TRow>
                                        : customers.data.map((customer, index) => (
                                            <TRow key={customer.id}>
                                                <TData>{index + 1}</TData>
                                                <TData>{customer.name}</TData>
                                                <TData>{customer.email}</TData>
                                                <TData>{customer.phone}</TData>
                                                <TData>{customer.address} </TData>
                                                <TData>{customer.country}</TData>

                                                <TData>
                                                    <Badge className={`rounded-pill font-size-12 fw-medium ${customer.is_active ? ' bg-success-subtle text-success' : ' bg-danger-subtle text-danger'}`}>
                                                        {customer.is_active ? "Active" : "In Active"}
                                                    </Badge>
                                                </TData>

                                                <TData>
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
                                                </TData>
                                            </TRow>
                                        ))
                                }

                            </TBody>
                        </CustomTable>
                        <div className="my-3">
                            <Pagination links={customers.links} />
                        </div>
                    </div>
                </CardBody>
            </Card>


        </AuthLayout>
    )
}

export default List