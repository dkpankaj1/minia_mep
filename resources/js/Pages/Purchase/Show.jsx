import React from 'react'

import AuthLayout from '../../Layouts/AuthLayout'
import { usePage } from '@inertiajs/react'

function Show({purchase}) {

    console.log(purchase)
    const { system, company } = usePage().props

    return (
        <AuthLayout>
            <div className="row">
                <div className="col-lg-12">
                    <div className="card">
                        <div className="card-body">
                            <div className="invoice-title">
                                <div className="d-flex align-items-start">
                                    <div className="flex-grow-1">
                                        <div className="mb-4">
                                            <img src={company.logo} alt="" height="24" /><span className="logo-txt">{company.name}</span>
                                        </div>
                                    </div>
                                    <div className="flex-shrink-0">
                                        <div className="mb-4">
                                            <h4 className="float-end font-size-16">Invoice # 12345</h4>
                                        </div>
                                    </div>
                                </div>


                                <p className="mb-1">{company.address} , {company.city}</p>
                                <p className="mb-1">{company.state} , {company.country} ({company.postal_code})</p>
                                <p className="mb-1"><i className="mdi mdi-email align-middle me-1"></i>{company.email}</p>
                                <p><i className="mdi mdi-phone align-middle me-1"></i>{company.phone}</p>
                            </div>
                            <hr className="my-4" />
                            <div className="row">
                                <div className="col-sm-6">
                                    <div>
                                        <h5 className="font-size-15 mb-3">Billed To:</h5>
                                        <h5 className="font-size-14 mb-2">Richard Saul</h5>
                                        <p className="mb-1">1208 Sherwood Circle
                                            Lafayette, LA 70506</p>
                                        <p className="mb-1">RichardSaul@rhyta.com</p>
                                        <p>337-256-9134</p>
                                    </div>
                                </div>
                                <div className="col-sm-6">
                                    <div>
                                        <div>
                                            <h5 className="font-size-15">Order Date:</h5>
                                            <p>February 16, 2020</p>
                                        </div>

                                        <div className="mt-4">
                                            <h5 className="font-size-15">Payment Method:</h5>
                                            <p className="mb-1">Visa ending **** 4242</p>
                                            <p>richards@email.com</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="py-2 mt-3">
                                <h5 className="font-size-15">Order summary</h5>
                            </div>
                            <div className="p-4 border rounded">
                                <div className="table-responsive">
                                    <table className="table table-nowrap align-middle mb-0">
                                        <thead>
                                            <tr>
                                                <th style={{ width: "70px" }}>No.</th>
                                                <th>Item</th>
                                                <th className="text-end" style={{ width: "120px" }}>Price</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <th scope="row">01</th>
                                                <td>
                                                    <h5 className="font-size-15 mb-1">Minia</h5>
                                                    <p className="font-size-13 text-muted mb-0">Bootstrap 5 Admin Dashboard </p>
                                                </td>
                                                <td className="text-end">$499.00</td>
                                            </tr>

                                            <tr>
                                                <th scope="row">02</th>
                                                <td>
                                                    <h5 className="font-size-15 mb-1">Skote</h5>
                                                    <p className="font-size-13 text-muted mb-0">Bootstrap 5 Admin Dashboard </p>
                                                </td>
                                                <td className="text-end">$499.00</td>
                                            </tr>

                                            <tr>
                                                <th scope="row" colSpan="2" className="text-end">Sub Total</th>
                                                <td className="text-end">$998.00</td>
                                            </tr>
                                            <tr>
                                                <th scope="row" colSpan="2" className="border-0 text-end">
                                                    Tax</th>
                                                <td className="border-0 text-end">$12.00</td>
                                            </tr>
                                            <tr>
                                                <th scope="row" colSpan="2" className="border-0 text-end">Total</th>
                                                <td className="border-0 text-end"><h4 className="m-0">$1010.00</h4></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="d-print-none mt-3">
                                <div className="float-end">
                                    <a href="" className="btn btn-success waves-effect waves-light me-1"><i className="fa fa-print"></i></a>
                                    <a href="#" className="btn btn-primary w-md waves-effect waves-light">Send</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthLayout>
    )
}

export default Show