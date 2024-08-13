import React, { useMemo } from "react";
import AuthLayout from "@/Layouts/AuthLayout";
import { Head, usePage } from "@inertiajs/react";
import { Card, CardBody } from "@/components/Card";

import useDownloadFile from "@/hooks/useDownloadFile";

import AuthorizeLink from "@/components/AuthorizeLink";
import Badge from "@/components/Badge";
import ConfirmDelete from "@/components/ConfirmDelete";
import TableTopbar from "@/components/TableTopbar";

import TableFactory from "@/Factory/Table/TableFactory";
import { TLinksType } from "@/types/links.type";
import { PageProp } from "@/types/global";

interface IProductType {
    id: number;
    code: string;
    barcode_symbology: string;
    category: string;
    sub_category: string;
    brand: string;
    name: string;
    unit: string;
    quantity: number;
    purchase_unit: string;
    sale_unit: string;
    cost: number;
    price: number;
    tax_method: string;
    net_tax: number;
    is_batch: number;
    stock_alert: number;
    image: string;
    is_active: number;
    description: string;
}

interface IPropsType {
    products: {
        data: Array<IProductType>;
        links: Array<TLinksType>;
    };
    productCount: number;
    queryParam: unknown;
}

interface IPagePropsType extends PageProp {
    system: TSystemPagePropType;
}

function List({ products, productCount, queryParam = null }: IPropsType) {
    console.log(products.data);
    const { system } = usePage<IPagePropsType>().props;
    queryParam = queryParam || {};

    const { isLoading, downloadFile } = useDownloadFile(
        route("product.export"),
        "products.xlsx"
    );

    const columns = useMemo(
        () => [
            {
                header: "#",
                accessor: "image",
                render: (product: IProductType) => (
                    <img
                        src={product.image}
                        className="avatar-sm h-auto d-block rounded"
                        alt="Product"
                    />
                ),
            },
            { header: "Code", accessor: "code" },
            { header: "Name", accessor: "name" },
            { header: "Category", accessor: "category" },
            { header: "Sub Category", accessor: "sub_category" },
            { header: "Brand", accessor: "brand" },
            { header: "Unit", accessor: "unit" },
            {
                header: "Quantity",
                accessor: "quantity",
                render: (product: IProductType) => (
                    <Badge
                        className={`rounded-pill font-size-12 fw-medium bg-info-subtle text-info`}
                    >
                        {product.quantity}
                    </Badge>
                ),
            },
            { header: `Cost (${system.currency.symbol})`, accessor: "cost" },
            { header: `Price (${system.currency.symbol})`, accessor: "price" },
            {
                header: "Status",
                accessor: "is_active",
                render: (product: IProductType) => (
                    <Badge
                        className={`rounded-pill font-size-12 fw-medium ${
                            product.is_active
                                ? " bg-success-subtle text-success"
                                : " bg-danger-subtle text-danger"
                        }`}
                    >
                        {product.is_active ? "Active" : "Inactive"}
                    </Badge>
                ),
            },
            {
                header: "Action",
                accessor: null,
                render: (product: IProductType) => (
                    <div className="d-flex flex-no-wrap gap-2">
                        <AuthorizeLink
                            className="btn btn-sm btn-soft-success"
                            ability="product.index"
                            href={route("product.show", product.id)}
                        >
                            <i className="bx bxs-show font-size-16 align-middle"></i>
                        </AuthorizeLink>
                        <AuthorizeLink
                            className="btn btn-sm btn-soft-primary"
                            ability="product.edit"
                            href={route("product.edit", product.id)}
                        >
                            <i className="bx bxs-edit font-size-16 align-middle"></i>
                        </AuthorizeLink>
                        <ConfirmDelete
                            ability="product.delete"
                            url={route("product.destroy", product.id)}
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
        <AuthLayout>
            <Head title="Product | List - " />

            <Card>
                <CardBody>
                    <TableTopbar
                        title="Product List"
                        subTitle="View and Manage Product"
                        count={productCount}
                        url={route("product.create")}
                        ability={"product.create"}
                    />

                    <div className="d-flex my-3 gap-1 justify-content-end">
                        <AuthorizeLink
                            as="button"
                            ability={"product.index"}
                            className="btn btn-success w-xs"
                            onClick={downloadFile}
                            disabled={isLoading}
                        >
                            {isLoading ? "Exporting.." : "Export"}
                        </AuthorizeLink>
                    </div>

                    {/* table Factory :: Begin */}

                    <TableFactory
                        columns={columns}
                        dataSource={products}
                        url={route("product.index")}
                        queryParam={queryParam}
                    />

                    {/* table Factory :: End */}
                </CardBody>
            </Card>
        </AuthLayout>
    );
}

export default List;
