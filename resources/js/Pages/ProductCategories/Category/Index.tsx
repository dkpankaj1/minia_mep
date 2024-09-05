import React, { memo } from "react";
import { Head } from "@inertiajs/react";

import AuthLayout from "@/Layouts/AuthLayout";
import { Card, CardBody, CardTableHeader } from "@/components/Card";

import ConfirmDelete from "@/components/ConfirmDelete";
import CreateForm from "./CreateForm";
import EditForm from "./EditForm";

import { usePermission } from "@/composable/usePermission";
import { TLinksType } from "@/types/links.type";
import TableFactory from "@/Factory/Table/TableFactory";

export interface ICategoryType {
    id: number;
    name: string;
    description: string;
}

interface IPropsType {
    categories: {
        data: Array<ICategoryType>;
        links: Array<TLinksType>;
    };
    categoryCount: number;
    queryParam: unknown;
}

const Index = ({
    categories,
    categoryCount,
    queryParam = null,
}: IPropsType) => {
    const { hasPermission } = usePermission();
    queryParam = queryParam || {};

    const columns = React.useMemo(
        () => [
            { header: "Name", accessor: "name" },
            {
                header: "description",
                accessor: null,
                render: (category: ICategoryType) => category.description,
            },
            // {
            //     header: "Action",
            //     accessor: null,
            //     render: (category: ICategoryType) => (
            //         <div className="d-flex flex-no-wrap gap-2">
            //             <div className="d-flex flex-no-wrap gap-2">
            //                 {hasPermission("category.edit") && (
            //                     <EditForm editedData={category} />
            //                 )}
            //                 <ConfirmDelete
            //                     ability="category.delete"
            //                     btnClass="btn btn-sm btn-soft-danger"
            //                     btnLabel={
            //                         <i className="bx bxs-trash font-size-16 align-middle"></i>
            //                     }
            //                     url={route("category.destroy", category.id)}
            //                 />
            //             </div>
            //         </div>
            //     ),
            // },
        ],
        [categories]
    );

    return (
        <AuthLayout>
            <Head title="Product | Category - " />

            <Card>
                <CardBody>
                    <CardTableHeader
                        title="Categories"
                        subTitle="View and Manage Category "
                        count={categoryCount}
                    >
                        {""}
                        {/* {hasPermission("category.create") && <CreateForm />} */}
                    </CardTableHeader>

                    <TableFactory
                        columns={columns}
                        dataSource={categories}
                        queryParam={queryParam}
                        url={route("category.index")}
                    />
                </CardBody>
            </Card>
        </AuthLayout>
    );
};

export default memo(Index);
