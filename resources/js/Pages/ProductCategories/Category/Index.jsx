import React, { memo } from 'react';
import { Head } from '@inertiajs/react';

import AuthLayout from '../../../Layouts/AuthLayout';
import { Card, CardBody } from '../../../components/Card';
import { CustomTable, TBody, THead, THeader, TRow, TData } from '../../../components/Table';
import ConfirmDelete from '../../../components/ConfirmDelete';
import CreateForm from './CreateForm';
import EditForm from './EditForm';
import Pagination from '../../../components/Pagination';

import { usePermission } from '../../../composable/usePermission';


const Index = ({ categories, categoryCount }) => {
    const { hasPermission } = usePermission();
    return (
        <AuthLayout>
            <Head title="Category - " />

            <Card>
                <CardBody>
                    <div className="row align-items-center">
                        <div className="col-6">
                            <div className="mb-3">
                                <h5 className="card-title">
                                    Categories<span className="text-muted fw-normal ms-2">({categoryCount})</span>
                                </h5>
                                <p className="card-title-desc">View and Manage Categories</p>
                            </div>
                        </div>
                        <div className="col-6">
                            <div className="d-flex flex-wrap align-items-center justify-content-end gap-2 mb-3">
                                {hasPermission("category.create") && <CreateForm />}
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
                            <TBody>
                                {
                                    categories.data.length === 0
                                        ? (
                                            <TRow>
                                                <TData colSpan={4}>No Result Found..</TData>
                                            </TRow>
                                        )
                                        : (categories.data.map((category, index) => (
                                            <TRow key={category.id}>
                                                <TData>{index + 1}</TData>
                                                <TData>{category.name}</TData>
                                                <TData>{category.description}</TData>
                                                <TData>
                                                    <div className="d-flex flex-no-wrap gap-2">
                                                        {hasPermission("category.edit") && <EditForm editedData={category} />}
                                                        <ConfirmDelete
                                                            ability="category.delete"
                                                            btnClass="btn btn-sm btn-soft-danger"
                                                            btnLabel={<i className="bx bxs-trash font-size-16 align-middle"></i>}
                                                            url={route('category.destroy', category.id)}
                                                        />
                                                    </div>
                                                </TData>
                                            </TRow>
                                        )))
                                }
                            </TBody>
                        </CustomTable>
                        <Pagination links={categories.links} />
                    </div>
                </CardBody>
            </Card>
        </AuthLayout>
    );
};

export default memo(Index);
