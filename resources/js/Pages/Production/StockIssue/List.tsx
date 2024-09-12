import AuthorizeLink from "@/components/AuthorizeLink";
import ConfirmDelete from "@/components/ConfirmDelete";
import CreateBtn from "@/components/CreateBtn";
import Table from "@/Factory/TableFactory/Table";
import TableContainer from "@/Factory/TableFactory/TableContainer";
import AuthLayout from "@/Layouts/AuthLayout";
import { TColumnType } from "@/types/column.type";
import { TLinksType } from "@/types/links.type";
import { Head } from "@inertiajs/react";

interface StockIssueType {
    id: number;
    code: string;
    date: String;
    productionOrder: string;
    statue: String;
    user: string;
}
interface PropsType {
    stockIssues: {
        data: StockIssueType[];
        links: TLinksType[];
    };
}

function List({ stockIssues }: PropsType) {
    const columns: TColumnType<StockIssueType>[] = [
        {
            header: "Date",
            accessor: "date",
        },
        {
            header: "Code",
            accessor: "code",
        },

        {
            header: "Production Order",
            accessor: "productionOrder",
        },

        {
            header: "Status",
            accessor: "statue",
        },

        {
            header: "User",
            accessor: "user",
        },
        {
            header: "PDF",
            render: (stockIssue) => (
                <div className="d-flex flex-no-wrap gap-2">
                    <a
                        className="btn btn-sm btn-soft-secondary"
                        // ability="production.stock-issue.print"
                        href={route(
                            "production.stock-issue.print",
                            stockIssue.id
                        )}
                        target={"_blank"}
                    >
                        <i className="bx bx-download font-size-16 align-middle"></i>
                    </a>
                </div>
            ),
        },
        {
            header: "Action",
            render: (stockIssue) => (
                <div className="d-flex flex-no-wrap gap-2">
                    <AuthorizeLink
                        className="btn btn-sm btn-soft-success"
                        ability="production.stock-issue.index"
                        href={route(
                            "production.stock-issue.show",
                            stockIssue.id
                        )}
                    >
                        <i className="bx bxs-show font-size-16 align-middle"></i>
                    </AuthorizeLink>
                    <AuthorizeLink
                        className="btn btn-sm btn-soft-primary"
                        ability="production.stock-issue.edit"
                        href={route(
                            "production.stock-issue.edit",
                            stockIssue.id
                        )}
                    >
                        <i className="bx bxs-edit font-size-16 align-middle"></i>
                    </AuthorizeLink>
                    <ConfirmDelete
                        ability="production.stock-issue"
                        url={route(
                            "production.stock-issue.destroy",
                            stockIssue.id
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
            <Head title="Production | Stock Issue | List -" />
            <TableContainer
                title="Stock Issue"
                subTitle="View and manage stock issue for production"
                buttons={
                    <CreateBtn
                        ability={"production.stock-issue.create"}
                        url={route("production.stock-issue.create")}
                    />
                }
            >
                <Table columns={columns} dataSource={stockIssues.data} />
                <Table.Pagination links={stockIssues.links} />
            </TableContainer>
        </AuthLayout>
    );
}

export default List;
