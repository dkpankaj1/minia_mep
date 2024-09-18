import AuthorizeLink from "@/components/AuthorizeLink";
import Badge from "@/components/Badge";
import ConfirmDelete from "@/components/ConfirmDelete";
import CreateBtn from "@/components/CreateBtn";
import Table from "@/Factory/TableFactory/Table";
import TableContainer from "@/Factory/TableFactory/TableContainer";
import AuthLayout from "@/Layouts/AuthLayout";
import { TColumnType } from "@/types/column.type";
import { Head } from "@inertiajs/react";

interface StockReceivesType {
    id: number;
    code: string;
    date: string;
    productionOrder: {
        id: number;
        code: string;
    };
    status: string;
}

type StatusType = "generate" | "complete" | "reject";

interface PropsType {
    stockReceives: {
        data: StockReceivesType[];
    };
    stockReceiveCount: number;
}

function List({ stockReceives, stockReceiveCount }: PropsType) {
    console.log(stockReceives)
    const getStatusStyle = (status: StatusType) => {
        switch (status) {
            case "generate":
                return "badge-soft-primary";
            case "complete":
                return "badge-soft-success";
            case "reject":
                return "badge-soft-danger px-3";
        }
    };

    // const columns: TColumnType<StockReceivesType>[] = [
    //     {
    //         header: "Date",
    //         accessor: "date",
    //     },
    //     {
    //         header: "Code",
    //         accessor: "code",
    //     },
    //     {
    //         header: "Production Order",
    //         render: (sr) => sr.code,
    //     },
    //     {
    //         header: "Status",
    //         render: (sr) => (
    //             <Badge
    //                 className={` p-2 ${getStatusStyle(
    //                     sr.status as StatusType
    //                 )}`}
    //             >
    //                 {sr.status.toUpperCase()}
    //             </Badge>
    //         ),
    //     },
    //     {
    //         header: "Action",
    //         render: (sr) => (
    //             <div className="d-flex flex-no-wrap gap-2">
    //                 <AuthorizeLink
    //                     className="btn btn-sm btn-soft-success"
    //                     ability="production.stock-received.index"
    //                     href={route("production.stock-received.show", sr.id)}
    //                 >
    //                     <i className="bx bxs-show font-size-16 align-middle"></i>
    //                 </AuthorizeLink>
    //                 <AuthorizeLink
    //                     className="btn btn-sm btn-soft-primary"
    //                     ability="production.stock-received.edit"
    //                     href={route("production.stock-received.edit", sr.id)}
    //                 >
    //                     <i className="bx bxs-edit font-size-16 align-middle"></i>
    //                 </AuthorizeLink>
    //                 <ConfirmDelete
    //                     ability="production.stock-received.delete"
    //                     url={route("production.stock-received.destroy", sr.id)}
    //                     btnClass="btn btn-sm btn-soft-danger"
    //                     btnLabel={
    //                         <i className="bx bxs-trash font-size-16 align-middle"></i>
    //                     }
    //                 />
    //             </div>
    //         ),
    //     },
    // ];
    // return (
    //     <AuthLayout>
    //         <Head title="Stock Received | List -" />
    //         <TableContainer
    //             title="Stock Received List"
    //             subTitle="view and manage stock received"
    //             count={stockReceiveCount}
    //             buttons={
    //                 <CreateBtn
    //                     ability={"production.stock-received.create"}
    //                     url={route("production.stock-received.create")}
    //                 />
    //             }
    //         >
    //             <Table dataSource={stockReceives.data} columns={columns} />
    //         </TableContainer>
    //     </AuthLayout>
    // );
}

export default List;
