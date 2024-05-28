import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';

import AuthLayout from '../../Layouts/AuthLayout'
import { Card, CardBody, CardHeader, CardFooter } from '../../components/Card';
import Button from '../../components/Button';
import InputLabel from '../../components/InputLabel';
import FormInput from '../../components/FormInput';
import InvalidFeedback from '../../components/InvalidFeedback';
import FormSelect from '../../components/FormSelect';
import IsAuthorize from '../../components/IsAuthorize';


const CompanySetting = ({ companySetting }) => {

  const [imagePreview, setImagePreview] = useState(companySetting.logo)

  const { data, setData, post, errors, processing } = useForm({
    _method: "PUT",
    name: companySetting.name,
    short_name: companySetting.short_name,
    phone: companySetting.phone,
    email: companySetting.email,
    address: companySetting.address,
    city: companySetting.city,
    state: companySetting.state,
    country: companySetting.country,
    postal_code: companySetting.postal_code,
    logo: undefined,
  });


  const handleImageInput = (e) => {
    setData('logo', e.target.files[0])
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(e.target.files[0]);
  }



  const handleSubmit = () => {
    // console.log(data)
    post(route('company.update', companySetting.id))
  }


  return (
    <>

      <AuthLayout>
        <Head title='Setting | Company - ' />

        <Card>
          <CardHeader>
            <h4 className='card-title'>Company</h4>
            <p className='card-title-desc'>View and manage company information</p>
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

              {/* short name input */}
              <div className="col-md-4">
                <div className="mb-3">
                  <InputLabel label={"Short Name"} />
                  <FormInput
                    type="text"
                    className="form-control"
                    placeholder="Enter Name"
                    value={data.short_name}
                    onChange={(e) => setData('short_name', e.target.value)}
                  />
                  {errors.short_name && <InvalidFeedback errorMsg={errors.short_name} />}
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
            </div>

            <div className="w-100"></div>

            {/* logo input */}
            <div className="col-md-4">
              <div className="mb-3">
                <img
                  src={imagePreview}
                  alt=""
                  className='border p-3'
                  style={{ width: "200px" }}
                />
                <FormInput className="form-control mt-3" type={"file"}
                  defaultValue={data.logo} onChange={e => handleImageInput(e)}
                />
                {errors.logo && <InvalidFeedback errorMsg={errors.logo} />}
              </div>
            </div>

          </CardBody>

          <IsAuthorize ability={'company.edit'}>
            <CardFooter>
              <div className="d-flex justify-content-start">
                <Button
                  type="submit"
                  className="btn btn-primary w-md"
                  onClick={handleSubmit}
                  disabled={processing}
                >
                  {processing ? 'Saving...' : 'Save'}
                </Button>
              </div>
            </CardFooter>
          </IsAuthorize>
        </Card>

      </AuthLayout>

    </>
  );
}

export default CompanySetting;