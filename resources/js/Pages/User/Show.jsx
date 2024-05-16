import React from 'react'
import AuthLayout from '../../Layouts/AuthLayout'
import { Head } from '@inertiajs/react'
import { Card, CardBody } from '../../components/Card'
import userIcon from '../../../images/user.svg'

function Show({ user }) {
    return (
        <AuthLayout>
            <Head title='Show User - ' />
            <Card className="mt-3">
                <CardBody>
                    <div className="row">
                        <div className="col-sm order-2 order-sm-1">
                            <div className="d-flex align-items-start mt-3 mt-sm-0">
                                <div className="flex-shrink-0">
                                    <div className="avatar-xl me-3">
                                        <img src={user.avatar || userIcon} alt="" className="img-fluid rounded-circle d-block" />
                                    </div>
                                </div>
                                <div className="flex-grow-1">
                                    <div>
                                        <h5 className="font-size-16 mb-1">{user.name}</h5>
                                        <p className="text-muted font-size-13">{user.roles[0]?.name || "No role"}</p>
                                        <div className="d-flex flex-wrap align-items-start gap-2 gap-lg-3 text-muted font-size-13">
                                            <div><i className="mdi mdi-circle-medium me-1 text-success align-middle"></i>{user.email}</div>
                                            <div><i className="mdi mdi-circle-medium me-1 text-success align-middle"></i>{user.phone}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <hr />
                    <div className='mt-3'>
                        <div className="pb-3">
                            <div className="row">
                                <div className="col-xl-2">
                                    <div>
                                        <h5 className="font-size-15">Name :</h5>
                                    </div>
                                </div>
                                <div className="col-xl">
                                    <div className="text-muted">
                                        {user.name}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="pb-3">
                            <div className="row">
                                <div className="col-xl-2">
                                    <div>
                                        <h5 className="font-size-15">Email :</h5>
                                    </div>
                                </div>
                                <div className="col-xl">
                                    <div className="text-muted">
                                        {user.email}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="pb-3">
                            <div className="row">
                                <div className="col-xl-2">
                                    <div>
                                        <h5 className="font-size-15">Phone :</h5>
                                    </div>
                                </div>
                                <div className="col-xl">
                                    <div className="text-muted">
                                        {user.phone}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="pb-3">
                            <div className="row">
                                <div className="col-xl-2">
                                    <div>
                                        <h5 className="font-size-15">Address :</h5>
                                    </div>
                                </div>
                                <div className="col-xl">
                                    <div className="text-muted">
                                        {user.address}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="pb-3">
                            <div className="row">
                                <div className="col-xl-2">
                                    <div>
                                        <h5 className="font-size-15">City :</h5>
                                    </div>
                                </div>
                                <div className="col-xl">
                                    <div className="text-muted">
                                        {user.city}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="pb-3">
                            <div className="row">
                                <div className="col-xl-2">
                                    <div>
                                        <h5 className="font-size-15">State :</h5>
                                    </div>
                                </div>
                                <div className="col-xl">
                                    <div className="text-muted">
                                        {user.state}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="pb-3">
                            <div className="row">
                                <div className="col-xl-2">
                                    <div>
                                        <h5 className="font-size-15">Postal Code :</h5>
                                    </div>
                                </div>
                                <div className="col-xl">
                                    <div className="text-muted">
                                        {user.postal_code}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="pb-3">
                            <div className="row">
                                <div className="col-xl-2">
                                    <div>
                                        <h5 className="font-size-15">Country :</h5>
                                    </div>
                                </div>
                                <div className="col-xl">
                                    <div className="text-muted">
                                        {user.country}
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                </CardBody>
            </Card>
        </AuthLayout>
    )
}

export default Show