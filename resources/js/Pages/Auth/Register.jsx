import React, { lazy, useState } from 'react'
import GuestLayout from '../../Layouts/GuestLayout'
import { Head, Link, useForm } from '@inertiajs/react'

const InputLabel = lazy(() => import('../../components/InputLabel'))
const InvalidFeedback = lazy(() => import('../../components/InvalidFeedback'))
const Button = lazy(() => import('../../components/Button'))

function Register() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const { data, setData, post, processing, errors } = useForm({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });

  const handleLogin = () => {
    post('register')
  }

  return (
    <GuestLayout>
      <Head title='register user - '/>
      <div className="auth-content my-auto">
        <div className="text-center">
          <h5 className="mb-0">Register Account</h5>
          <p className="text-muted mt-2">Get your free Minia account now.</p>
        </div>
        <div className="mt-4 pt-2">

          <div className="mb-3">
            <InputLabel label={"Name"} htmlFor="name" />
            <input type="text" className="form-control" placeholder="Enter Name" value={data.name} onChange={e => setData('name',e.target.value)} />
            {errors.name && <InvalidFeedback errorMsg={errors.name} />}
          </div>


          <div className="mb-3">
            <InputLabel label={"Email"} htmlFor="email" />
            <input type="email" className="form-control" placeholder="Example@email.com" value={data.email} onChange={e => setData('email',e.target.value)} />
            {errors.email && <InvalidFeedback errorMsg={errors.email} />}
          </div>


          <div className="mb-3">
            <InputLabel label={"Password"} htmlFor="password" />
            <div className="input-group auth-pass-inputgroup">
              <input type={showPassword ? "text" : "password"} className="form-control" placeholder="Enter password" value={data.password} onChange={e => setData('password',e.target.value)} />
              <button className="btn btn-light shadow-none ms-0" type="button" onClick={() => setShowPassword(!showPassword)}>
                <i className={showPassword ? "mdi mdi-eye-off" : "mdi mdi-eye-outline"}></i>
              </button>
            </div>
            {errors.password && <InvalidFeedback errorMsg={errors.password} />}
          </div>


          <div className="mb-3">
            <InputLabel label={"Confirm Password"} htmlFor="password_confirmation" />
            <div className="input-group auth-pass-inputgroup">
              <input type={showConfirmPassword ? "text" : "password"} className="form-control" placeholder="Confirm password"  value={data.password_confirmation} onChange={e => setData('password_confirmation',e.target.value)} />
              <button className="btn btn-light shadow-none ms-0" type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                <i className={showConfirmPassword ? "mdi mdi-eye-off" : "mdi mdi-eye-outline"}></i>
              </button>
            </div>
            {errors.password_confirmation && <InvalidFeedback errorMsg={errors.password_confirmation} />}
          </div>

          <div className="mb-3">
            <Button className="btn-primary w-100" type="submit" disabled={processing} onClick={handleLogin}>
              {processing ? "Register..." :"Register"}
            </Button>
          </div>
        </div>

        <div className="mt-5 text-center">
          <p className="text-muted mb-0">Already have an account ? <Link href={route('login')}
            className="text-primary fw-semibold"> Login now </Link> </p>
        </div>
      </div>
    </GuestLayout>
  )
}

export default Register