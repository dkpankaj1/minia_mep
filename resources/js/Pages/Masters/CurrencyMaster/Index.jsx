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


const Index = ({ currencies, currencyCount }) => {
    const { hasPermission } = usePermission();

    const renderTableRows = useMemo(() => {
        if (currencies.data.length === 0) {
            return (
                <TRow>
                    <TData colSpan={5}>No Result Found..</TData>
                </TRow>
            );
        }
        return currencies.data.map((currency, index) => (
            <TRow key={currency.id}>
                <TData>{index + 1}</TData>
                <TData>{currency.name}</TData>
                <TData>{currency.short_name}</TData>
                <TData>
                    <span className="badge bg-primary-subtle text-primary font-size-18 fw-medium font-bold">
                        {currency.symbol}
                    </span>
                </TData>
                <TData>
                    <div className="d-flex flex-no-wrap gap-2">
                        {hasPermission("currency.manage") && <EditForm editedData={currency} />}
                        <ConfirmDelete
                            ability="currency.manage"
                            btnClass="btn btn-sm btn-soft-danger"
                            btnLabel={<i className="bx bxs-trash font-size-16 align-middle"></i>}
                            url={route('currency.destroy', currency.id)}
                        />
                    </div>
                </TData>
            </TRow>
        ));
    }, [currencies.data, hasPermission]);

    return (
        <AuthLayout>
            <Head title="Masters | Currency -" />

            <Card>
                <CardBody>
                    <div className="row align-items-center">
                        <div className="col-6">
                            <div className="mb-3">
                                <h5 className="card-title">
                                    Currency<span className="text-muted fw-normal ms-2">({currencyCount})</span>
                                </h5>
                                <p className="card-title-desc">View and Manage Currency</p>
                            </div>
                        </div>
                        <div className="col-6">
                            <div className="d-flex flex-wrap align-items-center justify-content-end gap-2 mb-3">
                                {hasPermission("currency.manage") && <CreateForm />}
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
                                    <THeader>Symbol</THeader>
                                    <THeader>Action</THeader>
                                </TRow>
                            </THead>
                            <TBody>{renderTableRows}</TBody>
                        </CustomTable>
                        <Pagination links={currencies.links} />
                    </div>
                </CardBody>
            </Card>
        </AuthLayout>
    );
};

export default memo(Index);
