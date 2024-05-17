import React from 'react'
import GuestLayout from '../../Layouts/GuestLayout'
import { Head, Link, useForm } from '@inertiajs/react'
import PasswordInput from '../../components/PasswordInput'
import InputLabel from '../../components/InputLabel'
import InvalidFeedback from '../../components/InvalidFeedback'
import Button from '../../components/Button'


function Register() {
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
      <Head title='Register User - ' />
      <div className="auth-content my-auto">
        <div className="text-center">
          <h5 className="mb-0">Register Account</h5>
          <p className="text-muted mt-2">Get your free Minia account now.</p>
        </div>
        <div className="mt-4 pt-2">

          <div className="mb-3">
            <InputLabel label={"Name"} htmlFor="name" />
            <input type="text" className="form-control" placeholder="Enter Name" value={data.name} onChange={e => setData('name', e.target.value)} />
            {errors.name && <InvalidFeedback errorMsg={errors.name} />}
          </div>


          <div className="mb-3">
            <InputLabel label={"Email"} htmlFor="email" />
            <input type="email" className="form-control" placeholder="Example@email.com" value={data.email} onChange={e => setData('email', e.target.value)} />
            {errors.email && <InvalidFeedback errorMsg={errors.email} />}
          </div>


          <div className="mb-3">
            <InputLabel label={"Password"} htmlFor="password" />
            <PasswordInput
              className="form-control" placeholder="Enter password" value={data.password} 
              onChange={e => setData('password', e.target.value)}
            />
            {errors.password && <InvalidFeedback errorMsg={errors.password} />}
          </div>


          <div className="mb-3">
            <InputLabel label={"Confirm Password"} htmlFor="password_confirmation" />
            <PasswordInput
              className="form-control" placeholder="Confirm password" value={data.password_confirmation}
              onChange={e => setData('password_confirmation', e.target.value)}
            />
            {errors.password_confirmation && <InvalidFeedback errorMsg={errors.password_confirmation} />}
          </div>

          <div className="mb-3">
            <Button className="btn-primary w-100" type="submit" disabled={processing} onClick={handleLogin}>
              {processing ? "Register..." : "Register"}
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