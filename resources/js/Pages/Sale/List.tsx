import React, { useMemo } from "react";
import AuthLayout from "../../Layouts/AuthLayout";
import { Head, Link, usePage } from "@inertiajs/react";
import Badge from "@/components/Badge";
import AuthorizeLink from "../../components/AuthorizeLink";
import ConfirmDelete from "../../components/ConfirmDelete";
import { PageProp } from "@/types/global";
import { TSystemPagePropType } from "@/types/type";
import EllipsisMenu from "@/components/EllipsisMenu";
import IsAuthorize from "@/components/IsAuthorize";
import { Dropdown } from "react-bootstrap";
import TableContainer from "@/Factory/TableFactory/TableContainer";
import Table from "@/Factory/TableFactory/Table";
import CreateBtn from "@/components/CreateBtn";
import useTableFilters from "@/Factory/TableFactory/hooks/useTableFilters";
import LimitFilter from "@/Factory/TableFactory/Filters/LimitFilter";
import { TColumnType } from "@/types/column.type";
import { TLinksType } from "@/types/links.type";
import { TQueryParam } from "@/types/queryParam.type";
import { OrderStatusEnum } from "@/enum/OrderStatus.enum";
import { PaymentStatusEnum } from "@/enum/PaymentStatus.enum";

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
        links: Array<TLinksType>;
    };
    saleCount: number;
    customers: Array<{
        id: number;
        name: string;
        email: string;
    }>;
    queryParam: TQueryParam;
};
interface IPagePropType extends PageProp {
    system: TSystemPagePropType;
}

function List({ sales, saleCount, customers, queryParam }: TPropsType) {
    const { system } = usePage<IPagePropType>().props;

    queryParam = queryParam || {};
    const {
        searchFieldChange,
        applyFilters,
        limitFieldChange,
        queryParam: param,
        clearFilters,
    } = useTableFilters(route("sale.index"), queryParam);

    const columns: Array<TColumnType<TSaleType>> = [
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
            render: (sale: TSaleType) =>
                system.currency.symbol + " " + sale.paid_amount.toFixed(2),
        },
        { header: "Order Status", accessor: "order_status" },
        {
            header: "Payment Status",
            render: (sale: TSaleType) => {
                if (sale.payment_status === "paid") {
                    return (
                        <Badge className="rounded-pill font-size-12 fw-medium bg-success-subtle text-success px-2">
                            {sale.payment_status}
                        </Badge>
                    );
                }
                if (sale.payment_status === "partial") {
                    return (
                        <Badge className="rounded-pill font-size-12 fw-medium bg-info-subtle text-info px-2">
                            {sale.payment_status}
                        </Badge>
                    );
                }
                if (sale.payment_status === "pending") {
                    return (
                        <Badge className="rounded-pill font-size-12 fw-medium bg-danger-subtle text-danger px-2">
                            {sale.payment_status}
                        </Badge>
                    );
                }
            },
        },
        {
            header: "Action",
            accessor: null,
            render: (sale: TSaleType) => (
                <div className="d-flex flex-no-wrap gap-2">
                    <AuthorizeLink
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
                    />
                </div>
            ),
        },
        {
            header: "More",
            render: (sale: TSaleType) => (
                <EllipsisMenu>
                    <IsAuthorize ability={"sale.payment.create"}>
                        <Link
                            className="dropdown-item"
                            href={route("sale.payment.create", {
                                sale: sale.id,
                            })}
                        >
                            <i className="mdi mdi-cash-plus me-2"></i>
                            Payment
                        </Link>
                    </IsAuthorize>

                    <IsAuthorize ability={"sale.payment.index"}>
                        <Link
                            className="dropdown-item"
                            href={route("sale.payment.index", {
                                invoice_id: sale.invoice_id,
                            })}
                        >
                            <i className="mdi mdi-cash-check me-2"></i>
                            Show Payment
                        </Link>
                    </IsAuthorize>

                    <IsAuthorize ability={"sale.index"}>
                        <a
                            href={route("sale.print", sale.id)}
                            target="_blank"
                            className="dropdown-item"
                        >
                            <i className="mdi mdi-printer-outline me-2"></i>
                            Print Invoice
                        </a>
                    </IsAuthorize>

                    <IsAuthorize ability={"sale.index"}>
                        <Dropdown.Item>
                            <i className="mdi mdi-send-outline me-2"></i>
                            Send Invoice
                        </Dropdown.Item>
                    </IsAuthorize>
                </EllipsisMenu>
            ),
        },
    ];

    return (
        <AuthLayout>
            <Head title="Sale | List - " />

            <TableContainer
                title="Sale List"
                subTitle="View and manage sale"
                count={saleCount}
                buttons={
                    <CreateBtn
                        url={route("sale.create")}
                        ability={"sale.create"}
                    />
                }
            >
                <Table.Filter
                    limitFilter={
                        <LimitFilter
                            limitFieldChange={limitFieldChange}
                            limit={param?.limit || ""}
                        />
                    }
                >
                    <div>
                        <div className="mb-3">
                            <label htmlFor="name">Invoice</label>
                            <input
                                type="text"
                                defaultValue={param?.invoice_id || ""}
                                onChange={(e) =>
                                    searchFieldChange(
                                        "invoice_id",
                                        e.target.value
                                    )
                                }
                                className="form-control"
                                placeholder="INV_********"
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="name">Date</label>
                            <input
                                type="date"
                                defaultValue={param?.date || ""}
                                onChange={(e) =>
                                    searchFieldChange("date", e.target.value)
                                }
                                className="form-control"
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="customer">Customer</label>
                            <select
                                className="form-select"
                                value={param?.customer || ""}
                                onChange={(e) =>
                                    searchFieldChange(
                                        "customer",
                                        e.target.value
                                    )
                                }
                            >
                                <option value={""}>---select---</option>
                                {customers.map((customer) => (
                                    <option
                                        key={customer.id}
                                        value={customer.id}
                                    >{`${customer.name} - ${customer.email}`}</option>
                                ))}
                            </select>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="name">Order Status</label>
                            <select
                                className="form-select"
                                value={param?.order_status || ""}
                                onChange={(e) =>
                                    searchFieldChange(
                                        "order_status",
                                        e.target.value
                                    )
                                }
                            >
                                <option value={""}>---select---</option>
                                <option value={OrderStatusEnum.GENERATED}>
                                    {"Generated"}
                                </option>
                                <option value={OrderStatusEnum.PENDING}>
                                    {"Pending"}
                                </option>
                                <option value={OrderStatusEnum.RECEIVED}>
                                    {"Received"}
                                </option>
                            </select>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="name">Payment Status</label>
                            <select
                                className="form-select"
                                value={param?.payment_status || ""}
                                onChange={(e) =>
                                    searchFieldChange(
                                        "payment_status",
                                        e.target.value
                                    )
                                }
                            >
                                <option value={""}>---select---</option>
                                <option value={PaymentStatusEnum.PAID}>
                                    {PaymentStatusEnum.PAID}
                                </option>
                                <option value={PaymentStatusEnum.PARTIAL}>
                                    {PaymentStatusEnum.PARTIAL}
                                </option>
                                <option value={PaymentStatusEnum.PENDING}>
                                    {PaymentStatusEnum.PENDING}
                                </option>
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
                <Table columns={columns} dataSource={sales.data} />
                <Table.Pagination links={sales.links} />
            </TableContainer>
        </AuthLayout>
    );
}

export default List;
