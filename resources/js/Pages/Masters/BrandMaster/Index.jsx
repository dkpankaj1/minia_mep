import React, { memo, useMemo } from 'react';
import { Head } from '@inertiajs/react';

import AuthLayout from '../../../Layouts/AuthLayout';
import { Card, CardBody } from '../../../components/Card';
import { CustomTable, TBody, THead, THeader, TRow, TData } from '../../../components/Table';
import ConfirmDelete from '../../../components/ConfirmDelete';
import CreateForm from './CreateForm';
import EditForm from './EditForm';
import Pagination from '../../../components/Pagination';

import { usePermission } from '../../../composable/usePermission';


const Index = ({ brands, brandCount }) => {
    const { hasPermission } = usePermission();

    const renderTableRows = useMemo(() => {
        if (brands.data.length === 0) {
            return (
                <TRow>
                    <TData colSpan={4}>No Result Found..</TData>
                </TRow>
            );
        }
        return brands.data.map((brand, index) => (
            <TRow key={brand.id}>
                <TData>{index + 1}</TData>
                <TData>{brand.name}</TData>
                <TData>{brand.description}</TData>
                <TData>
                    <div className="d-flex flex-no-wrap gap-2">
                        {hasPermission("brand.manage") && <EditForm editedData={brand} />}
                        <ConfirmDelete
                            ability="brand.manage"
                            btnClass="btn btn-sm btn-soft-danger"
                            btnLabel={<i className="bx bxs-trash font-size-16 align-middle"></i>}
                            url={route('brand.destroy', brand.id)}
                        />
                    </div>
                </TData>
            </TRow>
        ));
    }, [brands.data, hasPermission]);

    return (
        <AuthLayout>
            <Head title="Masters | Brand -" />

            <Card>
                <CardBody>
                    <div className="row align-items-center">
                        <div className="col-6">
                            <div className="mb-3">
                                <h5 className="card-title">
                                    Brands<span className="text-muted fw-normal ms-2">({brandCount})</span>
                                </h5>
                                <p className="card-title-desc">View and Manage Brands</p>
                            </div>
                        </div>
                        <div className="col-6">
                            <div className="d-flex flex-wrap align-items-center justify-content-end gap-2 mb-3">
                                {hasPermission("brand.manage") && <CreateForm />}
                            </div>
                        </div>
                    </div>
                    <div className="table-responsive">
                        <CustomTable className="table">
                            <THead className="table-light">
                                <TRow>
                                    <THeader>#</THeader>
                                    <THeader>Name</THeader>
                                    <THeader>description</THeader>
                                    <THeader>Action</THeader>
                                </TRow>
                            </THead>
                            <TBody>{renderTableRows}</TBody>
                        </CustomTable>
                        <Pagination links={brands.links} />
                    </div>
                </CardBody>
            </Card>
        </AuthLayout>
    );
};

export default memo(Index);
