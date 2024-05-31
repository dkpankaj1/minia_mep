import React from 'react'
import { Head, useForm } from '@inertiajs/react'

import AuthLayout from '../../../Layouts/AuthLayout'
import { Card, CardBody, CardHeader } from '../../../components/Card';
import InputLabel from '../../../components/InputLabel';
import FormInput from '../../../components/FormInput';
import FormSelect from '../../../components/FormSelect';

function Show({ customer, customerGroup }) {

  const { data, setData } = useForm({
    name: customer.name,
    email: customer.email,
    phone: customer.phone,
    whatsapp: customer.whatsapp,
    address: customer.address,
    city: customer.city,
    state: customer.state,
    postal_code: customer.postal_code,
    country: customer.country,
    customer_group_id: customer.customer_group_id,
    is_active: customer.is_active,
  })

  return (
    <AuthLayout>
      <Head title='Customer | Show - ' />

      <Card>
        <CardHeader>
          <h4 className='card-title'>Show Customer</h4>
          <p className='card-title-desc'>Show detail of customer.</p>
        </CardHeader>

        <CardBody>
          <div className="row">

            {/* customer group input */}
            <div className="col-md-4">
              <div className="mb-3">
                <InputLabel label={"Customer Group"} />
                <FormSelect
                  defaultValue={data.customer_group_id}
                  onChange={(e) => setData('customer_group_id', e.target.value)}
                >
                  {customerGroup.map((group) => <option key={group.id} value={group.id}>{group.name}</option>)}
                </FormSelect>
               
              </div>
            </div>

            <div className="w-100"></div>


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
              </div>
            </div>

            {/* whatsapp phone input */}
            <div className="col-md-4">
              <div className="mb-3">
                <InputLabel label={"Whatsapp"} />
                <FormInput
                  type="text"
                  className="form-control"
                  placeholder="Enter WhatsappPhone"
                  value={data.whatsapp}
                  onChange={(e) => setData('whatsapp', e.target.value)}
                />
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
              </div>
            </div>

            {/* city input */}
            <div className="col-md-4">
              <div className="mb-3">
                <InputLabel label={"City"} />
                <FormInput
                  type="text"
                  className="form-control"
                  placeholder="Enter City"
                  value={data.city}
                  onChange={(e) => setData('city', e.target.value)}
                />
              </div>
            </div>

            {/* state input */}
            <div className="col-md-4">
              <div className="mb-3">
                <InputLabel label={"State"} />
                <FormInput
                  type="text"
                  className="form-control"
                  placeholder="Enter State"
                  value={data.state}
                  onChange={(e) => setData('state', e.target.value)}
                />
              </div>
            </div>

            {/* postal code input */}
            <div className="col-md-4">
              <div className="mb-3">
                <InputLabel label={"Postal Code"} />
                <FormInput
                  type="text"
                  className="form-control"
                  placeholder="Enter Postal Code"
                  value={data.postal_code}
                  onChange={(e) => setData('postal_code', e.target.value)}
                />
              </div>
            </div>

            {/* country input */}
            <div className="col-md-4">
              <div className="mb-3">
                <InputLabel label={"Country"} />
                <FormSelect
                  defaultValue={data.country}
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
              </div>
            </div>

            <div className="w-100"></div>

            {/* status input */}
            <div className="col-md-4">
              <div className="mb-3">
                <InputLabel label={"Is Active"} />
                <FormSelect
                  defaultValue={data.is_active}
                  onChange={(e) => setData('is_active', e.target.value)}
                >
                  <option value="1">Active</option>
                  <option value="0">InActive</option>
                </FormSelect>
              </div>
            </div>

          </div>

        </CardBody>

      </Card>

    </AuthLayout >
  )
}

export default Show