import React from 'react'
import AuthLayout from '../../Layouts/AuthLayout'
import { Head, useForm } from '@inertiajs/react'
import { Card, CardHeader, CardBody, CardFooter, CardTitle, CardSubtitle } from '../../components/Card'
import InputLabel from '../../components/InputLabel'
import FormInput from '../../components/FormInput'
import Button from '../../components/Button'
import InvalidFeedback from '../../components/InvalidFeedback'

function Profile({ user }) {

  const { data, setData, patch, processing, errors } = useForm({
    name: user.name,
    email: user.email,
  })

  const handleSubmit = () => {
    patch(route('profile.update'))
  }

  return (
    <AuthLayout>
      <Head title='Profile - ' />

      <Card>

        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardSubtitle>Personal Information and Account Settings</CardSubtitle>
        </CardHeader>

        <CardBody>
          <div className="row">
            <div className="col-md-6">

              <div className="mb-3">
                <InputLabel label={"Name"} />
                <FormInput className="form-control" type={"text"}
                  placeholder={"Enter name"} value={data.name}
                  onChange={e => setData('name', e.target.value)}
                />
                {errors.name && <InvalidFeedback errorMsg={errors.name} />}
              </div>

              <div className="mb-3">
                <InputLabel label={"Email"} />
                <FormInput className="form-control" type={"email"}
                  placeholder={"example@email.com"} value={data.email}
                  onChange={e => setData('email', e.target.value)}
                />
                {errors.email && <InvalidFeedback errorMsg={errors.email} />}
              </div>

            </div>
          </div>

        </CardBody>

        <CardFooter>
          <Button className='btn-primary' onClick={handleSubmit} disabled={processing}>{processing ? "Updating..." : "Update Profile"}</Button>
        </CardFooter>

      </Card>

    </AuthLayout>
  )
}

export default Profile