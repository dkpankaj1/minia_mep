import AuthorizeLink from "@/components/AuthorizeLink";
import AuthLayout from "@/Layouts/AuthLayout";
import { PageProp } from "@/types/global";
import { TCompanyType, TSystemPagePropType } from "@/types/type";
import { usePage } from "@inertiajs/react";
import React from "react";

interface ICustomerType {
    name: string;
    email: string;
    phone: string;
    whatsapp: string;
    address: string;
    city: string;
    state: string;
    country: string;
    postal_code: string;
    group: string;
}
interface ISaleItemBatchType {
    id: number;
    sale_item_id: number;
    product_batch_id: number;
    quantity: number;
}
interface ISaleItemType {
    stock_id: number;
    product_code: string;
    product_name: string;
    original_price: number;
    net_unit_price: number;
    sale_unit: {
        name: string;
        short_name: string;
    };
    quantity: number;
    subtotal: number;
    discount_method: number;
    discount: number;
    tax_method: number;
    tax_rate: number;
    is_batch: boolean;
    sale_batches: Array<ISaleItemBatchType> | null;
}
interface ISaleType {
    id: number;
    date: number;
    invoice_id: string;
    customer: ICustomerType;
    finance_year: number;
    warehouse: number;
    total_cost: number;
    discount_method: number;
    discount: number;
    total_tax: number;
    tax_rate: number;
    shipping_cost: number;
    other_cost: number;
    grand_total: number;
    order_status: number;
    note: number;
    sale_items: Array<ISaleItemType>;
}
interface IPropsType {
    sale: ISaleType;
}
interface IPageProps extends PageProp {
    system: TSystemPagePropType;
    company: TCompanyType;
}
function Show({ sale }: IPropsType) {
    const { system, company } = usePage<IPageProps>().props;

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
                                            <img
                                                src={company.logo}
                                                alt={company.name}
                                                height="24"
                                            />
                                            <span className="logo-txt">
                                                {company.name}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex-shrink-0">
                                        <div className="mb-4">
                                            <h4 className="float-end font-size-16">
                                                Receipt No. # {sale.id}
                                            </h4>
                                        </div>
                                        <div className="mb-4">
                                            <h4 className="float-end font-size-16">
                                                #{sale.invoice_id}
                                            </h4>
                                        </div>
                                    </div>
                                </div>
                                <p className="mb-1">
                                    {company.address}, {company.city}
                                </p>
                                <p className="mb-1">
                                    {company.state}, {company.country} (
                                    {company.postal_code})
                                </p>
                                <p className="mb-1">
                                    <i className="mdi mdi-email align-middle me-1"></i>
                                    {company.email}
                                </p>
                                <p>
                                    <i className="mdi mdi-phone align-middle me-1"></i>
                                    {company.phone}
                                </p>
                            </div>

                            <hr className="my-4" />

                            <div className="row">
                                <div className="col-sm-6">
                                    <h5 className="font-size-15 mb-3">
                                        Billed To:
                                    </h5>
                                    <h5 className="font-size-14 mb-2">
                                        {sale.customer.name}
                                    </h5>
                                    <p className="mb-1">
                                        {sale.customer.address},{" "}
                                        {sale.customer.city}
                                    </p>
                                    <p className="mb-1">
                                        {sale.customer.state},{" "}
                                        {sale.customer.country} (
                                        {sale.customer.postal_code})
                                    </p>
                                    <p className="mb-1">
                                        {sale.customer.phone},{" "}
                                        {sale.customer.email}
                                    </p>
                                </div>
                                <div className="col-sm-6">
                                    <h5 className="font-size-15">
                                        Order Date: {sale.date}
                                    </h5>
                                    <h5 className="font-size-15 mt-3">
                                        Order Status: {sale.order_status}
                                    </h5>
                                    <h5 className="font-size-15 mt-3">
                                        Warehouse: {sale.warehouse}
                                    </h5>
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
                                                <th style={{ width: "70px" }}>
                                                    No.
                                                </th>
                                                <th>Item</th>
                                                <th>Unit Price</th>
                                                <th>Unit Discount</th>
                                                <th>Unit Tax (%)</th>
                                                <th>Quantity</th>
                                                <th
                                                    className="text-end"
                                                    style={{ width: "120px" }}
                                                >
                                                    Price
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {sale.sale_items.map(
                                                (item, index) => (
                                                    <tr key={index}>
                                                        <th scope="row">
                                                            {index + 1}
                                                        </th>
                                                        <td>
                                                            <h5 className="font-size-15 mb-1">
                                                                {
                                                                    item.product_name
                                                                }
                                                            </h5>
                                                            <p className="font-size-13 text-muted mb-0">
                                                                {
                                                                    item.product_code
                                                                }
                                                            </p>
                                                        </td>
                                                        <td>
                                                            {
                                                                system.currency
                                                                    .symbol
                                                            }
                                                            &nbsp;
                                                            {item.net_unit_price.toFixed(
                                                                2
                                                            )}
                                                        </td>
                                                        <td>
                                                            {item.discount.toFixed(
                                                                2
                                                            )}{" "}
                                                            {item.discount_method ===
                                                            0
                                                                ? system
                                                                      .currency
                                                                      .symbol
                                                                : "%"}
                                                        </td>
                                                        <td>
                                                            {item.tax_rate.toFixed(
                                                                2
                                                            )}{" "}
                                                            {item.tax_method ===
                                                            0
                                                                ? "(%) inclusive"
                                                                : "(%) exclusive"}
                                                        </td>
                                                        <td>
                                                            {item.quantity}{" "}
                                                            {
                                                                item.sale_unit
                                                                    .short_name
                                                            }
                                                        </td>
                                                        <td className="text-end">
                                                            {
                                                                system.currency
                                                                    .symbol
                                                            }
                                                            &nbsp;
                                                            {item.subtotal.toFixed(
                                                                2
                                                            )}
                                                        </td>
                                                    </tr>
                                                )
                                            )}
                                            <tr>
                                                <td colSpan={5}></td>
                                                <td colSpan={2}>
                                                    <table className="table table-sm table-striped">
                                                        <tbody>
                                                            <tr>
                                                                <td>Total:</td>
                                                                <td>
                                                                    {
                                                                        system
                                                                            .currency
                                                                            .symbol
                                                                    }{" "}
                                                                    {sale.total_cost.toFixed(
                                                                        2
                                                                    )}
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td>
                                                                    Discount:
                                                                </td>
                                                                <td>
                                                                    {
                                                                        system
                                                                            .currency
                                                                            .symbol
                                                                    }{" "}
                                                                    {(sale.discount_method ===
                                                                    0
                                                                        ? sale.discount
                                                                        : sale.total_cost *
                                                                          (sale.discount /
                                                                              100)
                                                                    ).toFixed(
                                                                        2
                                                                    )}
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td>
                                                                    Order Tax (
                                                                    {
                                                                        sale.tax_rate
                                                                    }
                                                                    %):
                                                                </td>
                                                                <td>
                                                                    {
                                                                        system
                                                                            .currency
                                                                            .symbol
                                                                    }{" "}
                                                                    {sale.total_tax.toFixed(
                                                                        2
                                                                    )}
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td>
                                                                    Shipping
                                                                    Cost + Other
                                                                    Cost:
                                                                </td>
                                                                <td>
                                                                    {
                                                                        system
                                                                            .currency
                                                                            .symbol
                                                                    }{" "}
                                                                    {(
                                                                        sale.shipping_cost +
                                                                        sale.other_cost
                                                                    ).toFixed(
                                                                        2
                                                                    )}
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td>
                                                                    <b>
                                                                        Grand
                                                                        Total:
                                                                    </b>
                                                                </td>
                                                                <td>
                                                                    <b>
                                                                        {
                                                                            system
                                                                                .currency
                                                                                .symbol
                                                                        }{" "}
                                                                        {sale.grand_total.toFixed(
                                                                            2
                                                                        )}
                                                                    </b>
                                                                </td>
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
                                    <a
                                        href={route("sale.print", sale.id)}
                                        target="_blank"
                                        className="btn btn-success waves-effect waves-light me-1"
                                    >
                                        <i className="fa fa-print"></i>
                                    </a>
                                    <AuthorizeLink
                                        ability="sale.edit"
                                        href={route("sale.edit", sale.id)}
                                        className="btn btn-primary w-md"
                                    >
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
