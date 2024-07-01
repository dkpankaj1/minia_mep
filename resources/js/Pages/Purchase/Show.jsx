import React from 'react';
import AuthLayout from '../../Layouts/AuthLayout';
import { usePage } from '@inertiajs/react';
import AuthorizeLink from '../../components/AuthorizeLink';

function Show({ purchase }) {
    const { system, company } = usePage().props;
    const purchaseData = purchase.data;

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
                                            <img src={company.logo} alt={company.name} height="24" />
                                            <span className="logo-txt">{company.name}</span>
                                        </div>
                                    </div>
                                    <div className="flex-shrink-0">
                                        <div className="mb-4">
                                            <h4 className="float-end font-size-16">Receipt No. # {purchaseData.id}</h4>
                                        </div>
                                        <div className="mb-4">
                                            <h4 className="float-end font-size-16">Reference No. # {purchaseData.reference}</h4>
                                        </div>
                                    </div>
                                </div>
                                <p className="mb-1">{company.address}, {company.city}</p>
                                <p className="mb-1">{company.state}, {company.country} ({company.postal_code})</p>
                                <p className="mb-1"><i className="mdi mdi-email align-middle me-1"></i>{company.email}</p>
                                <p><i className="mdi mdi-phone align-middle me-1"></i>{company.phone}</p>
                            </div>

                            <hr className="my-4" />

                            <div className="row">
                                <div className="col-sm-6">
                                    <h5 className="font-size-15 mb-3">Billed From:</h5>
                                    <h5 className="font-size-14 mb-2">{purchaseData.supplier.name}</h5>
                                    <p className="mb-1">{purchaseData.supplier.address}, {purchaseData.supplier.city}</p>
                                    <p className="mb-1">{purchaseData.supplier.state}, {purchaseData.supplier.country} ({purchaseData.supplier.postal_code})</p>
                                    <p className="mb-1">{purchaseData.supplier.phone}, {purchaseData.supplier.email}</p>
                                </div>
                                <div className="col-sm-6">
                                    <h5 className="font-size-15">Order Date: {purchaseData.date}</h5>
                                    <h5 className="font-size-15 mt-3">Order Status: {purchaseData.order_status.toUpperCase()}</h5>
                                    <h5 className="font-size-15 mt-3">Warehouse: {purchaseData.warehouse.name}</h5>
                                </div>
                            </div>

                            <div className="py-2 mt-3">
                                <h5 className="font-size-15">Order Summary</h5>
                            </div>

                            <div className="p-4 border rounded">
                                <div className="table-responsive">
                                    <table className="table table-nowrap align-middle mb-0">
                                        <thead>
                                            <tr>
                                                <th style={{ width: "70px" }}>No.</th>
                                                <th>Item</th>
                                                <th>Unit Price</th>
                                                <th>Unit Discount</th>
                                                <th>Unit Tax (%)</th>
                                                <th>Quantity</th>
                                                <th className="text-end" style={{ width: "120px" }}>Price</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {purchaseData.purchase_item.map((item, index) => (
                                                <tr key={index}>
                                                    <th scope="row">{index + 1}</th>
                                                    <td>
                                                        <h5 className="font-size-15 mb-1">{item.name}</h5>
                                                        <p className="font-size-13 text-muted mb-0">{item.code}</p>
                                                    </td>
                                                    <td>{system.currency.symbol}&nbsp;{item.net_unit_cost.toFixed(2)}</td>
                                                    <td>{item.discount.toFixed(2)} {item.discount_method === 0 ? system.currency.symbol : "%"}</td>
                                                    <td>{item.tax_rate.toFixed(2)} {item.tax_method === 0 ? "(%) inclusive" : "(%) exclusive"}</td>
                                                    <td>{item.quantity} {item.purchase_unit.short_name}</td>
                                                    <td className="text-end">{system.currency.symbol}&nbsp;{item.sub_total.toFixed(2)}</td>
                                                </tr>
                                            ))}
                                            <tr>
                                                <td colSpan={5}></td>
                                                <td colSpan={2}>
                                                    <table className='table table-sm table-striped'>
                                                        <tbody>
                                                            <tr>
                                                                <td>Total:</td>
                                                                <td>{system.currency.symbol} {purchaseData.sub_total.toFixed(2)}</td>
                                                            </tr>
                                                            <tr>
                                                                <td>Discount:</td>
                                                                <td>{system.currency.symbol} {(purchaseData.discount_method === 0 ? purchaseData.discount : purchaseData.sub_total * (purchaseData.discount / 100)).toFixed(2)}</td>
                                                            </tr>
                                                            <tr>
                                                                <td>Order Tax ({purchaseData.order_tax}%):</td>
                                                                <td>{system.currency.symbol} {purchaseData.total_tax.toFixed(2)}</td>
                                                            </tr>
                                                            <tr>
                                                                <td>Shipping Cost + Other Cost:</td>
                                                                <td>{system.currency.symbol} {(purchaseData.shipping_cost + purchaseData.other_cost).toFixed(2)}</td>
                                                            </tr>
                                                            <tr>
                                                                <td><b>Grand Total:</b></td>
                                                                <td><b>{system.currency.symbol} {purchaseData.grand_total.toFixed(2)}</b></td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div className="d-print-none mt-3">
                                <div className="float-end">
                                    <a href={route('purchase.print', purchaseData)} target='_blank' className="btn btn-success waves-effect waves-light me-1">
                                        <i className="fa fa-print"></i>
                                    </a>
                                    <AuthorizeLink ability="purchase.edit" href={route('purchase.edit', purchaseData)} className="btn btn-primary w-md">
                                        Edit
                                    </AuthorizeLink>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthLayout>
    );
}

export default Show;
