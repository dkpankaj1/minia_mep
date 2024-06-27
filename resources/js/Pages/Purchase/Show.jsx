import React from 'react'

import AuthLayout from '../../Layouts/AuthLayout'
import { usePage } from '@inertiajs/react'

function Show({ purchase }) {

    purchase = purchase.data
    const { system, company } = usePage().props

    console.log(purchase)

    const calculateSubTotal = () => {
        return purchase.purchase_item.reduce((total, item) => {
            return total + calculateSubTotalCartItem(item);
        }, 0);
    }
    const calculateTotalDiscount = (subtotal) => {
        if (purchase.discount_method == 0) {
            return purchase.discount;
        } else {
            return (subtotal * (purchase.discount / 100));
        }
    };

    const calculateGrandTotal = () => {
        const subTotal = calculateSubTotal(purchase)
        return (subTotal + (purchase.order_tax / 100) - calculateTotalDiscount(subTotal) + parseFloat(purchase.shipping_cost) + parseFloat(purchase.other_cost));
    }

    const calculateSubTotalCartItem = (item) => {
        const quantity = parseFloat(item.quantity) || 0;
        const netUnitCost = parseFloat(item.net_unit_cost) || 0;
        const discount = parseFloat(item.discount) || 0;
        const taxRate = parseFloat(item.tax_rate) || 0;
        const itemUnit = item.purchase_unit;
        const unitOperator = itemUnit.operator;
        const operatorValue = parseFloat(itemUnit.operator_value) || 1;

        const calculateDiscountedCost = (cost, discount, method) =>
            method === "0" ? cost - discount : cost - (cost * discount / 100);

        const calculateTaxedCost = (cost, taxRate, method) =>
            method === "0" ? cost : cost + (cost * taxRate / 100);

        const netCostAfterDiscount = calculateDiscountedCost(netUnitCost, discount, item.discount_method);
        const netCostAfterTax = calculateTaxedCost(netCostAfterDiscount, taxRate, item.tax_method);

        return unitOperator === "/"
            ? (quantity * netCostAfterTax / operatorValue)
            : quantity * netCostAfterTax;
    };


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
                                            <h4 className="float-end font-size-16">Reference No # {purchase.reference}</h4>
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
                                        <h5 className="font-size-14 mb-2">{purchase.supplier.name}</h5>
                                        <p className="mb-1">{purchase.supplier.address}, {purchase.supplier.city}</p>
                                        <p className="mb-1">{purchase.supplier.state}, {purchase.supplier.country} ({purchase.supplier.postal_code})</p>
                                        <p className="mb-1">{purchase.supplier.phone}, {purchase.supplier.email}</p>
                                    </div>
                                </div>
                                <div className="col-sm-6">
                                    <div>
                                        <div>
                                            <h5 className="font-size-15">Order Date:</h5>
                                            <p>{purchase.date}</p>
                                        </div>

                                        <div className="mt-4">
                                            <h5 className="font-size-15">Order Status:</h5>
                                            <p className="mb-1">{purchase.order_status.toUpperCase()}</p>
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
                                                <th>Unit Price</th>
                                                <th>Unit Discount</th>
                                                <th>Unit Tax (%)</th>
                                                <th>Quantity</th>
                                                <th className="text-end" style={{ width: "120px" }}>Price</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                purchase.purchase_item.map((item, index) => {
                                                    return <tr key={index}>
                                                        <th scope="row">{index + 1}</th>
                                                        <td>
                                                            <h5 className="font-size-15 mb-1">{item.name}</h5>
                                                            <p className="font-size-13 text-muted mb-0">{item.code}</p>
                                                        </td>
                                                        <td>{system.currency.symbol}&nbsp;{item.net_unit_cost}</td>
                                                        <td>{item.discount} {item.discount_method == 0 ? system.currency.symbol : "%"}</td>
                                                        <td>{item.tax_rate} {item.tax_method == 0 ? "inclusive" : "Exclusive"}</td>
                                                        <td>{item.quantity} {item.purchase_unit.short_name}</td>
                                                        <td className="text-end">
                                                            {system.currency.symbol}&nbsp;{item.sub_total}

                                                        </td>
                                                    </tr>
                                                })
                                            }



                                            <tr>
                                                <td colSpan={5}></td>
                                                <td colSpan={2}>
                                                    <table className='table table-striped'>
                                                        <tbody>
                                                            <tr>
                                                                <td>Other Cost :</td>
                                                                <td>{system.currency.symbol} {purchase.other_cost.toFixed(2)}</td>
                                                            </tr>
                                                            <tr>
                                                                <td>Shipping Cost :</td>
                                                                <td>{system.currency.symbol} {purchase.shipping_cost.toFixed(2)}</td>
                                                            </tr>

                                                            <tr>
                                                                <td>Order Tax ({purchase.order_tax}%) :</td>
                                                                <td>{system.currency.symbol} {(purchase.sub_total * (purchase.order_tax / 100)).toFixed(2)}</td>
                                                            </tr>

                                                            <tr>
                                                                <td>Discount :</td>
                                                                <td>{system.currency.symbol} {purchase.discount_method == 0 ? purchase.discount : purchase.sub_total * (purchase.discount / 100)}</td>
                                                            </tr>

                                                            <tr>
                                                                <td>Total :</td>
                                                                <td>{system.currency.symbol}  {purchase.sub_total}</td>
                                                            </tr>

                                                            <tr>
                                                                <td><b>Grand Total :</b></td>
                                                                <td><b>{system.currency.symbol} {purchase.grand_total}</b></td>
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