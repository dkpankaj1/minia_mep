import React from 'react'
import { Head, useForm } from '@inertiajs/react';
import AuthLayout from '../../Layouts/AuthLayout'
import { Card, CardBody, CardHeader, CardFooter } from '../../components/Card';
import Button from '../../components/Button';
import InputLabel from '../../components/InputLabel';
import FormInput from '../../components/FormInput';
import InvalidFeedback from '../../components/InvalidFeedback';
import FormSelect from '../../components/FormSelect';
import ValidFeedback from '../../components/ValidFeedback';

function Edit({ user, roles }) {

  const { data, setData, put, errors, processing } = useForm({
    name: user.name,
    email: user.email,
    phone: user.phone,
    address: user.address || "",
    city: user.city || "",
    state: user.state || "",
    postal_code: user.postal_code || "",
    country: user.country || "",
    user_role: user.roles[0].name || "",
    is_active: user.is_active,
    password_reset: ""
  })
  const handleSubmit = () => {
    // console.log(data);
    put(route('user.update', user))
  }
  return (
    <AuthLayout>
      <Head title='Create User' />

      <Card>
        <CardHeader>
          <h4 className='card-title'>Edit User</h4>
          <p className='card-title-desc'>Modify the details of the user account. Ensure all fields are correctly filled out before saving changes.</p>
        </CardHeader>


        <CardBody>
          <div className="row">
            {/* name input */}
            <div className="col-md-4">
              <div className="mb-3">
                <InputLabel label={"Name"} />
                <FormInput
                  type="text"
                  className="form-control"
                  placeholder="Enter Name"
                  value={data.name}
                  onChange={(e) => setData('name', e.target.value)}
                />
                {errors.name && <InvalidFeedback errorMsg={errors.name} />}
              </div>
            </div>

            {/* email input */}
            <div className="col-md-4">
              <div className="mb-3">
                <InputLabel label={"Email"} />
                <FormInput
                  type="text"
                  className="form-control"
                  placeholder="example@email.com"
                  value={data.email}
                  onChange={(e) => setData('email', e.target.value)}
                />
                {errors.email && <InvalidFeedback errorMsg={errors.email} />}
              </div>
            </div>

            {/* phone input */}
            <div className="col-md-4">
              <div className="mb-3">
                <InputLabel label={"Phone"} />
                <FormInput
                  type="text"
                  className="form-control"
                  placeholder="Enter Phone"
                  value={data.phone}
                  onChange={(e) => setData('phone', e.target.value)}
                />
                {errors.phone && <InvalidFeedback errorMsg={errors.phone} />}
              </div>
            </div>

            {/* address input */}
            <div className="col-md-4">
              <div className="mb-3">
                <InputLabel label={"Address"} />
                <FormInput
                  type="text"
                  className="form-control"
                  placeholder="Enter Address"
                  value={data.address}
                  onChange={(e) => setData('address', e.target.value)}
                />
                {errors.address && <InvalidFeedback errorMsg={errors.address} />}
              </div>
            </div>

            {/* city input */}
            <div className="col-md-4">
              <div className="mb-3">
                <InputLabel label={"City"} />
                <FormInput
                  type="text"
                  className="form-control"
                  placeholder="Enter Address"
                  value={data.city}
                  onChange={(e) => setData('city', e.target.value)}
                />
                {errors.city && <InvalidFeedback errorMsg={errors.city} />}
              </div>
            </div>

            {/* state input */}
            <div className="col-md-4">
              <div className="mb-3">
                <InputLabel label={"State"} />
                <FormInput
                  type="text"
                  className="form-control"
                  placeholder="Enter Address"
                  value={data.state}
                  onChange={(e) => setData('state', e.target.value)}
                />
                {errors.state && <InvalidFeedback errorMsg={errors.state} />}
              </div>
            </div>
            {/* postal code input */}
            <div className="col-md-4">
              <div className="mb-3">
                <InputLabel label={"Postal Code"} />
                <FormInput
                  type="text"
                  className="form-control"
                  placeholder="Enter Address"
                  value={data.postal_code}
                  onChange={(e) => setData('postal_code', e.target.value)}
                />
                {errors.postal_code && <InvalidFeedback errorMsg={errors.postal_code} />}
              </div>
            </div>
            {/* country input */}
            <div className="col-md-4">
              <div className="mb-3">
                <InputLabel label={"Country"} />
                <FormSelect
                  value={data.country}
                  onChange={(e) => setData('country', e.target.value)}
                >
                  <option value="australia">Australia</option>
                  <option value="brazil">Brazil</option>
                  <option value="canada">Canada</option>
                  <option value="china">China</option>
                  <option value="france">France</option>
                  <option value="germany">Germany</option>
                  <option value="india">India</option>
                  <option value="japan">Japan</option>
                  <option value="south_africa">South Africa</option>
                  <option value="usa">USA</option>
                </FormSelect>
                {errors.country && <InvalidFeedback errorMsg={errors.country} />}
              </div>
            </div>

            <div className="w-100"></div>

            {/* role input */}
            <div className="col-md-6">
              <div className="mb-3">
                <InputLabel label={"Role"} />
                <FormSelect
                  value={data.user_role}
                  onChange={(e) => setData('user_role', e.target.value)}
                >
                  {roles.map((role) => <option key={role.id} value={role.name}>{role.name}</option>)}

                </FormSelect>
                {errors.user_role && <InvalidFeedback errorMsg={errors.user_role} />}
              </div>
            </div>

            {/* status input */}
            <div className="col-md-6">
              <div className="mb-3">
                <InputLabel label={"Is Active"} />
                <FormSelect
                  value={data.is_active}
                  onChange={(e) => setData('is_active', e.target.value)}
                >
                  <option value="1">Active</option>
                  <option value="0">InActive</option>

                </FormSelect>
                {errors.is_active && <InvalidFeedback errorMsg={errors.is_active} />}
              </div>
            </div>

            {/* password reset input */}
            <div className="col-12">
              <div className="mb-3">
                <div className="form-check">
                  <FormInput
                    type="checkbox"
                    className="form-check-input"
                    placeholder="Enter Address"
                    checked={data.password_reset}
                    onChange={(e) => setData('password_reset', event.target.checked)}
                  />
                  <InputLabel label={"Reset Password"} />
                </div>
              </div>
            </div>

            {/* notes */}
            <div className="col-12 mt-3">
              <span>Notes:</span>
              <ValidFeedback errorMsg="The default password is {password}." />
              <ValidFeedback errorMsg="If password will be change then login information will be sent to the registered email address." />
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
              {processing ? 'Updating...' : 'Update'}
            </Button>
          </div>
        </CardFooter>
      </Card>

    </AuthLayout>
  )
}

export default Edit