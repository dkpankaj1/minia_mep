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
import TableContainer from "@/Factory/TableFactory/TableContainer";
import CreateBtn from "@/components/CreateBtn";
import Table from "@/Factory/TableFactory/Table";
import { TColumnType } from "@/types/column.type";
import LimitFilter from "@/Factory/TableFactory/Filters/LimitFilter";
import useTableFilters from "@/Factory/TableFactory/hooks/useTableFilters";
import { TQueryParam } from "@/types/queryParam.type";
import { PaymentStatusEnum } from "@/enum/PaymentStatus.enum";
import { OrderStatusEnum } from "@/enum/OrderStatus.enum";

interface IPagePropsType extends PageProp {
    system: TSystemPagePropType;
}

interface IPaymentType {
    id: number;
    date: string;
    purchase_id: number;
    reference_no: string;
    supplier: string;
    email: string;
    status: string;
    method: string;
    amount: number;
    user: string;
}
interface ISupplierType {
    id: number;
    name: string;
    email: string;
}

interface IPropsType {
    payments: {
        data: Array<IPaymentType>;
        links: Array<TLinksType>;
    };
    paymentCount: number;
    suppliers: ISupplierType[];
    queryParam: TQueryParam;
}

const List = ({
    payments,
    paymentCount,
    suppliers,
    queryParam,
}: IPropsType) => {
    console.log(payments);

    const { system } = usePage<IPagePropsType>().props;
    queryParam = queryParam || {};
    const {
        searchFieldChange,
        limitFieldChange,
        applyFilters,
        clearFilters,
        queryParam: param,
    } = useTableFilters(route("purchase.payment.index"), queryParam);

    const columns: TColumnType<IPaymentType>[] = [
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
    ];

    return (
        <>
            <AuthLayout>
                <Head title="Purchase | Payment | List - " />

                <TableContainer
                    title="Payments"
                    subTitle="View and Manage Payment"
                    count={paymentCount}
                    buttons={
                        <React.Fragment>
                            <CreateBtn
                                url={route("purchase.payment.create")}
                                ability={"purchase.payment.create"}
                            />
                        </React.Fragment>
                    }
                >
                    <Table.Filter
                        limitFilter={
                            <LimitFilter
                                limit={param?.limit}
                                limitFieldChange={limitFieldChange}
                            />
                        }
                    >
                        <div>
                            <div className="mb-3">
                                <label htmlFor="name">Reference</label>
                                <input
                                    type="text"
                                    defaultValue={param?.reference || ""}
                                    onChange={(e) =>
                                        searchFieldChange(
                                            "reference",
                                            e.target.value
                                        )
                                    }
                                    className="form-control"
                                    placeholder="REF_********"
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="name">Date</label>
                                <input
                                    type="date"
                                    defaultValue={param?.date || ""}
                                    onChange={(e) =>
                                        searchFieldChange(
                                            "date",
                                            e.target.value
                                        )
                                    }
                                    className="form-control"
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="customer">Supplier</label>
                                <select
                                    className="form-select"
                                    value={param?.supplier || ""}
                                    onChange={(e) =>
                                        searchFieldChange(
                                            "supplier",
                                            e.target.value
                                        )
                                    }
                                >
                                    <option value={""}>---select---</option>
                                    {suppliers.map((supplier) => (
                                        <option
                                            key={supplier.id}
                                            value={supplier.id}
                                        >{`${supplier.name} - ${supplier.email}`}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <div className="d-flex gap-1 mb-3">
                                    <button
                                        className="btn btn-primary w-100"
                                        onClick={applyFilters}
                                    >
                                        Filter
                                    </button>
                                    <button
                                        className="btn btn-danger w-100"
                                        onClick={clearFilters}
                                    >
                                        Clear
                                    </button>
                                </div>
                            </div>
                        </div>
                    </Table.Filter>
                    <Table dataSource={payments.data} columns={columns} />
                    <Table.Pagination links={payments.links} />
                </TableContainer>
            </AuthLayout>
        </>
    );
};

export default List;
