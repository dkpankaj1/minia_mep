import React from 'react'
import AuthLayout from '../../Layouts/AuthLayout'
import { Head } from '@inertiajs/react'
import { Card, CardBody, CardFooter, CardHeader } from '../../components/Card'
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
              <div className="table-responsive-md">
                <CustomTable className="table table-sm nowrap table-bordered">
                  <TBody>
                    {role.permissionGroup.map((group, index) => (
                      <TRow key={index}>
                        <TData className="bg-light" style={{ fontWeight: 'bold' }}>{group.name}</TData>
                        {group.permissions.map((permission, item) => (
                          <TData key={item}>
                            <div className="row">
                              <div className="col">{permission.name}</div>
                              <div className="col">
                                <FormInput
                                  type="checkbox"
                                  value={permission.name}
                                  checked={isPermissionChecked(permission.name)}
                                  disabled={true}
                                />
                              </div>
                            </div>
                          </TData>
                        ))}
                      </TRow>
                    ))}
                  </TBody>
                </CustomTable>
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
                        ? <TRow colspan={3}>
                          <TData>No user found...</TData>
                        </TRow>
                        : role.assignUser.map((user, index) => (
                          <TRow key={index}>
                            <TData>{user.name}</TData>
                            <TData>{user.email}</TData>
                            <TData>action</TData>
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