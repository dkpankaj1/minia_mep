import ConfirmDelete from "@/components/ConfirmDelete";
import IsAuthorize from "@/components/IsAuthorize";
import Table from "@/Factory/TableFactory/Table";
import TableContainer from "@/Factory/TableFactory/TableContainer";
import AuthLayout from "@/Layouts/AuthLayout";
import { TColumnType } from "@/types/column.type";
import { TLinksType } from "@/types/links.type";
import { Head } from "@inertiajs/react";
import { useState } from "react";
import Create from "./Create";
import Edit from "./Edit";
interface WorkstationType {
    id: number;
    name: string;
    description: string;
    status: number;
}
interface PropsType {
    workstations: {
        data: WorkstationType[];
        links: TLinksType[];
    };
    wrkStnCount: number;
}

function List({ workstations, wrkStnCount }: PropsType) {
    const [showCreateForm, setShowCreateForm] = useState(false);
    const createFormToggler = () => setShowCreateForm(!showCreateForm);

    const columns: TColumnType<WorkstationType>[] = [
        {
            header: "Name",
            accessor: "name",
        },
        {
            header: "Description",
            accessor: "description",
        },
        {
            header: "Status",
            render: (workStation: WorkstationType) =>
                workStation.status === 1 ? "Active" : "In-active",
        },
        {
            header: "Action",
            render: (workStation: WorkstationType) => (
                <div className="d-flex flex-no-wrap gap-2">
                    <IsAuthorize ability={"workstation.edit"}>
                        <Edit workstation={workStation} />
                    </IsAuthorize>

                    <ConfirmDelete
                        ability="workstation.delete"
                        url={route("workstation.destroy", workStation.id)}
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
            <Head title={"WorkStation | List -"} />

            <TableContainer
                title="Workstation"
                subTitle="View and manage workstations"
                count={wrkStnCount}
                buttons={
                    <IsAuthorize ability={"workstation.index"}>
                        <button
                            className={`btn btn-light`}
                            onClick={() => setShowCreateForm(true)}
                        >
                            <i className="bx bx-plus me-1"></i> Add New
                        </button>
                    </IsAuthorize>
                }
            >
                <Table columns={columns} dataSource={workstations.data} />
                <Table.Pagination links={workstations.links} />
            </TableContainer>

            <Create isOpen={showCreateForm} toggler={createFormToggler} />
        </AuthLayout>
    );
}

export default List;
