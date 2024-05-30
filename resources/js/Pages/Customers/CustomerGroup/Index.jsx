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


const Index = ({ customerGroups, customerGroupsCount }) => {

  const { hasPermission } = usePermission();

  return (
    <AuthLayout>
      <Head title="People | Customer Group -" />

      <Card>
        <CardBody>
          <div className="row align-items-center">
            <div className="col-6">
              <div className="mb-3">
                <h5 className="card-title">
                  Customer Group<span className="text-muted fw-normal ms-2">({customerGroupsCount})</span>
                </h5>
                <p className="card-title-desc">View and Manage Customer Group</p>
              </div>
            </div>
            <div className="col-6">
              <div className="d-flex flex-wrap align-items-center justify-content-end gap-2 mb-3">
                {hasPermission("customer-group.create") && <CreateForm />}
              </div>
            </div>
          </div>
          <div className="table-responsive">
            <CustomTable className="table">
              <THead className="table-light">
                <TRow>
                  <THeader>#</THeader>
                  <THeader>Name</THeader>
                  <THeader>Calculate Rate (%)</THeader>
                  <THeader>description</THeader>
                  <THeader>Action</THeader>
                </TRow>
              </THead>
              <TBody>
                {
                  customerGroups.data.length === 0
                    ? (
                      <TRow>
                        <TData colSpan={4}>No Result Found..</TData>
                      </TRow>
                    )
                    :
                    customerGroups.data.map((customerGroup, index) => {
                      return <TRow key={customerGroup.id}>
                        <TData>{index + 1}</TData>
                        <TData>{customerGroup.name}</TData>
                        <TData>{customerGroup.calculate_rate}</TData>
                        <TData>{customerGroup.description || "none"}</TData>
                        <TData>
                          <div className="d-flex flex-no-wrap gap-2">
                            {hasPermission("customer-group.edit") && <EditForm editedData={customerGroup} />}
                            
                            <ConfirmDelete
                              ability="customer-group.delete"
                              btnClass="btn btn-sm btn-soft-danger"
                              btnLabel={<i className="bx bxs-trash font-size-16 align-middle"></i>}
                              url={route('customer-group.destroy', customerGroup.id)}
                            />

                          </div>
                        </TData>
                      </TRow>
                    })
                }
              </TBody>
            </CustomTable>
            <Pagination links={customerGroups.links} />
          </div>
        </CardBody>
      </Card>
    </AuthLayout>
  );
};

export default memo(Index);
