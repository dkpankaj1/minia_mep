import React, { useState } from 'react'
import AuthLayout from '../../../Layouts/AuthLayout';
import { Head } from '@inertiajs/react';
import { Card, CardBody } from '../../../components/Card'
import { CustomTable, TBody, THead, THeader, TRow, TData } from '../../../components/Table'
import ConfirmDelete from '../../../components/ConfirmDelete'
import AddForm from './AddForm';
import EditForm from './EditForm';
import { usePermission } from '../../../composable/usePermission';

function Index({ finance_years, finance_years_count }) {

    const { hasPermission } = usePermission()

    return (
        <AuthLayout>
            <Head title='Settings | Finance Year - ' />

            <Card>
                <CardBody>

                    <div className="row align-items-center">
                        <div className="col-6">
                            <div className="mb-3">
                                <h5 className="card-title">{"Finance Years"}<span className="text-muted fw-normal ms-2">({finance_years_count})</span></h5>
                                <p className='card-title-desc'>{"View and Manage Finance Years"}</p>
                            </div>
                        </div>

                        <div className="col-6">
                            <div className="d-flex flex-wrap align-items-center justify-content-end gap-2 mb-3">
                                {
                                    hasPermission("") && <AddForm />
                                }
                            </div>

                        </div>
                    </div>


                    <div className='table-responsive'>
                        <CustomTable className='table'>
                            <THead className="table-light">
                                <TRow>
                                    <THeader>#</THeader>
                                    <THeader>Name</THeader>
                                    <THeader>Start Date</THeader>
                                    <THeader>End Date</THeader>
                                    <THeader>Action</THeader>
                                </TRow>
                            </THead>
                            <TBody>
                                {
                                    finance_years.length <= 0
                                        ? <TRow >
                                            <TData colSpan={5}>No Result Found..</TData>
                                            
                                        </TRow>
                                        : finance_years.map((finance_year, index) => (
                                            <TRow key={index}>
                                                <TData>{index + 1}</TData>
                                                <TData>{finance_year.name}</TData>

                                                <TData>{finance_year.start_date}</TData>
                                                <TData>{finance_year.end_date}</TData>
                                                <TData>
                                                    <div className="d-flex flex-no-wrap gap-2">
                                                        {
                                                            hasPermission("") && <EditForm editedData={finance_year} />
                                                        }
                                                        <ConfirmDelete
                                                            ability={""}
                                                            btnClass='btn btn-sm btn-soft-danger'
                                                            btnLabel={<i className="bx bxs-trash font-size-16 align-middle"></i>}
                                                            url={route('finance-year.destroy', finance_year.id)} />
                                                    </div>
                                                </TData>
                                            </TRow>
                                        ))}
                            </TBody>
                        </CustomTable>
                    </div>
                </CardBody>
            </Card>

        </AuthLayout>
    )
}

export default Index