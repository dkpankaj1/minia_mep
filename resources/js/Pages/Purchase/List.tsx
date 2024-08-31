import React, { useMemo } from "react";
import AuthLayout from "../../Layouts/AuthLayout";
import { Head, Link, usePage } from "@inertiajs/react";
import { Card, CardBody } from "../../components/Card";

import useDownloadFile from "../../hooks/useDownloadFile";

import AuthorizeLink from "../../components/AuthorizeLink";
import Badge from "@/components/Badge";
import ConfirmDelete from "../../components/ConfirmDelete";
import TableTopbar from "../../components/TableTopbar";
import TableFactory from "../../Factory/Table/TableFactory";
import EllipsisMenu from "@/components/EllipsisMenu";
import IsAuthorize from "@/components/IsAuthorize";
import { Dropdown } from "react-bootstrap";
import TableContainer from "@/Factory/TableFactory/TableContainer";
import Table from "@/Factory/TableFactory/Table";
import CreateBtn from "@/components/CreateBtn";
import useTableFilters from "@/Factory/TableFactory/hooks/useTableFilters";
import LimitFilter from "@/Factory/TableFactory/Filters/LimitFilter";
import { TLinksType } from "@/types/links.type";
import { TQueryParam } from "@/types/queryParam.type";
import { TColumnType } from "@/types/column.type";
import { OrderStatusEnum } from "@/enum/OrderStatus.enum";
import { PaymentStatusEnum } from "@/enum/PaymentStatus.enum";

interface IPurchaseType {
    id: number;
    date: string;
    finance_year: string;
    grand_total: number;
    paid_amount: number;
    payment_status: string;
    reference: string;
    status: string;
    supplier: string;
    user: string;
    warehouse: string;
}
interface ISupplierType {
    id: number;
    name: string;
    email: string;
}

interface IListProps {
    purchases: {
        data: IPurchaseType[];
        links: TLinksType[];
    };
    purchaseCount: number;
    suppliers: ISupplierType[];
    queryParam: TQueryParam;
}

function List({ purchases, purchaseCount, suppliers, queryParam }: IListProps) {
    const { system } = usePage<any>().props;

    console.log(purchases);

    queryParam = queryParam || {};
    const {
        searchFieldChange,
        limitFieldChange,
        applyFilters,
        clearFilters,
        queryParam: param,
    } = useTableFilters(route("purchase.index"), queryParam);

    // const { isLoading, downloadFile } = useDownloadFile(route('purchase.export'), "purchases.xlsx")

    const columns: Array<TColumnType<IPurchaseType>> = [
        { header: "Date", accessor: "date" },
        { header: "Reference", accessor: "reference" },
        { header: "Finance Year", accessor: "finance_year" },
        { header: "Supplier", accessor: "supplier" },
        { header: "Warehouse", accessor: "warehouse" },
        {
            header: `Grand Total (${system.currency.symbol})`,
            render: (purchase: any) =>
                system.currency.symbol + " " + purchase.grand_total.toFixed(2),
        },
        {
            header: `Paid Total (${system.currency.symbol})`,
            render: (purchase: any) =>
                system.currency.symbol + " " + purchase.paid_amount.toFixed(2),
        },
        { header: "Order Status", accessor: "status" },
        {
            header: "Payment Status",
            render: (purchase: any) => {
                if (purchase.payment_status === "paid") {
                    return (
                        <Badge className="rounded-pill font-size-12 fw-medium bg-success-subtle text-success">
                            {purchase.payment_status}
                        </Badge>
                    );
                }
                if (purchase.payment_status === "partial") {
                    return (
                        <Badge className="rounded-pill font-size-12 fw-medium bg-info-subtle text-info">
                            {purchase.payment_status}
                        </Badge>
                    );
                }
                if (purchase.payment_status === "pending") {
                    return (
                        <Badge className="rounded-pill font-size-12 fw-medium bg-danger-subtle text-danger">
                            {purchase.payment_status}
                        </Badge>
                    );
                }
            },
        },
        { header: "User", accessor: "user" },
        {
            header: "Action",
            accessor: null,
            render: (purchase: IPurchaseType) => (
                <div className="d-flex flex-no-wrap gap-2">
                    <AuthorizeLink
                        className="btn btn-sm btn-soft-success"
                        ability="purchase.index"
                        href={route("purchase.show", purchase.id)}
                    >
                        <i className="bx bxs-show font-size-16 align-middle"></i>
                    </AuthorizeLink>
                    <AuthorizeLink
                        className="btn btn-sm btn-soft-primary"
                        ability="purchase.edit"
                        href={route("purchase.edit", purchase.id)}
                    >
                        <i className="bx bxs-edit font-size-16 align-middle"></i>
                    </AuthorizeLink>
                    <ConfirmDelete
                        ability="purchase.delete"
                        url={route("purchase.destroy", purchase.id)}
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
            accessor: null,
            render: (purchase: IPurchaseType) => (
                <EllipsisMenu>
                    <IsAuthorize ability={"purchase.payment.create"}>
                        <Link
                            className="dropdown-item"
                            href={route("purchase.payment.create", {
                                purchase: purchase.id,
                            })}
                        >
                            <i className="mdi mdi-credit-card-outline me-2"></i>
                            Payment
                        </Link>
                    </IsAuthorize>
                    <IsAuthorize ability={"sale.payment.index"}>
                        <Link
                            className="dropdown-item"
                            href={route("purchase.payment.index", {
                                reference: purchase.reference,
                            })}
                        >
                            <i className="mdi mdi-cash-check me-2"></i>
                            Show Payment
                        </Link>
                    </IsAuthorize>
                    <IsAuthorize ability={"purchase.index"}>
                        <a
                            href={route("purchase.print", purchase.id)}
                            target="_blank"
                            className="dropdown-item"
                        >
                            <i className="mdi mdi-printer-outline me-2"></i>
                            Print Invoice
                        </a>
                    </IsAuthorize>
                    <IsAuthorize ability={"purchase.index"}>
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
            <Head title="Purchase | List - " />

            <TableContainer
                title="Purchase List"
                subTitle="View and Manage Purchase"
                count={purchaseCount}
                buttons={
                    <CreateBtn
                        url={route("purchase.create")}
                        ability={"purchase.create"}
                    />
                    //   <div className="d-flex my-3 gap-1 justify-content-end">
                    //     <AuthorizeLink as="button" ability={"purchase.index"} className="btn btn-success w-xs" onClick={downloadFile} disabled={isLoading}>
                    //         {isLoading ? "Exporting.." : "Export"}
                    //     </AuthorizeLink>
                    // </div>
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
                                    searchFieldChange("date", e.target.value)
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
                <Table dataSource={purchases.data} columns={columns} />
                <Table.Pagination links={purchases.links} />
            </TableContainer>
        </AuthLayout>
    );
}

export default List;
