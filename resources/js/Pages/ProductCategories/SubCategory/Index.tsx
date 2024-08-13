import React, { memo, useMemo } from "react";
import { Head } from "@inertiajs/react";

import AuthLayout from "@/Layouts/AuthLayout";
import { Card, CardTableHeader, CardBody } from "@/components/Card";
import {
    CustomTable,
    TBody,
    THead,
    THeader,
    TRow,
    TData,
} from "@/components/Table";
import ConfirmDelete from "@/components/ConfirmDelete";
import CreateForm from "./CreateForm";
import EditForm from "./EditForm";

import TableFactory from "@/Factory/Table/TableFactory";

import { usePermission } from "@/composable/usePermission";
import { TLinksType } from "@/types/links.type";

export type TCategoryType = {
    id: number;
    name: string;
    description: string;
};
export type TSubCategoryType = {
    id: number;
    name: string;
    description: string;
    category_id: number;
    category: TCategoryType;
};

interface IPageProps {
    subCategories: {
        data: Array<TSubCategoryType>;
        links: Array<TLinksType>;
    };
    subCategoryCount: number;
    categories: Array<TCategoryType>;
    queryParam: unknown;
}

const Index = ({
    subCategories,
    subCategoryCount,
    categories,
    queryParam = null,
}: IPageProps): React.ReactNode => {
    const { hasPermission } = usePermission();
    queryParam = queryParam || {};

    const columns = React.useMemo(
        () => [
            { header: "Name", accessor: "name" },
            {
                header: "Category",
                accessor: null,
                render: (subCategory: TSubCategoryType) =>
                    subCategory.category.name,
            },
            {
                header: "description",
                accessor: null,
                render: (subCategory: TSubCategoryType) =>
                    subCategory.description,
            },
            {
                header: "Action",
                accessor: null,
                render: (subCategory: TSubCategoryType) => (
                    <div className="d-flex flex-no-wrap gap-2">
                        {hasPermission("sub-category.edit") && (
                            <EditForm
                                editedData={subCategory}
                                categories={categories}
                            />
                        )}
                        <ConfirmDelete
                            ability="sub-category.delete"
                            btnClass="btn btn-sm btn-soft-danger"
                            btnLabel={
                                <i className="bx bxs-trash font-size-16 align-middle"></i>
                            }
                            url={route("sub-category.destroy", subCategory.id)}
                        />
                    </div>
                ),
            },
        ],
        [subCategories]
    );

    return (
        <AuthLayout>
            <Head title="Product | Sub Category - " />

            <Card>
                <CardBody>
                    <CardTableHeader
                        title="Sub Category"
                        subTitle="View and Manage Sub Category "
                        count={subCategoryCount}
                    >
                        {hasPermission("sub-category.create") && (
                            <CreateForm categories={categories} />
                        )}
                    </CardTableHeader>

                    <TableFactory
                        columns={columns}
                        dataSource={subCategories}
                        queryParam={queryParam}
                        url={route("sub-category.index")}
                    />
                </CardBody>
            </Card>
        </AuthLayout>
    );
};

export default memo(Index);
