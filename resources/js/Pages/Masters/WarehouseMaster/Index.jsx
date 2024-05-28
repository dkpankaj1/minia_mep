import React, { memo, useMemo } from 'react';
import { Head } from '@inertiajs/react';

import AuthLayout from '../../../Layouts/AuthLayout';
import Badge from '../../../components/Badge';
import { Card, CardBody } from '../../../components/Card';
import { CustomTable, TBody, THead, THeader, TRow, TData } from '../../../components/Table';
import ConfirmDelete from '../../../components/ConfirmDelete';
import CreateForm from './CreateForm';
import EditForm from './EditForm';
import Pagination from '../../../components/Pagination';

import { usePermission } from '../../../composable/usePermission';


const Index = ({ warehouses, warehouseCount }) => {
    const { hasPermission } = usePermission();
    const renderTableRows = useMemo(() => {
        if (warehouses.data.length === 0) {
            return (
                <TRow>
                    <TData colSpan={4}>No Result Found..</TData>
                </TRow>
            );
        }
        return warehouses.data.map((warehouse, index) => (
            <TRow key={warehouse.id}>
                <TData>{index + 1}</TData>
                <TData>{warehouse.name}</TData>
                <TData>{warehouse.email}</TData>
                <TData>{warehouse.phone}</TData>
                <TData>{warehouse.city}</TData>
                <TData>{warehouse.state}</TData>
                <TData>{warehouse.country}</TData>
                <TData>
                    <Badge className={`rounded-pill font-size-12 fw-medium ${warehouse.is_active ? ' bg-success-subtle text-success' : ' bg-danger-subtle text-danger'}`}>
                        {warehouse.is_active ? "Active" : "In Active"}
                    </Badge>
                </TData>
                <TData>
                    <div className="d-flex flex-no-wrap gap-2">
                        {hasPermission("warehouse.edit") && <EditForm editedData={warehouse} />}
                        <ConfirmDelete
                            ability="warehouse.delete"
                            btnClass="btn btn-sm btn-soft-danger"
                            btnLabel={<i className="bx bxs-trash font-size-16 align-middle"></i>}
                            url={route('warehouse.destroy', warehouse.id)}
                        />
                    </div>
                </TData>
            </TRow>
        ));
    }, [warehouses.data, hasPermission]);

    return (
        <AuthLayout>
            <Head title="Masters | Warehouse - " />

            <Card>
                <CardBody>
                    <div className="row align-items-center">
                        <div className="col-6">
                            <div className="mb-3">
                                <h5 className="card-title">
                                    Warehouse<span className="text-muted fw-normal ms-2">({warehouseCount})</span>
                                </h5>
                                <p className="card-title-desc">View and Manage Warehouse</p>
                            </div>
                        </div>
                        <div className="col-6">
                            <div className="d-flex flex-wrap align-items-center justify-content-end gap-2 mb-3">
                                {hasPermission("warehouse.create") && <CreateForm />}
                            </div>
                        </div>
                    </div>
                    <div className="table-responsive">
                        <CustomTable className="table">
                            <THead className="table-light">
                                <TRow>
                                    <THeader>#</THeader>
                                    <THeader>Name</THeader>
                                    <THeader>Email</THeader>
                                    <THeader>Phone</THeader>
                                    <THeader>City</THeader>
                                    <THeader>State</THeader>
                                    <THeader>Country</THeader>
                                    <THeader>Status</THeader>
                                    <THeader>Action</THeader>
                                </TRow>
                            </THead>
                            <TBody>{renderTableRows}</TBody>
                        </CustomTable>
                        <Pagination links={warehouses.links} />
                    </div>
                </CardBody>
            </Card>
        </AuthLayout>
    );
};

export default memo(Index);
