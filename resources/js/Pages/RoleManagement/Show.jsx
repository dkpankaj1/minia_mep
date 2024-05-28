import React from 'react'
import AuthLayout from '../../Layouts/AuthLayout'
import AuthorizeLink from '../../components/AuthorizeLink'
import { Head } from '@inertiajs/react'
import { Card, CardBody, CardHeader } from '../../components/Card'
import InputLabel from '../../components/InputLabel'
import FormInput from '../../components/FormInput'
import { CustomTable, TBody, TRow, TData, THead, THeader } from '../../components/Table'

function Show({ role }) {

  const isPermissionChecked = (permissionName) => {
    return role.rolePermissions.includes(permissionName);
  };

  return (
    <AuthLayout>
      <Head title='Role Detail - ' />

      <Card>
        <CardHeader>
          <h5>Role Detail</h5>
        </CardHeader>
        <CardBody>

          <div className="row mb-4">
            <InputLabel className="col-sm-2 col-form-label" label="Role Name" />
            <div className="col-sm-10">
              <FormInput
                type="text"
                className="form-control"
                defaultValue={role.resource.name}
                disabled={true}
              />
            </div>
          </div>

          <div className="row mb-4">
            <InputLabel className="col-sm-2 col-form-label" label="Permission" />
            <div className="col-sm-10">
              <div className="row">
                {
                  role.permissionGroup.map((group, index) => (
                    <div className="col-md-6" key={index}>
                      <Card>
                        <CardHeader className="p-2 bg-secondary text-light"> {group.name}</CardHeader>
                        <CardBody>
                          <div className="row">
                            {group.permissions.map((permission, item) => (
                              <div className="col-lg-6 mb-2" key={item}>
                                <div className="form-check d-flex">
                                  <FormInput
                                    type="checkbox"
                                    value={permission.name}
                                    checked={isPermissionChecked(permission.name)}
                                    disabled={true}
                                  />
                                  <label className="form-check-label">
                                    &nbsp;&nbsp;{permission.name}
                                  </label>
                                </div>
                              </div>
                            ))}

                          </div>
                        </CardBody>
                      </Card>
                    </div>
                  ))
                }
              </div>
            </div>
          </div>


          <div className="row mb-4">
            <InputLabel className="col-sm-2 col-form-label" label="Users" />
            <div className="col-sm-10">
              <div className="table-responsive-md">
                <CustomTable className="table table-sm nowrap table-bordered">
                  <THead className="table-light">
                    <TRow>
                      <THeader>Name</THeader>
                      <THeader>Email</THeader>
                      <THeader>Action</THeader>
                    </TRow>
                  </THead>
                  <TBody>
                    {
                      role.assignUser.length <= 0
                        ? <TRow colSpan={3}>
                          <TData>No user found...</TData>
                        </TRow>
                        : role.assignUser.map((user, index) => (
                          <TRow key={index}>
                            <TData>{user.name}</TData>
                            <TData>{user.email}</TData>
                            <TData>
                              <AuthorizeLink ability={'user.index'} href={route('user.show', user.id)}>Show Detail</AuthorizeLink>
                            </TData>
                          </TRow>
                        ))
                    }
                  </TBody>
                </CustomTable>
              </div>
            </div>
          </div>

        </CardBody>
      </Card>

    </AuthLayout>
  )
}

export default Show