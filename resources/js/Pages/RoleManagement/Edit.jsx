import React from 'react';
import AuthLayout from '../../Layouts/AuthLayout';
import { Card, CardBody, CardHeader, CardFooter } from '../../components/Card';
import { CustomTable, TBody, TData, TRow } from '../../components/Table';
import { Head, useForm } from '@inertiajs/react';
import Button from '../../components/Button';
import InputLabel from '../../components/InputLabel';
import FormInput from '../../components/FormInput';
import InvalidFeedback from '../../components/InvalidFeedback';

function Edit({ role, rolePermissions, permissionGroup }) {
  const { data, setData, put, errors, processing } = useForm({
    name: role.name,
    selectedPermissions: rolePermissions,
  });

  const handleCheckboxChange = (event) => {
    const { value, checked } = event.target;
    setData('selectedPermissions', checked
      ? [...data.selectedPermissions, value]
      : data.selectedPermissions.filter((permission) => permission !== value)
    );
  };

  const isPermissionChecked = (permissionName) => {
    return data.selectedPermissions.includes(permissionName);
  };

  const handleSubmit = () => {
    put(route('role.update', role));
  };

  return (
    <AuthLayout>
      <Head title={`Edit Role - `} />
      <Card>
        <CardHeader>
          <h4 className='card-title'>Edit Role</h4>
          <p className='card-title-desc'>Modify and refine the existing role by adjusting permissions and access settings.</p>
        </CardHeader>

        <CardBody>
          <div className="row mb-4">
            <InputLabel className="col-sm-2 col-form-label" label="Role Name" />
            <div className="col-sm-10">
              <FormInput
                type="text"
                className="form-control"
                placeholder="Enter Role Name"
                value={data.name}
                onChange={(e) => setData('name', e.target.value)}
              />
              {errors.name && <InvalidFeedback errorMsg={errors.name} />}
            </div>
          </div>
          <div className="row mb-4">
            <InputLabel className="col-sm-2 col-form-label" label="Permission" />
            <div className="col-sm-10">
              <div className="table-responsive-md">
                <CustomTable className="table table-sm table-hover nowrap table-bordered">
                  <TBody>
                    {permissionGroup.map((group, index) => (
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
                                  onChange={handleCheckboxChange}
                                  checked={isPermissionChecked(permission.name)}
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
              {errors.selectedPermissions && <InvalidFeedback errorMsg={errors.selectedPermissions} />}
            </div>
          </div>
        </CardBody>
        <CardFooter>
          <div className="d-flex justify-content-start">
            <Button
              type="submit"
              className="btn btn-primary w-md"
              onClick={handleSubmit}
              disabled={processing}
            >
              {processing ? "Updating..." : "Update"}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </AuthLayout>
  );
}

export default Edit;
