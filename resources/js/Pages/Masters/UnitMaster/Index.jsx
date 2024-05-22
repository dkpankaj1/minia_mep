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


const Index = ({ units, unitCount }) => {
    const { hasPermission } = usePermission();

    const renderTableRows = useMemo(() => {
        if (units.data.length === 0) {
            return (
                <TRow>
                    <TData colSpan={4}>No Result Found..</TData>
                </TRow>
            );
        }
        return units.data.map((unit, index) => (
            <TRow key={unit.id}>
                <TData>{index + 1}</TData>
                <TData>{unit.name}</TData>
                <TData>{unit.short_name}</TData>
                <TData>
                    <div className="d-flex flex-no-wrap gap-2">
                        {hasPermission("unit.manage") && <EditForm editedData={unit} units={units.data} />}
                        <ConfirmDelete
                            ability="unit.manage"
                            btnClass="btn btn-sm btn-soft-danger"
                            btnLabel={<i className="bx bxs-trash font-size-16 align-middle"></i>}
                            url={route('unit.destroy', unit.id)}
                        />
                    </div>
                </TData>
            </TRow>
        ));
    }, [units.data, hasPermission]);

    return (
        <AuthLayout>
            <Head title="Masters | Unit -" />

            <Card>
                <CardBody>
                    <div className="row align-items-center">
                        <div className="col-6">
                            <div className="mb-3">
                                <h5 className="card-title">
                                    Unit<span className="text-muted fw-normal ms-2">({unitCount})</span>
                                </h5>
                                <p className="card-title-desc">View and Manage Unit</p>
                            </div>
                        </div>
                        <div className="col-6">
                            <div className="d-flex flex-wrap align-items-center justify-content-end gap-2 mb-3">
                                {hasPermission("unit.manage") && <CreateForm units={units.data} />}
                            </div>
                        </div>
                    </div>
                    <div className="table-responsive">
                        <CustomTable className="table">
                            <THead className="table-light">
                                <TRow>
                                    <THeader>#</THeader>
                                    <THeader>Name</THeader>
                                    <THeader>Short Name</THeader>
                                    <THeader>Action</THeader>
                                </TRow>
                            </THead>
                            <TBody>{renderTableRows}</TBody>
                        </CustomTable>
                        <Pagination links={units.links} />
                    </div>
                </CardBody>
            </Card>
        </AuthLayout>
    );
};

export default memo(Index);
