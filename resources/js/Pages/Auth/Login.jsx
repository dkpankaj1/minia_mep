import React from 'react'
import GuestLayout from '../../Layouts/GuestLayout'
import { Head, Link, useForm } from '@inertiajs/react'

import InputLabel from '../../components/InputLabel'
import InvalidFeedback from '../../components/InvalidFeedback'
import Button from '../../components/Button'
import PasswordInput from '../../components/PasswordInput'

function Login() {

    const { data, setData, post, errors, processing } = useForm({
        email: "",
        password: "",
        remember: false,
    })

    const handleLogin = () => {
        post('login')
    }

    return (
        <GuestLayout>
            <Head title='Login -    ' />
            <div className="auth-content my-auto">
                <div className="text-center">
                    <h5 className="mb-0">Welcome Back !</h5>
                    <p className="text-muted mt-2">Sign in to continue to Minia.</p>
                </div>
                <div className="mt-4 pt-2">

                    <div className="mb-3">
                        <InputLabel label={"Username"} htmlFor="username" />
                        <input type="text" className="form-control"
                            placeholder="Enter username"
                            value={data.email} onChange={e => setData('email', e.target.value)}
                        />
                        {errors.email && <InvalidFeedback errorMsg={errors.email} />}
                    </div>

                    <div className="mb-3">
                        <div className="d-flex align-items-start">
                            <div className="flex-grow-1">
                                <InputLabel label={"Password"} htmlFor="username" />
                            </div>
                            <div className="flex-shrink-0">
                                <div className="">
                                    <Link href={route('password.request')} className="text-muted">Forgot password?</Link>
                                </div>
                            </div>
                        </div>

                        <PasswordInput
                            className="form-control" placeholder="Enter password"
                            value={data.password} onChange={e => setData('password', e.target.value)}
                        />
                        {errors.password && <InvalidFeedback errorMsg={errors.password} />}
                    </div>
                    <div className="row mb-4">
                        <div className="col">
                            <div className="form-check">
                                <input
                                    className="form-check-input"
                                    type="checkbox" checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                />
                                <InputLabel label={"Remember me"} className="form-check-label" htmlFor="remember-check" />
                            </div>
                        </div>

                    </div>
                    <div className="mb-3">
                        <Button className="btn-primary w-100" type="submit"
                            onClick={handleLogin} disabled={processing}
                        >
                            {processing ? "Log In.." : "Log In"}
                        </Button>
                    </div>
                </div>

                <div className="mt-5 text-center">
                    <p className="text-muted mb-0">Don't have an account ? <Link href={route('register')}
                        className="text-primary fw-semibold"> SignUp now </Link> </p>
                </div>
            </div>
        </GuestLayout>
    )
}

export default Login