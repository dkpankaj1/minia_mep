import React from 'react'
import AuthLayout from '../../Layouts/AuthLayout'
import { Head, useForm } from '@inertiajs/react'
import { Card, CardHeader, CardBody, CardFooter, CardTitle, CardSubtitle } from '../../components/Card'
import InputLabel from '../../components/InputLabel'
import PasswordInput from '../../components/PasswordInput'
import Button from '../../components/Button'
import InvalidFeedback from '../../components/InvalidFeedback'
import ValidFeedback from '../../components/ValidFeedback'

function Password() {
  const { data, setData, errors, put, reset, processing } = useForm({
    current_password: '',
    password: '',
    password_confirmation: '',
  })

  const handleSubmit = () => {
    put(route('password.update'), {
      onSuccess: () => reset()
    })
  }

  return (
    <AuthLayout>
      <Head title='Change Password - ' />

      <Card>

        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardSubtitle>Update Your Account Security</CardSubtitle>
        </CardHeader>

        <CardBody>

          <div className="row">
            <div className="col-md-6">

              <div className="mb-3">
                <InputLabel label={"Current Password"} />
                <PasswordInput className="form-control"
                  placeholder={"Enter current password"} value={data.current_password}
                  onChange={e => setData('current_password', e.target.value)} />
                {errors.current_password && <InvalidFeedback errorMsg={errors.current_password} />}
              </div>

              <div className="mb-3">
                <InputLabel label={"New Password"} />
                <PasswordInput className="form-control"
                  placeholder={"Enter password"} value={data.password}
                  onChange={e => setData('password', e.target.value)} />
                {errors.password && <InvalidFeedback errorMsg={errors.password} />}
              </div>

              <div className="mb-3">
                <InputLabel label={"Confirm Password"} />
                <PasswordInput className="form-control"
                  placeholder={"Confirm Password"} value={data.password_confirmation}
                  onChange={e => setData('password_confirmation', e.target.value)} />
                {errors.password_confirmation && <InvalidFeedback errorMsg={errors.password_confirmation} />}
              </div>

            </div>

            {/* notes */}
            <div className="col-12 mt-3">
              <span>Notes:</span>
              <ValidFeedback errorMsg="Length & Variety: Use at least 8 characters, including uppercase, lowercase, numbers, and special characters" />
              <ValidFeedback errorMsg="Avoid Predictability: Don’t use common words, personal information, or repeated characters." />
              <ValidFeedback errorMsg="Unique & Updated: Use unique passwords for different accounts and update them every 6 months." />
            </div>

          </div>

        </CardBody>

        <CardFooter>
          <Button className='btn-primary' onClick={handleSubmit} disabled={processing}>{processing ? "Changing..." : "Change Password"}</Button>
        </CardFooter>

      </Card>

    </AuthLayout>
  )
}

export default Password