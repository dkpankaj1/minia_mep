import Badge from "@/components/Badge";
import Card from "@/components/Cards/Card";
import {
    CustomTable,
    TBody,
    TData,
    THead,
    THeader,
    TRow,
} from "@/components/Table";
import AuthLayout from "@/Layouts/AuthLayout";
import { Head, useForm, usePage } from "@inertiajs/react";
import { PageProp } from "@/types/global";
import { TSystemPagePropType } from "@/types/type";
import AuthorizeLink from "@/components/AuthorizeLink";

interface IUnitType {
    id: number;
    name: string;
    operator: string;
    operator_value: number;
    short_name: string;
    base_unit: Array<IUnitType> | null;
}

interface IMaterialType {
    id: number;
    name: string;
    code: string;
    quantity: number;
    cost: number;
    unit_cost: number;
    unit: IUnitType;
}

interface IBillOfMaterial {
    id: number;
    code: string;
    product: string;
    product_code: string;
    materials: Array<IMaterialType> | [];
    total: number;
    overhead_cost: number;
    other_cost: number;
}
interface IPagePropType extends PageProp {
    system: TSystemPagePropType;
}
interface IPropsType {
    billOfMaterial: IBillOfMaterial;
}
function Show({ billOfMaterial }: IPropsType) {
    console.log(billOfMaterial);
    const { system } = usePage<IPagePropType>().props;
    return (
        <AuthLayout>
            <Head title="Production | BillOfMaterial | Show - " />

            <Card>
                <Card.Body>
                    <Card.Title>View Bill Of Material</Card.Title>
                    <Card.Title.Description>
                        Show the detail of bill of material
                    </Card.Title.Description>

                    <hr />
                    <p className="mb-1">
                        BillOfMaterial Code : {billOfMaterial.code}
                    </p>
                    <p className="mb-1">
                        Product : {billOfMaterial.product} -{" "}
                        {billOfMaterial.product_code}{" "}
                    </p>
                    <hr />

                    <div className="mb-3 table-responsive">
                        <CustomTable className="no-wrap">
                            <THead className="table-secondary">
                                <TRow>
                                    <THeader style={{ width: "" }}>No.</THeader>
                                    <THeader style={{ width: "50%" }}>
                                        Product
                                    </THeader>

                                    <THeader style={{ width: "" }}>
                                        Code
                                    </THeader>
                                    <THeader style={{ width: "" }}>Qty</THeader>
                                    <THeader style={{ width: "" }}>
                                        Unit
                                    </THeader>
                                    <THeader style={{ width: "" }}>
                                        Subtotal ({system.currency.symbol})
                                    </THeader>
                                </TRow>
                            </THead>
                            <TBody>
                                {billOfMaterial.materials.map(
                                    (material, index) => {
                                        return (
                                            <TRow key={index}>
                                                <TData>{index + 1}</TData>
                                                <TData>
                                                    <span>{material.name}</span>
                                                </TData>
                                                <TData>
                                                    <span>{material.code}</span>
                                                </TData>
                                                <TData>
                                                    {material.quantity}{" "}
                                                    {material.unit.short_name}
                                                </TData>
                                                <TData>
                                                    <Badge className="font-size-14 fw-medium bg-success-subtle text-success">
                                                        {material.unit.name}
                                                    </Badge>
                                                </TData>
                                                <TData>
                                                    {(
                                                        material.quantity *
                                                        material.unit_cost
                                                    ).toFixed(2)}
                                                </TData>
                                            </TRow>
                                        );
                                    }
                                )}

                                <TRow>
                                    <TData colSpan="5">{""}</TData>
                                    <TData colSpan="2">
                                        <CustomTable className="table table-striped table-sm  mt-3">
                                            <TBody>
                                                <TRow>
                                                    <TData>
                                                        <b>
                                                            Total (
                                                            {
                                                                system.currency
                                                                    .symbol
                                                            }
                                                            )
                                                        </b>
                                                    </TData>
                                                    <TData>
                                                        {billOfMaterial.total.toFixed(
                                                            2
                                                        )}
                                                    </TData>
                                                </TRow>

                                                <TRow>
                                                    <TData>
                                                        <b>
                                                            Overhead cost +
                                                            Other cost (
                                                            {
                                                                system.currency
                                                                    .symbol
                                                            }{" "}
                                                            )
                                                        </b>
                                                    </TData>
                                                    <TData>
                                                        {billOfMaterial.overhead_cost.toFixed(
                                                            2
                                                        )}{" "}
                                                        +{" "}
                                                        {billOfMaterial.other_cost.toFixed(
                                                            2
                                                        )}
                                                    </TData>
                                                </TRow>

                                                <TRow>
                                                    <TData>
                                                        <b>
                                                            Grand Total (
                                                            {
                                                                system.currency
                                                                    .symbol
                                                            }
                                                            )
                                                        </b>
                                                    </TData>
                                                    <TData>
                                                        {(
                                                            billOfMaterial.total +
                                                            billOfMaterial.overhead_cost +
                                                            billOfMaterial.other_cost
                                                        ).toFixed(2)}
                                                    </TData>
                                                </TRow>
                                            </TBody>
                                        </CustomTable>
                                    </TData>
                                </TRow>
                            </TBody>
                        </CustomTable>
                    </div>
                </Card.Body>
                <Card.Footer>
                    <a
                        href={route(
                            "production.bill-of-material.print",
                            billOfMaterial.id
                        )}
                        target="_blank"
                        className="btn btn-success waves-effect waves-light me-1"
                    >
                        <i className="fa fa-print"></i>
                    </a>
                    <AuthorizeLink
                        ability="purchase.edit"
                        href={route(
                            "production.bill-of-material.edit",
                            billOfMaterial.id
                        )}
                        className="btn btn-primary w-md"
                    >
                        Edit
                    </AuthorizeLink>
                </Card.Footer>
            </Card>
        </AuthLayout>
    );
}

export default Show;
