import React, { useState } from 'react'
import AuthLayout from '../../Layouts/AuthLayout'
import { Head, useForm } from '@inertiajs/react'
import { Card, CardHeader, CardBody, CardFooter, CardTitle, CardSubtitle } from '../../components/Card'
import InputLabel from '../../components/InputLabel'
import FormInput from '../../components/FormInput'
import Button from '../../components/Button'
import InvalidFeedback from '../../components/InvalidFeedback'

function Profile({ user }) {

  const [imagePreview, setImagePreview] = useState(user.avatar)

  const { data, setData, post, reset, processing, errors } = useForm({
    _method: "patch",
    name: user.name,
    email: user.email,
    avatar: undefined
  })

  const handleSubmit = () => {
    post(route('profile.update'), {
      onFinish: () => {
        reset(['avatar'])
      }
    })
  }

  const handleImageInput = (e) => {
    setData('avatar', e.target.files[0])
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(e.target.files[0]);
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
                <img
                  src={imagePreview}
                  alt=""
                  style={{height:"200px",width:"200px"}}
                />
                <FormInput className="form-control mt-3" type={"file"}
                  defaultValue={data.avatar} onChange={e => handleImageInput(e)}
                />
                {errors.avatar && <InvalidFeedback errorMsg={errors.avatar} />}
              </div>


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