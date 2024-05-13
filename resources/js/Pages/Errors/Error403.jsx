import React from 'react'
import { Link, usePage } from '@inertiajs/react'
import forbiddenAccess from '../../../images/forbiddenAccess.svg'
function Error403() {
    const {auth} = usePage().props
    return (
        <div className="my-5 pt-5">
            <div className="container">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="text-center mb-5">
                            {/* <h1 className="display-1 fw-semibold">4<span className="text-primary mx-2">0</span>3</h1> */}
                            <h4 className="text-uppercase">Unauthorize access</h4>
                            <div className="mt-5 text-center">
                                {
                                    auth.user.id
                                    ?<Link className="btn btn-primary" href={route('dashboard')}>Back To Dashboard</Link>
                                    :<Link className="btn btn-primary" href={route('login')}>Back To Login</Link>
                                }                                
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row justify-content-center">
                    <div className="col-md-6 col-xl-4">
                        <div>
                            <img src={forbiddenAccess} alt="forbiddenAccess"  className="img-fluid" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Error403