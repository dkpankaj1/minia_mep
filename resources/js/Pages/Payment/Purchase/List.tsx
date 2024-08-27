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
    purchase_id: number;
    reference_no: string;
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
            { header: "Reference", accessor: "reference_no" },
            { header: "Date", accessor: "date" },
            { header: "Supplier", accessor: "supplier" },
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
                            href={route("purchase.payment.show", payment.id)}
                        >
                            <i className="bx bxs-show font-size-16 align-middle"></i>
                        </AuthorizeLink> */}
                        <AuthorizeLink
                            className="btn btn-sm btn-soft-primary"
                            ability="product.edit"
                            href={route("purchase.payment.edit", payment.id)}
                        >
                            <i className="bx bxs-edit font-size-16 align-middle"></i>
                        </AuthorizeLink>
                        <ConfirmDelete
                            ability="product.delete"
                            url={route("purchase.payment.destroy", payment.id)}
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
                <Head title="Purchase | Payment | List - " />
                <Card>
                    <CardBody>
                        <TableTopbar
                            title="Payments"
                            subTitle="View and Manage Payment"
                            count={paymentCount}
                            url={route("purchase.payment.create")}
                            ability={"purchase.payment.create"}
                        />
                        <TableFactory
                            columns={columns}
                            dataSource={payments}
                            url={route("purchase.payment.index")}
                            queryParam={queryParam}
                        />
                    </CardBody>
                </Card>
            </AuthLayout>
        </>
    );
};

export default List;
