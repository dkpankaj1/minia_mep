import AuthorizeLink from "@/components/AuthorizeLink";
import { Card, CardBody } from "@/components/Card";
import ConfirmDelete from "@/components/ConfirmDelete";
import TableTopbar from "@/components/TableTopbar";
import TableFactory from "@/Factory/Table/TableFactory";
import AuthLayout from "@/Layouts/AuthLayout";
import { TColumnType } from "@/types/column.type";
import { PageProp } from "@/types/global";
import { TLinksType } from "@/types/links.type";
import { TSystemPagePropType } from "@/types/type";
import { Head, usePage } from "@inertiajs/react";

interface BillOfMaterialType {
    id: number;
    product: string;
    material_cost: number;
    overhead_cost: number;
    other_cost: number;
    grand_total: number;
    created_at: string;
    updated_at: string;
}
interface IPagePropType extends PageProp {
    system: TSystemPagePropType;
}
interface IPageProps {
    billOfMaterials: {
        data: BillOfMaterialType[];
        links: TLinksType[];
    };
    bomCount: number;
    queryParam: { search?: string; limit?: number } | null;
}

function List({ billOfMaterials, bomCount, queryParam = null }: IPageProps) {
    queryParam = queryParam || {};
    const { system } = usePage<IPagePropType>().props;
    const column: Array<TColumnType<BillOfMaterialType>> = [
        {
            header: "Product",
            render: (bom) => bom.product,
        },
        {
            header: `Material Cost (${system.currency.symbol})`,
            accessor: "material_cost",
        },
        {
            header: `OverHead Cost (${system.currency.symbol})`,
            accessor: "overhead_cost",
        },
        {
            header: `Other Cost (${system.currency.symbol})`,
            accessor: "other_cost",
        },
        {
            header: `Grand Cost (${system.currency.symbol})`,
            render: (bom) =>
                bom.material_cost + bom.overhead_cost + bom.other_cost,
        },
        {
            header: "Create at",
            accessor: "created_at",
        },
        {
            header: "Update at",
            accessor: "updated_at",
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

            <Card>
                <CardBody>
                    <TableTopbar
                        title="Bill Of Material"
                        subTitle="View and manage BOM"
                        count={bomCount}
                        url={route("production.bill-of-material.create")}
                        ability={"production.bill-of-material.create"}
                    />

                    {/* table Factory :: Begin */}
                    <TableFactory
                        columns={column}
                        dataSource={billOfMaterials}
                        url={route("production.bill-of-material.index")}
                        queryParam={queryParam}
                    />

                    {/* table Factory :: End */}
                </CardBody>
            </Card>
        </AuthLayout>
    );
}

export default List;
