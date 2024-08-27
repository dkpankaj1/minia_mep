import React from "react";
import AuthLayout from "@/Layouts/AuthLayout";
import { Card, CardBody } from "@/components/Card";
import AuthorizeLink from "@/components/AuthorizeLink";
import Badge from "@/components/Badge";
import ConfirmDelete from "@/components/ConfirmDelete";
import TableTopbar from "@/components/TableTopbar";
import TableFactory from "@/Factory/Table/TableFactory";
import { TLinksType } from "@/types/links.type";
import { PageProp } from "@/types/global";
import { TSystemPagePropType } from "@/types/type";
import { Head, usePage } from "@inertiajs/react";

interface IPagePropsType extends PageProp {
    system: TSystemPagePropType;
}

interface IPaymentType {
    id: number;
    date: string;
    sale_id: number;
    invoice_id: string;
    customer: string;
    email: string;
    status: string;
    method: string;
    amount: number;
    user: string;
}

interface IPropsType {
    payments: {
        data: Array<IPaymentType>;
        links: Array<Object>;
    };
    paymentCount: number;
    queryParam: unknown;
}

const List = ({ payments, paymentCount, queryParam }: IPropsType) => {
    console.log(payments);

    const { system } = usePage<IPagePropsType>().props;
    queryParam = queryParam || {};

    const columns = React.useMemo(
        () => [
            // { header: "Recept No.", accessor: "purchase_id" },
            { header: "Invoice ID", accessor: "invoice_id" },
            { header: "Date", accessor: "date" },
            { header: "Customer", accessor: "customer" },
            { header: "Email", accessor: "email" },
            {
                header: `Amount (${system.currency.symbol})`,
                accessor: "amount",
            },
            { header: "Payment Method", accessor: "method" },
            { header: "Payment Status", accessor: "status" },
            { header: "User", accessor: "user" },

            {
                header: "Action",
                accessor: null,
                render: (payment: IPaymentType) => (
                    <div className="d-flex flex-no-wrap gap-2">
                        {/* <AuthorizeLink
                            className="btn btn-sm btn-soft-success"
                            ability="product.index"
                            href={route("sale.payment.show", payment.id)}
                        >
                            <i className="bx bxs-show font-size-16 align-middle"></i>
                        </AuthorizeLink> */}
                        <AuthorizeLink
                            className="btn btn-sm btn-soft-primary"
                            ability="product.edit"
                            href={route("sale.payment.edit", payment.id)}
                        >
                            <i className="bx bxs-edit font-size-16 align-middle"></i>
                        </AuthorizeLink>
                        <ConfirmDelete
                            ability="product.delete"
                            url={route("sale.payment.destroy", payment.id)}
                            btnClass="btn btn-sm btn-soft-danger"
                            btnLabel={
                                <i className="bx bxs-trash font-size-16 align-middle"></i>
                            }
                        />
                    </div>
                ),
            },
        ],
        [system]
    );

    return (
        <>
            <AuthLayout>
                <Head title="Sale | Payment | List - " />
                <Card>
                    <CardBody>
                        <TableTopbar
                            title="Payments"
                            subTitle="View and Manage Payment"
                            count={paymentCount}
                            url={route("sale.payment.create")}
                            ability={"sale.payment.create"}
                        />
                        <TableFactory
                            columns={columns}
                            dataSource={payments}
                            url={route("sale.payment.index")}
                            queryParam={queryParam}
                        />
                    </CardBody>
                </Card>
            </AuthLayout>
        </>
    );
};

export default List;
