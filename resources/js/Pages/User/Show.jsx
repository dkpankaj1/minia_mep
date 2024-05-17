import React, { useState } from 'react'
import AuthLayout from '../../Layouts/AuthLayout'
import { Head, Link } from '@inertiajs/react'
import { Card, CardBody } from '../../components/Card'
import Button from '../../components/Button'
import { Tabs, TabItems, TabContent, TabPane } from '../../components/Tabs'
import { CustomTable,THead,THeader,TBody,TRow,TData } from '../../components/Table'
import userIcon from '../../../images/user.svg'

function Show({ user }) {
    console.log(user)

    const [openTab, setOpenTab] = useState(1)

    const toggleTab = (index) => {
        setOpenTab(index)
    }

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



                    <Tabs className='d-flex gap-2 my-4 border-bottom'>
                        <TabItems>
                            <Button className={openTab == 1 && "text-primary"} onClick={() => toggleTab(1)}>About</Button>
                        </TabItems>

                        <TabItems>
                            <Button className={openTab == 2 && "text-primary"} onClick={() => toggleTab(2)}>Login History</Button>
                        </TabItems>
                    </Tabs>



                    <TabContent className='mt-3'>
                        <TabPane index={1} activeIndex={openTab}>
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
                        </TabPane>
                        <TabPane index={2} activeIndex={openTab}>
                            <CustomTable className='table-sm'>
                                <THead>
                                    <TRow>
                                        <THeader>#</THeader>
                                        <THeader>IP Address</THeader>
                                        <THeader>Login Time</THeader>
                                        <THeader>User Agent</THeader>
                                    </TRow>
                                </THead>
                                <TBody>
                                    {
                                        user.login_histories.map((history,index) => {
                                            return <TRow key={history.id}>
                                                <TData>{++index}</TData>
                                                <TData>{history.ip_address}</TData>
                                                <TData>{history.login_time}</TData>
                                                <TData>{history.user_agent}</TData>
                                            </TRow>
                                        })
                                    }
                                </TBody>
                            </CustomTable>
                        </TabPane>
                    </TabContent>




















                </CardBody>
            </Card>
        </AuthLayout>
    )
}

export default Show