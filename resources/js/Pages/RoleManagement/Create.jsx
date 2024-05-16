import React from 'react';
import AuthLayout from '../../Layouts/AuthLayout';
import { Card, CardBody, CardHeader, CardFooter } from '../../components/Card';
import { CustomTable, TBody, TData, TRow } from '../../components/Table';
import { Head, useForm } from '@inertiajs/react';
import Button from '../../components/Button';
import InputLabel from '../../components/InputLabel';
import FormInput from '../../components/FormInput';
import InvalidFeedback from '../../components/InvalidFeedback';

const Create = ({ permissionGroup }) => {
  const { data, setData, post, errors, processing } = useForm({
    name: '',
    selectedPermissions: [],
  });

  const handleCheckboxChange = (event) => {
    const { value, checked } = event.target;
    setData('selectedPermissions', checked
      ? [...data.selectedPermissions, value]
      : data.selectedPermissions.filter((permission) => permission !== value));
  };

  const handleSubmit = () => {
    post(route('role.store'));
  };

  return (
    <AuthLayout>
      <Head title='Create Role - ' />
      <Card>
        <CardHeader>
          <h4 className='card-title'>Create Role</h4>
          <p className='card-title-desc'>Begin the process of defining a new role with specific permissions and access rights.</p>
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
                        <TData className="bg-light" style={{ fontWeight: 'bold' }}>
                          {group.name}
                        </TData>
                        {group.permissions.map((permission, item) => (
                          <TData key={item}>
                            <div className="row">
                              <label className="col">{permission.name}</label>
                              <div className="col">
                                <FormInput
                                  type="checkbox"
                                  value={permission.name}
                                  onChange={handleCheckboxChange}
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
              {processing ? 'Creating...' : 'Create'}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </AuthLayout>
  );
};

export default Create;
