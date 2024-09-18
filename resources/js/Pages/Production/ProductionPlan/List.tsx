import React from "react";
import CreateBtn from "@/components/CreateBtn";
import Table from "@/Factory/TableFactory/Table";
import TableContainer from "@/Factory/TableFactory/TableContainer";
import AuthLayout from "@/Layouts/AuthLayout";
import { TColumnType } from "@/types/column.type";
import { TLinksType } from "@/types/links.type";
import ConfirmDelete from "@/components/ConfirmDelete";
import AuthorizeLink from "@/components/AuthorizeLink";
import Badge from "@/components/Badge";
import { Head, usePage } from "@inertiajs/react";
import { PageProp } from "@/types/global";
import { TSystemPagePropType } from "@/types/type";
import { TQueryParam } from "@/types/queryParam.type";
import useTableFilters from "@/Factory/TableFactory/hooks/useTableFilters";
import LimitFilter from "@/Factory/TableFactory/Filters/LimitFilter";

interface ProductionOrderType {
    id: number;
    date: string;
    code: string;
    bom_id: number;
    bom_code: string;
    product: string;
    finance_year: string;
    warehouse: string;
    work_station: string;
    quantity: number;
    unit: string;
    estimated_cost: number;
    other_cost: number;
    start_at: string;
    end_at: string;
    status: string;
    user_id: string;
}

type StatusType =
    | "planned"
    | "processing"
    | "in_progress"
    | "reject"
    | "complete";

const StatusEnum = {
    Planned: "planned",
    Processing: "processing",
    INPROGRESS: "in_progress",
    REJECT: "reject",
    Complete: "complete",
};

interface PropsType {
    productionOrders: {
        data: ProductionOrderType[];
        links: TLinksType[];
    };
    countProductionOrder: number;
    queryParam: TQueryParam;
    workstations: { id: number; name: string }[];
    products: { id: number; code: string; name: string }[];
}
interface PagePropsType extends PageProp {
    system: TSystemPagePropType;
}

function List({
    productionOrders,
    countProductionOrder,
    queryParam,
    workstations,
    products,
}: PropsType) {
    const { system } = usePage<PagePropsType>().props;
    queryParam = queryParam || {};
    const {
        searchFieldChange,
        applyFilters,
        limitFieldChange,
        queryParam: param,
        clearFilters,
    } = useTableFilters(route("production.production-order.index"), queryParam);
    const getStatusStyle = (status: StatusType) => {
        switch (status) {
            case "planned":
                return "badge-soft-secondary px-3";
            case "processing":
                return "badge-soft-info";
            case "in_progress":
                return "badge-soft-primary";
            case "complete":
                return "badge-soft-success";
            case "reject":
                return "badge-soft-danger px-3";
        }
    };
    const columns: TColumnType<ProductionOrderType>[] = [
        {
            header: "Code",
            accessor: "code",
        },
        {
            header: "Date",
            accessor: "date",
        },
        {
            header: "BOM Code",
            accessor: "bom_code",
        },
        {
            header: "Product",
            accessor: "product",
        },
        {
            header: "Quantity",
            render: (productionOrder) =>
                `${productionOrder.quantity} ${productionOrder.unit}`,
        },
        {
            header: `Grand Total (${system.currency.symbol})`,
            render: (productionOrder) =>
                `${
                    (productionOrder.estimated_cost +
                        productionOrder.other_cost) *
                    productionOrder.quantity
                }`,
        },
        {
            header: "WorkStation",
            accessor: "work_station",
        },
        {
            header: "Start At",
            accessor: "start_at",
        },
        {
            header: "End At",
            accessor: "end_at",
        },
        {
            header: "Status",
            render: (productionOrder) => (
                <Badge
                    className={` p-2 ${getStatusStyle(
                        productionOrder.status as StatusType
                    )}`}
                >
                    {productionOrder.status.toUpperCase()}
                </Badge>
            ),
        },
        {
            header: "Action",
            render: (productionOrder) => (
                <div className="d-flex flex-no-wrap gap-2">
                    <AuthorizeLink
                        className="btn btn-sm btn-soft-success"
                        ability="production.production-order.index"
                        href={route(
                            "production.production-order.show",
                            productionOrder.id
                        )}
                    >
                        <i className="bx bxs-show font-size-16 align-middle"></i>
                    </AuthorizeLink>
                    <AuthorizeLink
                        className="btn btn-sm btn-soft-primary"
                        ability="production.production-order.edit"
                        href={route(
                            "production.production-order.edit",
                            productionOrder.id
                        )}
                    >
                        <i className="bx bxs-edit font-size-16 align-middle"></i>
                    </AuthorizeLink>
                    <ConfirmDelete
                        ability="production.production-order.delete"
                        url={route(
                            "production.production-order.destroy",
                            productionOrder.id
                        )}
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
        <AuthLayout>
            <Head title="Production | Production Order | List - " />
            <TableContainer
                title="Production Order"
                subTitle="View nad manage production order"
                count={countProductionOrder}
                buttons={
                    <CreateBtn
                        ability={"production.production-order.create"}
                        url={route("production.production-order.create")}
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
                            <label htmlFor="name">BOM</label>
                            <input
                                type="text"
                                defaultValue={param?.bom || ""}
                                onChange={(e) =>
                                    searchFieldChange("bom", e.target.value)
                                }
                                className="form-control"
                                placeholder="BOM*******"
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="customer">Product</label>
                            <select
                                className="form-select"
                                value={param?.product || ""}
                                onChange={(e) =>
                                    searchFieldChange("product", e.target.value)
                                }
                            >
                                <option value={""}>---select---</option>
                                {products.map((product) => (
                                    <option key={product.id} value={product.id}>
                                        {product.name} - {product.code}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="customer">Workstation</label>
                            <select
                                className="form-select"
                                value={param?.workstation || ""}
                                onChange={(e) =>
                                    searchFieldChange(
                                        "workstation",
                                        e.target.value
                                    )
                                }
                            >
                                <option value={""}>---select---</option>
                                {workstations.map((workstation) => (
                                    <option
                                        key={workstation.id}
                                        value={workstation.id}
                                    >
                                        {workstation.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="name">Status</label>
                            <select
                                className="form-select"
                                value={param?.status || ""}
                                onChange={(e) =>
                                    searchFieldChange("status", e.target.value)
                                }
                            >
                                <option value={""}>---select---</option>
                                <option value={StatusEnum.Planned}>
                                    {"Planned"}
                                </option>
                                <option value={StatusEnum.Processing}>
                                    {"Processing"}
                                </option>
                                <option value={StatusEnum.INPROGRESS}>
                                    {"In Progress"}
                                </option>
                                <option value={StatusEnum.REJECT}>
                                    {"Reject"}
                                </option>
                                <option value={StatusEnum.Complete}>
                                    {"Complete"}
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
                <Table columns={columns} dataSource={productionOrders.data} />
                <Table.Pagination links={productionOrders.links} />
            </TableContainer>
        </AuthLayout>
    );
}

export default List;
