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

function List({ suppliers, supplierCount }) {

    const { request } = usePage().props;
    const { data, setData, get } = useForm({
        name: request.query?.name || "",
    });

    const handleSearch = () => {
        const timeout = setTimeout(() => {
            get(route('supplier.index', data), {
                preserveState: true,
                replace: true
            });
        }, 250);
        return () => clearTimeout(timeout);
    };

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

                    <div className="row my-3 gap-1 justify-content-end">
                        <div className="col-sm-12 col-md-5 col-lg-3">
                            <SearchInput
                                value={data.name}
                                onChange={e => setData("name", e.target.value)}
                                onKeyUp={handleSearch}
                            />
                        </div>
                    </div>

                    <div className='table-responsive'>
                        <CustomTable className='table no-wrap'>
                            <THead className="table-light">
                                <TRow>
                                    <THeader>#</THeader>
                                    <THeader>Company</THeader>
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
                                {suppliers.data.map((supplier, index) => (
                                    <TRow key={supplier.id}>
                                        <TData>{index + 1}</TData>
                                        <TData>{supplier.company}</TData>
                                        <TData>{supplier.name}</TData>
                                        <TData>{supplier.email}</TData>
                                        <TData>{supplier.phone}</TData>
                                        <TData>{supplier.address} </TData>
                                        <TData>{supplier.country}</TData>
                                       
                                        <TData>
                                            <Badge className={`rounded-pill font-size-12 fw-medium ${supplier.is_active ? ' bg-success-subtle text-success' : ' bg-danger-subtle text-danger'}`}>
                                                {supplier.is_active ? "Active" : "In Active"}
                                            </Badge>
                                        </TData>

                                        <TData>
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
                                        </TData>
                                    </TRow>
                                ))}
                            </TBody>
                        </CustomTable>
                        <div className="my-3">
                            <Pagination links={suppliers.links} />
                        </div>
                    </div>
                </CardBody>
            </Card>


        </AuthLayout>
    )
}

export default List