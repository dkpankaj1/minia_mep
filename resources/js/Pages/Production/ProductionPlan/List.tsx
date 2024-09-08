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
import { usePage } from "@inertiajs/react";
import { PageProp } from "@/types/global";
import { TSystemPagePropType } from "@/types/type";

interface ProductionOrderType {
    id: number;
    date: string;
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

export type StatusType = "planned" | "processing" | "complete";

interface PropsType {
    productionOrders: {
        data: ProductionOrderType[];
        links: TLinksType[];
    };
    countProductionOrder: number;
}
interface PagePropsType extends PageProp {
    system: TSystemPagePropType;
}

function List({ productionOrders, countProductionOrder }: PropsType) {
    const { system } = usePage<PagePropsType>().props;
    const getStatusStyle = (status: StatusType) => {
        switch (status) {
            case "planned":
                return "badge-soft-secondary";
            case "processing":
                return "badge-soft-primary";
            case "complete":
                return "badge-soft-success";
        }
    };
    const columns: TColumnType<ProductionOrderType>[] = [
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
        // {
        //     header: `Cost (${system.currency.symbol})`,
        //     accessor: "estimated_cost",
        // },
        // {
        //     header: `Extra Cost (${system.currency.symbol})`,
        //     accessor: "other_cost",
        // },
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
                    {productionOrder.status}
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
                        ability="product.edit"
                        href={route(
                            "production.production-order.edit",
                            productionOrder.id
                        )}
                    >
                        <i className="bx bxs-edit font-size-16 align-middle"></i>
                    </AuthorizeLink>
                    <ConfirmDelete
                        ability="product.delete"
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
                <Table columns={columns} dataSource={productionOrders.data} />
                <Table.Pagination links={productionOrders.links} />
            </TableContainer>
        </AuthLayout>
    );
}

export default List;
