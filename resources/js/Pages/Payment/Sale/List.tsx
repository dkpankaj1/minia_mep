import AuthLayout from "@/Layouts/AuthLayout";
import AuthorizeLink from "@/components/AuthorizeLink";
import ConfirmDelete from "@/components/ConfirmDelete";
import { PageProp } from "@/types/global";
import { TSystemPagePropType } from "@/types/type";
import { Head, usePage } from "@inertiajs/react";
import TableContainer from "@/Factory/TableFactory/TableContainer";
import Table from "@/Factory/TableFactory/Table";
import { TLinksType } from "@/types/links.type";
import { TColumnType } from "@/types/column.type";
import LimitFilter from "@/Factory/TableFactory/Filters/LimitFilter";
import { TQueryParam } from "@/types/queryParam.type";
import useTableFilters from "@/Factory/TableFactory/hooks/useTableFilters";
import CreateBtn from "@/components/CreateBtn";
import FormSelect from "@/components/FormSelect";

interface IPagePropsType extends PageProp {
    system: TSystemPagePropType;
}

interface IPaymentType {
    id: number;
    date: string;
    sale_id: number;
    invoice_id: string;
    customer: string;
    email: string;
    status: string;
    method: string;
    amount: number;
    user: string;
}

interface IPropsType {
    payments: {
        data: Array<IPaymentType>;
        links: Array<TLinksType>;
    };
    paymentCount: number;
    customers: Array<{
        id: number;
        name: string;
        email: string;
    }>;
    queryParam?: TQueryParam;
}

const List = ({
    payments,
    paymentCount,
    customers,
    queryParam = {},
}: IPropsType) => {
    const { system } = usePage<IPagePropsType>().props;

    const {
        searchFieldChange,
        applyFilters,
        limitFieldChange,
        queryParam: param,
        clearFilters,
    } = useTableFilters(route("sale.payment.index"), queryParam);

    const columns: Array<TColumnType<IPaymentType>> = [
        { header: "Invoice ID", accessor: "invoice_id" },
        { header: "Date", accessor: "date" },
        { header: "Customer", accessor: "customer" },
        { header: "Email", accessor: "email" },
        {
            header: `Amount (${system.currency.symbol})`,
            accessor: "amount",
        },
        { header: "Payment Method", accessor: "method" },
        { header: "Payment Status", accessor: "status" },
        { header: "User", accessor: "user" },
        {
            header: "Action",
            accessor: null,
            render: (payment: IPaymentType) => (
                <div className="d-flex flex-no-wrap gap-2">
                    <AuthorizeLink
                        className="btn btn-sm btn-soft-primary"
                        ability="product.edit"
                        href={route("sale.payment.edit", payment.id)}
                    >
                        <i className="bx bxs-edit font-size-16 align-middle"></i>
                    </AuthorizeLink>
                    <ConfirmDelete
                        ability="product.delete"
                        url={route("sale.payment.destroy", payment.id)}
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
            <Head title="Sale | Payment | List - " />
            <TableContainer
                title="Payments"
                subTitle="View and Manage Payment"
                count={paymentCount}
                buttons={
                    <CreateBtn
                        url={route("sale.payment.create")}
                        ability="sale.payment.create"
                    />
                }
            >
                <Table.Filter
                    limitFilter={
                        <LimitFilter
                            limitFieldChange={limitFieldChange}
                            limit={param?.limit || ""}
                        />
                    }
                >
                    <div className="mb-3">
                        <label htmlFor="Invoice_id">Invoice</label>
                        <input
                            type="text"
                            value={param?.invoice_id || ""}
                            placeholder="Enter Invoice Id"
                            onChange={(e) =>
                                searchFieldChange("invoice_id", e.target.value)
                            }
                            className="form-control"
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="date">Date</label>
                        <input
                            type="date"
                            value={param?.date || ""}
                            onChange={(e) =>
                                searchFieldChange("date", e.target.value)
                            }
                            className="form-control"
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="customer">Customer</label>
                        <select
                            className="form-select"
                            value={param?.customer || ""}
                            onChange={(e) =>
                                searchFieldChange("customer", e.target.value)
                            }
                        >
                            <option value={""}>---select---</option>
                            {customers.map((customer) => (
                                <option
                                    key={customer.id}
                                    value={customer.id}
                                >{`${customer.name} - ${customer.email}`}</option>
                            ))}
                        </select>
                    </div>
                    <div className="d-flex gap-1 mb-3">
                        <button
                            className="btn btn-primary w-100"
                            onClick={applyFilters}
                        >
                            Filter
                        </button>
                        <button
                            className="btn btn-danger w-100"
                            onClick={clearFilters}
                        >
                            Clear
                        </button>
                    </div>
                </Table.Filter>
                <Table dataSource={payments.data} columns={columns} />
                <Table.Pagination links={payments.links} />
            </TableContainer>
        </AuthLayout>
    );
};

export default List;
