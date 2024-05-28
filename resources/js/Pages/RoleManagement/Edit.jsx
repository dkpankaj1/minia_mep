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
              <div className="row">
                {
                  permissionGroup.map((group, index) => (
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
                                    onChange={handleCheckboxChange}
                                    checked={isPermissionChecked(permission.name)}
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
