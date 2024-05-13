import React, { lazy } from 'react'
import GuestLayout from '../../Layouts/GuestLayout'
import { Link, useForm } from '@inertiajs/react'

const InputLabel = lazy(() => import('../../components/InputLabel'))
const InvalidFeedback = lazy(() => import('../../components/InvalidFeedback'))
const Button = lazy(() => import('../../components/Button'))

function ForgetPassword() {

  const { data, setData, post, processing, errors } = useForm({
    email: '',
  });
  const handleSubmit = () => {
    post(route('password.email'));
  }

  return (
    <GuestLayout>
      <div className="auth-content my-auto">
        <div className="text-center">
          <h5 className="mb-0">Reset Password</h5>
          <p className="text-muted mt-2">Reset Password with Minia.</p>
        </div>

        <div className="mt-4">

          <div className="alert alert-success text-center my-4" role="alert">
            Enter your Email and instructions will be sent to you!
          </div>

          <div className="mb-3">
            <InputLabel label={"Email"} htmlFor="email" />
            <input type="email" className="form-control" placeholder="Enter email" value={data.email} onChange={(e) => setData('email', e.target.value)} />
            {errors.email && <InvalidFeedback errorMsg={errors.email} />}
          </div>

          <div className="mb-3">
            <Button className="btn-primary w-100" type="submit" onClick={handleSubmit} disabled={processing}>{processing ? "Reset..." : "Reset"}</Button>
          </div>
        </div>

        <div className="mt-5 text-center">
          <p className="text-muted mb-0">Remember It ?  <Link href={route('login')}
            className="text-primary fw-semibold"> Login now </Link> </p>
        </div>
      </div>
    </GuestLayout>
  )
}

export default ForgetPassword