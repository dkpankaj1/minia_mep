import React from "react";
import AuthLayout from "@/Layouts/AuthLayout";
import { Head, usePage } from "@inertiajs/react";
import AuthorizeLink from "@/components/AuthorizeLink";
import { Card, CardBody, CardFooter, CardHeader } from "@/components/Card";
import { CustomTable, TBody, TRow, TData } from "@/components/Table";
import { PageProp } from "@/types/global";

interface IBrandType {
    id: number;
    name: string;
}
interface ICategoryType {
    id: number;
    name: string;
}
interface IUnitType {
    id: number;
    name: string;
    short_name: string;
}
interface IBatchType {
    id: number;
    batch: string;
    expiration: string;
    quantity: number;
}
interface IWarehouseType {
    id: number;
    quantity: number;
    warehouse: { name: string };
    batches?: Array<IBatchType>;
}

interface IProduct {
    id: number;
    code: string;
    barcode_symbology: string;
    category_id: number;
    sub_category_id: number;
    brand_id: number;
    name: string;
    unit_id: number;
    purchase_unit_id: number;
    sale_unit_id: number;
    cost: number;
    price: number;
    tax_method: number;
    net_tax: number;
    is_batch: number;
    expiration_alert: number;
    stock_alert: number;
    image: string;
    is_active: boolean;
    description: string;
    brand: IBrandType;
    category: ICategoryType;
    unit: IUnitType;
    purchase_unit: IUnitType;
    sale_unit: IUnitType;
    sub_category: ICategoryType;
    product_warehouses: Array<IWarehouseType>;
}

interface IPropsType {
    product: IProduct;
}
interface IPageProps extends PageProp {
    system: TSystemPagePropType;
}

