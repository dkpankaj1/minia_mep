// List.js
import React from 'react';
import AuthLayout from '../../Layouts/AuthLayout';
import { Card, CardBody } from '../../components/Card';
import { CustomTable, THead, THeader, TBody, TRow, TData } from '../../components/Table';
import AuthorizeLink from '../../components/AuthorizeLink';
import Badge from '../../components/Badge';
import ConfirmDelete from '../../components/ConfirmDelete';
import Pagination from '../../components/Pagination';
import TableTopbar from '../../components/TableTopbar';
import { Head, useForm, usePage } from '@inertiajs/react';
import SearchInput from '../../components/SearchInput';
import awardIcon from '../../../images/award.svg'

function List({ roles }) {
  const { request } = usePage().props;

  const { data, setData, get } = useForm({
    name: request.query?.name || "",
  });

  const handleSearch = () => {
    const timeout = setTimeout(() => {
      get(route('role.index', data), {
        preserveState: true,
        replace: true
      });
    }, 250);
    return () => clearTimeout(timeout);
  };

  return (
    <AuthLayout>
      <Head title='Role | List - ' />
      <Card>
        <CardBody>
          
          <TableTopbar
            title="Role List "
            subTitle='View and Manage Roles'
            count={roles.count}
            url={route('role.create')}
            ability={"role.create"}
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
            <CustomTable className='table'>
              <THead className="table-light">
                <TRow>
                  <THeader>#</THeader>
                  <THeader>ID</THeader>
                  <THeader>Name</THeader>
                  <THeader>User Count</THeader>
                  <THeader>Create At</THeader>
                  <THeader>Action</THeader>
                </TRow>
              </THead>
              <TBody>
                {roles.collection.data.map((role, index) => (
                  <TRow key={role.id}>
                    <TData><img src={awardIcon} alt="role" className="rounded-circle avatar-sm" /></TData>
                    <TData>{index + 1}</TData>
                    <TData>{role.name}</TData>
                    <TData>
                      <Badge className='rounded-pill bg-success-subtle text-success font-size-12 fw-medium'>
                        {role.users_count} - users
                      </Badge>
                    </TData>
                    <TData>{role.created_at}</TData>
                    <TData>
                      <div className="d-flex flex-no-wrap gap-2">
                        <AuthorizeLink
                          className="btn btn-sm btn-soft-success"
                          ability='role.index'
                          href={route('role.show', role.id)}
                        >
                          <i className="bx bxs-show font-size-16 align-middle"></i>
                        </AuthorizeLink>

                        <AuthorizeLink
                          className="btn btn-sm btn-soft-primary"
                          ability='role.edit'
                          href={route('role.edit', role.id)}
                        >
                          <i className="bx bxs-edit font-size-16 align-middle"></i>
                        </AuthorizeLink>

                        <ConfirmDelete
                          ability='role.delete'
                          url={route('role.destroy', role.id)}
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
              <Pagination links={roles.collection.links} />
            </div>
          </div>
        </CardBody>
      </Card>
    </AuthLayout>
  );
}

export default List;
