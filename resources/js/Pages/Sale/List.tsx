import React, { useMemo } from "react";

import AuthLayout from "../../Layouts/AuthLayout";
import { Head, usePage } from "@inertiajs/react";
import { Card, CardBody } from "../../components/Card";
import TableTopbar from "../../components/TableTopbar";
import TableFactory from "../../Factory/Table/TableFactory";
import AuthorizeLink from "../../components/AuthorizeLink";
import ConfirmDelete from "../../components/ConfirmDelete";
import { PageProp } from "@/types/global";

type TCustomerType = {
    id: string;
    name: string;
};

type TFinanceYearType = {
    id: string;
    name: string;
};

type TSaleType = {
    id: string;
    invoice_id: string;
    date: string;
    total_cost: number;
    discount_method: string;
    discount: number;
    tax_rate: number;
    total_tax: number;
    shipping_cost: number;
    other_cost: number;
    grand_total: number;
    paid_amount: number;
    order_status: string;
    payment_status: string;
    customer: TCustomerType;
    finance_year: TFinanceYearType;
};

type TPropsType = {
    sales: {
        data: Array<TSaleType>;
        links: unknown;
    };
    saleCount: number;
    queryParam: unknown;
};
interface IPagePropType extends PageProp {
    system: TSystemPagePropType;
}

function List({ sales, saleCount, queryParam = null }: TPropsType) {
    console.log(sales);

    const { system } = usePage<IPagePropType>().props;

    queryParam = queryParam || {};

    const columns = useMemo(
        () => [
            { header: "Invoice", accessor: "invoice_id" },
            { header: "Date", accessor: "date" },
            {
                header: "Finance Year",
                accessor: null,
                render: (sale: TSaleType) => sale.finance_year.name,
            },
            {
                header: "Customer",
                accessor: null,
                render: (sale: TSaleType) => sale.customer.name,
            },
            {
                header: `Grand Total (${system.currency.symbol})`,
                accessor: null,
                render: (sale: TSaleType) =>
                    system.currency.symbol + " " + sale.grand_total.toFixed(2),
            },
            {
                header: `Paid Total (${system.currency.symbol})`,
                accessor: "null",
                render: (sale: TSaleType) =>
                    system.currency.symbol + " " + sale.paid_amount.toFixed(2),
            },
            { header: "Order Status", accessor: "order_status" },
            { header: "Payment Status", accessor: "payment_status" },
            {
                header: "Action",
                accessor: null,
                render: (sale) => (
                    <div className="d-flex flex-no-wrap gap-2">
                        {/* <AuthorizeLink
                            className="btn btn-sm btn-soft-success"
                            ability="sale.index"
                            href={route("sale.show", sale.id)}
                        >
                            <i className="bx bxs-show font-size-16 align-middle"></i>
                        </AuthorizeLink>
                        <AuthorizeLink
                            className="btn btn-sm btn-soft-primary"
                            ability="sale.edit"
                            href={route("sale.edit", sale.id)}
                        >
                            <i className="bx bxs-edit font-size-16 align-middle"></i>
                        </AuthorizeLink>
                        <ConfirmDelete
                            ability="sale.delete"
                            url={route("sale.destroy", sale.id)}
                            btnClass="btn btn-sm btn-soft-danger"
                            btnLabel={
                                <i className="bx bxs-trash font-size-16 align-middle"></i>
                            }
                        /> */}
                    </div>
                ),
            },
        ],
        [system]
    );

    return (
        <AuthLayout>
            <Head title="Sale | List - " />

            <Card>
                <CardBody>
                    <TableTopbar
                        title="Sale List"
                        subTitle="View and Manage Sales"
                        count={saleCount}
                        url={route("sale.create")}
                        ability={"sale.create"}
                    />

                    <TableFactory
                        columns={columns}
                        dataSource={sales}
                        queryParam={queryParam}
                        url={route("sale.index")}
                    />
                </CardBody>
            </Card>
        </AuthLayout>
    );
}

export default List;