function Show({ product }: IPropsType) {
    const { system } = usePage<IPageProps>().props;

    return (
        <AuthLayout>
            <Head title="Product | Show - " />

            <Card>
                <CardHeader>
                    <h4 className="card-title">Show Product</h4>
                    <p className="card-title-desc">
                        View detailed product information and specifications.
                    </p>
                </CardHeader>

                <CardBody>
                    <div className="row">
                        <div className="col-md-8">
                            <div className="row">
                                <div className="col-md-2">
                                    <div>
                                        <h5 className="font-size-15">
                                            Product Name:
                                        </h5>
                                    </div>
                                </div>
                                <div className="col-md">
                                    <div className="text-muted">
                                        {product.name}
                                    </div>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-md-2">
                                    <div>
                                        <h5 className="font-size-15">
                                            Product Code:
                                        </h5>
                                    </div>
                                </div>
                                <div className="col-md">
                                    <div className="text-muted">
                                        {product.code}
                                    </div>
                                </div>
                            </div>

                            <div className="row mt-2">
                                <div className="col-md-2">
                                    <div>
                                        <h5 className="font-size-15">
                                            Brand Name:
                                        </h5>
                                    </div>
                                </div>
                                <div className="col-md">
                                    <div className="text-muted">
                                        {product.brand.name}
                                    </div>
                                </div>
                            </div>

                            <div className="row mt-2">
                                <div className="col-md-2">
                                    <div>
                                        <h5 className="font-size-15">
                                            Category:
                                        </h5>
                                    </div>
                                </div>
                                <div className="col-md">
                                    <div className="text-muted">
                                        {product.category.name}
                                    </div>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-md-2">
                                    <div>
                                        <h5 className="font-size-15">
                                            Sub Category:
                                        </h5>
                                    </div>
                                </div>
                                <div className="col-md">
                                    <div className="text-muted">
                                        {product.sub_category.name}
                                    </div>
                                </div>
                            </div>

                            <div className="row mb-2">
                                <div className="col-md-2">
                                    <div>
                                        <h5 className="font-size-15">
                                            Barcode Symbology:
                                        </h5>
                                    </div>
                                </div>
                                <div className="col-md">
                                    <div className="text-muted">
                                        {product.barcode_symbology}
                                    </div>
                                </div>
                            </div>

                            <div className="row mt-2">
                                <div className="col-md-2">
                                    <div>
                                        <h5 className="font-size-15">Cost:</h5>
                                    </div>
                                </div>
                                <div className="col-md">
                                    <div className="text-muted">
                                        {product.cost}
                                        {system.currency.symbol}
                                    </div>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-md-2">
                                    <div>
                                        <h5 className="font-size-15">Price:</h5>
                                    </div>
                                </div>
                                <div className="col-md">
                                    <div className="text-muted">
                                        {product.price}
                                        {system.currency.symbol}
                                    </div>
                                </div>
                            </div>

                            <div className="row mt-2">
                                <div className="col-md-2">
                                    <div>
                                        <h5 className="font-size-15">
                                            Product Unit:
                                        </h5>
                                    </div>
                                </div>
                                <div className="col-md">
                                    <div className="text-muted">
                                        {product.unit.name}
                                    </div>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-md-2">
                                    <div>
                                        <h5 className="font-size-15">
                                            Sale Unit:
                                        </h5>
                                    </div>
                                </div>
                                <div className="col-md">
                                    <div className="text-muted">
                                        {product.sale_unit.name}
                                    </div>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-md-2">
                                    <div>
                                        <h5 className="font-size-15">
                                            Purchase Unit:
                                        </h5>
                                    </div>
                                </div>
                                <div className="col-md">
                                    <div className="text-muted">
                                        {product.purchase_unit.name}
                                    </div>
                                </div>
                            </div>

                            <div className="row mt-2">
                                <div className="col-md-2">
                                    <div>
                                        <h5 className="font-size-15">
                                            Stock Alert:
                                        </h5>
                                    </div>
                                </div>
                                <div className="col-md">
                                    <div className="text-muted">
                                        {product.stock_alert}
                                        {product.unit.short_name}
                                    </div>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-md-2">
                                    <div>
                                        <h5 className="font-size-15">
                                            Expiration Alert:
                                        </h5>
                                    </div>
                                </div>
                                <div className="col-md">
                                    <div className="text-muted">
                                        {product.expiration_alert} {" Day"}
                                    </div>
                                </div>
                            </div>

                            <div className="row mt-2">
                                <div className="col-md-2">
                                    <div>
                                        <h5 className="font-size-15">
                                            Tex Method:
                                        </h5>
                                    </div>
                                </div>
                                <div className="col-md">
                                    <div className="text-muted">
                                        {product.tax_method == 1
                                            ? "Exclusive"
                                            : "Inclusive"}
                                    </div>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-md-2">
                                    <div>
                                        <h5 className="font-size-15">
                                            Orders Tex:
                                        </h5>
                                    </div>
                                </div>
                                <div className="col-md">
                                    <div className="text-muted">
                                        {product.net_tax} {" %"}
                                    </div>
                                </div>
                            </div>

                            <div className="row mt-2">
                                <div className="col-md-2">
                                    <div>
                                        <h5 className="font-size-15">
                                            Batch And Expiration:
                                        </h5>
                                    </div>
                                </div>
                                <div className="col-md">
                                    <div className="text-muted">
                                        {product.is_batch ? "YES" : "NO"}
                                    </div>
                                </div>
                            </div>

                            <div className="row mt-2">
                                <div className="col-md-2">
                                    <div>
                                        <h5 className="font-size-15">
                                            Active:
                                        </h5>
                                    </div>
                                </div>
                                <div className="col-md">
                                    <div className="text-muted">
                                        {product.is_active
                                            ? "Active"
                                            : "InActive"}
                                    </div>
                                </div>
                            </div>

                            <div className="row mt-2">
                                <div className="col-md-2">
                                    <div>
                                        <h5 className="font-size-15">
                                            Description:
                                        </h5>
                                    </div>
                                </div>
                                <div className="col-md">
                                    <div className="text-muted">
                                        {product.description}
                                    </div>
                                </div>
                            </div>

                            <div className="row mt-2">
                                <div className="col-md-2">
                                    <div>
                                        <h5 className="font-size-15">
                                            Warehouses:
                                        </h5>
                                    </div>
                                </div>
                                <div className="col-md">
                                    <div className="table-responsive">
                                        {product.product_warehouses.map(
                                            (product_warehouse, index) => {
                                                return (
                                                    <table
                                                        className="table table-bordered table-sm"
                                                        key={index}
                                                    >
                                                        <tbody>
                                                            <tr>
                                                                <th colSpan={6}>
                                                                    {
                                                                        product_warehouse
                                                                            .warehouse
                                                                            .name
                                                                    }
                                                                </th>
                                                            </tr>

                                                            <tr>
                                                                <th colSpan={6}>
                                                                    Available :{" "}
                                                                    {
                                                                        product_warehouse.quantity
                                                                    }
                                                                    {
                                                                        product
                                                                            .unit
                                                                            .short_name
                                                                    }
                                                                </th>
                                                            </tr>
                                                            {product.is_batch ===
                                                                1 && (
                                                                <tr>
                                                                    <th>
                                                                        Batch
                                                                    </th>
                                                                    <th>
                                                                        Quantity
                                                                    </th>
                                                                    <th>
                                                                        Expiration
                                                                    </th>
                                                                </tr>
                                                            )}

                                                            {product_warehouse.batches &&
                                                                product_warehouse.batches.map(
                                                                    (
                                                                        batch,
                                                                        index
                                                                    ) => {
                                                                        return (
                                                                            <tr
                                                                                key={
                                                                                    index
                                                                                }
                                                                            >
                                                                                <td>
                                                                                    {
                                                                                        batch.batch
                                                                                    }
                                                                                </td>
                                                                                <td>
                                                                                    {
                                                                                        batch.quantity
                                                                                    }
                                                                                    {
                                                                                        product
                                                                                            .unit
                                                                                            .short_name
                                                                                    }
                                                                                </td>
                                                                                <td>
                                                                                    {
                                                                                        batch.expiration
                                                                                    }
                                                                                </td>
                                                                            </tr>
                                                                        );
                                                                    }
                                                                )}
                                                        </tbody>
                                                    </table>
                                                );
                                            }
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-4">
                            <img
                                src={product.image}
                                alt="Product Image"
                                className="img-fluid"
                                style={{
                                    maxWidth: "200px",
                                    maxHeight: "100%",
                                }}
                            />
                        </div>
                    </div>
                </CardBody>

                <CardFooter>
                    <AuthorizeLink
                        ability={"product.edit"}
                        href={route("product.edit", product.id)}
                        className="btn btn-primary px-4"
                    >
                        Edit
                    </AuthorizeLink>
                </CardFooter>
            </Card>
        </AuthLayout>
    );
}

export default Show;
