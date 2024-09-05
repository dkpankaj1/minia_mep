import AuthorizeLink from "@/components/AuthorizeLink";
import ConfirmDelete from "@/components/ConfirmDelete";
import CreateBtn from "@/components/CreateBtn";
import Table from "@/Factory/TableFactory/Table";
import TableContainer from "@/Factory/TableFactory/TableContainer";
import AuthLayout from "@/Layouts/AuthLayout";
import { TColumnType } from "@/types/column.type";
import { Head } from "@inertiajs/react";
import React from "react";

interface ProductType {
    id: number;
    name: string;
}
interface BillOfMaterialType {
    id: number;
    product: ProductType;
    material_cost: number;
    overhead_cost: number;
    other_cost: number;
    grand_total: number;
    created_at: string;
    update_at: string;
}
interface IPageProps {
    billOfMaterials: BillOfMaterialType[];
    bomCount: number;
}

function List({ billOfMaterials, bomCount }: IPageProps) {
    console.log(billOfMaterials);
    const column: Array<TColumnType<BillOfMaterialType>> = [
        {
            header: "Product",
            render: (bom) => bom.product.name,
        },
        {
            header: "Material Cost",
            accessor: "material_cost",
        },
        {
            header: "OverHead Cost",
            accessor: "material_cost",
        },
        {
            header: "Other Cost",
            accessor: "material_cost",
        },
        {
            header: "Create at",
            accessor: "created_at",
        },
        {
            header: "Update at",
            accessor: "update_at",
        },
        {
            header: "Action",
            render: (bom) => (
                <div className="d-flex flex-no-wrap gap-2">
                    <AuthorizeLink
                        className="btn btn-sm btn-soft-success"
                        ability="production.bill-of-material.index"
                        href={route("production.bill-of-material.show", bom.id)}
                    >
                        <i className="bx bxs-show font-size-16 align-middle"></i>
                    </AuthorizeLink>
                    <AuthorizeLink
                        className="btn btn-sm btn-soft-primary"
                        ability="production.bill-of-material.edit"
                        href={route("production.bill-of-material.edit", bom.id)}
                    >
                        <i className="bx bxs-edit font-size-16 align-middle"></i>
                    </AuthorizeLink>
                    <ConfirmDelete
                        ability="production.bill-of-material.delete"
                        url={route(
                            "production.bill-of-material.destroy",
                            bom.id
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
            <Head title="Production | BillOfMaterial | List - " />
            <TableContainer
                title="Bill Of Material"
                subTitle="View and manage BOM"
                count={bomCount}
                buttons={
                    <CreateBtn
                        ability="production.bill-of-material.create"
                        url={route("production.bill-of-material.create")}
                    />
                }
            >
                <Table columns={column} dataSource={billOfMaterials} />
            </TableContainer>
        </AuthLayout>
    );
}

export default List;
