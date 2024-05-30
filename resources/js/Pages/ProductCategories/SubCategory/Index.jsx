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


const Index = ({ subCategories, subCategoryCount, categories }) => {
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
                                    SubCategory<span className="text-muted fw-normal ms-2">({subCategoryCount})</span>
                                </h5>
                                <p className="card-title-desc">View and Manage SubCategory</p>
                            </div>
                        </div>
                        <div className="col-6">
                            <div className="d-flex flex-wrap align-items-center justify-content-end gap-2 mb-3">
                                {hasPermission("sub-category.create") && <CreateForm categories={categories}/>}
                            </div>
                        </div>
                    </div>
                    <div className="table-responsive">
                        <CustomTable className="table">
                            <THead className="table-light">
                                <TRow>
                                    <THeader>#</THeader>
                                    <THeader>Name</THeader>
                                    <THeader>Category</THeader>
                                    <THeader>description</THeader>
                                    <THeader>Action</THeader>
                                </TRow>
                            </THead>
                            <TBody>
                                {
                                    subCategories.data.length === 0
                                        ? (
                                            <TRow>
                                                <TData colSpan={5}>No Result Found..</TData>
                                            </TRow>
                                        )
                                        : (subCategories.data.map((subCategory, index) => (
                                            <TRow key={subCategory.id}>
                                                <TData>{index + 1}</TData>
                                                <TData>{subCategory.name}</TData>
                                                <TData>{subCategory.category.name}</TData>
                                                <TData>{subCategory.description}</TData>
                                                <TData>
                                                    <div className="d-flex flex-no-wrap gap-2">
                                                        {hasPermission("sub-category.edit") && <EditForm editedData={subCategory} categories={categories}/>}
                                                        <ConfirmDelete
                                                            ability="sub-category.delete"
                                                            btnClass="btn btn-sm btn-soft-danger"
                                                            btnLabel={<i className="bx bxs-trash font-size-16 align-middle"></i>}
                                                            url={route('sub-category.destroy', subCategory.id)}
                                                        />
                                                    </div>
                                                </TData>
                                            </TRow>
                                        )))
                                }
                            </TBody>
                        </CustomTable>
                        <Pagination links={subCategories.links} />
                    </div>
                </CardBody>
            </Card>
        </AuthLayout>
    );
};

export default memo(Index);
