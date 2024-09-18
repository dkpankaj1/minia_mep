import { Head, usePage } from "@inertiajs/react";
import Card from "@/components/Cards/Card";
import AuthLayout from "@/Layouts/AuthLayout";
import Badge from "@/components/Badge";
import { PageProp } from "@/types/global";
import { TSystemPagePropType } from "@/types/type";
import AuthorizeLink from "@/components/AuthorizeLink";

interface PropsType {
    productionOrder: {
        id: string;
        date: string;
        bom_id: string;
        bom_code: string;
        product_id: string;
        product: string;
        finance_year: string;
        warehouse: string;
        work_station: string;
        quantity: number;
        unit: string;
        estimated_cost: number;
        other_cost: number;
        start_at: string;
        end_at: string;
        status: string;
        user_id: string;
    };
}
interface PagePropsType extends PageProp {
    system: TSystemPagePropType;
}
type StatusType =
    | "planned"
    | "processing"
    | "in_progress"
    | "reject"
    | "complete";

function Show({ productionOrder }: PropsType) {
    const { system } = usePage<PagePropsType>().props;
    const getStatusStyle = (status: StatusType) => {
        switch (status) {
            case "planned":
                return "badge-soft-secondary px-3";
            case "processing":
                return "badge-soft-info";
            case "in_progress":
                return "badge-soft-primary";
            case "complete":
                return "badge-soft-success";
            case "reject":
                return "badge-soft-danger px-3";
        }
    };

    return (
        <AuthLayout>
            <Head title="Production | Production Order | Show - " />
            <Card>
                <Card.Header>
                    <h4 className="card-title">Show Production Order</h4>
                    <p className="card-title-desc">
                        View the detail of production order.
                    </p>
                </Card.Header>
                <Card.Body>
                    <div className="p-4 border rounded">
                        <div className="table-responsive">
                            <table className="table table-nowrap align-middle mb-0">
                                <tbody>
                                    <tr>
                                        <th
                                            scope="row"
                                            style={{ width: "100px" }}
                                        >
                                            ID
                                        </th>
                                        <td>
                                            <h5 className="font-size-15 mb-1">
                                                {productionOrder.id}
                                            </h5>
                                        </td>
                                    </tr>

                                    <tr>
                                        <th scope="row">Date</th>
                                        <td>
                                            <h5 className="font-size-15 mb-1">
                                                {productionOrder.date}
                                            </h5>
                                        </td>
                                    </tr>

                                    <tr>
                                        <th scope="row">BillOfMaterial</th>
                                        <td>
                                            <h5 className="font-size-15 mb-1">
                                                <AuthorizeLink
                                                    ability={
                                                        "production.bill-of-material.show"
                                                    }
                                                    href={route(
                                                        "production.bill-of-material.show",
                                                        productionOrder.bom_id
                                                    )}
                                                >
                                                    {productionOrder.bom_code}
                                                </AuthorizeLink>
                                            </h5>
                                        </td>
                                    </tr>

                                    <tr>
                                        <th scope="row">Product</th>
                                        <td>
                                            <h5 className="font-size-15 mb-1">
                                                <AuthorizeLink
                                                    ability={"product.index"}
                                                    href={route(
                                                        "product.show",
                                                        productionOrder.product_id
                                                    )}
                                                >
                                                    {productionOrder.product}
                                                </AuthorizeLink>
                                            </h5>
                                        </td>
                                    </tr>

                                    <tr>
                                        <th scope="row">Work Station</th>
                                        <td>
                                            <h5 className="font-size-15 mb-1">
                                                {productionOrder.work_station}
                                            </h5>
                                        </td>
                                    </tr>

                                    <tr>
                                        <th scope="row">Quantity</th>
                                        <td>
                                            <h5 className="font-size-15 mb-1">
                                                {productionOrder.quantity}{" "}
                                                {productionOrder.unit}
                                            </h5>
                                        </td>
                                    </tr>

                                    <tr>
                                        <th scope="row">
                                            Cost ({system.currency.symbol})
                                        </th>
                                        <td>
                                            <h5 className="font-size-15 mb-1">
                                                {productionOrder.estimated_cost *
                                                    productionOrder.quantity}
                                            </h5>
                                        </td>
                                    </tr>

                                    <tr>
                                        <th scope="row">
                                            Extra Cost ({system.currency.symbol}
                                            )
                                        </th>
                                        <td>
                                            <h5 className="font-size-15 mb-1">
                                                {productionOrder.other_cost *
                                                    productionOrder.quantity}
                                            </h5>
                                        </td>
                                    </tr>

                                    <tr>
                                        <th scope="row">
                                            Total Cost ({system.currency.symbol}
                                            )
                                        </th>
                                        <td>
                                            <h5 className="font-size-15 mb-1">
                                                {(productionOrder.estimated_cost +
                                                    productionOrder.other_cost) *
                                                    productionOrder.quantity}
                                            </h5>
                                        </td>
                                    </tr>

                                    <tr>
                                        <th scope="row">Start AT</th>
                                        <td>
                                            <h5 className="font-size-15 mb-1">
                                                {productionOrder.start_at}
                                            </h5>
                                        </td>
                                    </tr>

                                    <tr>
                                        <th scope="row">End AT</th>
                                        <td>
                                            <h5 className="font-size-15 mb-1">
                                                {productionOrder.end_at}
                                            </h5>
                                        </td>
                                    </tr>

                                    <tr>
                                        <th scope="row">Status</th>
                                        <td>
                                            <Badge
                                                className={` p-2 ${getStatusStyle(
                                                    productionOrder.status as StatusType
                                                )}`}
                                            >
                                                {productionOrder.status.toUpperCase()}
                                            </Badge>
                                        </td>
                                    </tr>

                                    <tr>
                                        <th scope="row">User</th>
                                        <td>
                                            <h5 className="font-size-15 mb-1">
                                                {productionOrder.user_id}
                                            </h5>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </Card.Body>
                <Card.Footer>
                    <div className="d-flex justify-content-start">
                        <AuthorizeLink
                            className="btn btn-primary w-md"
                            ability={"production.production-order.edit"}
                            href={route(
                                "production.production-order.edit",
                                productionOrder.id
                            )}
                        >
                            Edit
                        </AuthorizeLink>
                    </div>
                </Card.Footer>
            </Card>
        </AuthLayout>
    );
}

export default Show;
