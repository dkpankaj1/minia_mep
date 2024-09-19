import AuthorizeLink from "@/components/AuthorizeLink";
import Badge from "@/components/Badge";
import Card from "@/components/Cards/Card";
import AuthLayout from "@/Layouts/AuthLayout";
import { Head } from "@inertiajs/react";
import React from "react";

interface StockReceiveType {
    id: number;
    code: string;
    date: string;
    production_order: {
        id: number;
        code: string;
        status: string;
    };
    batch: string;
    expiration: string;
    status: string;
    remark: string;
}

type StatusType = "generate" | "complete" | "reject";

interface PropsType {
    stockReceive: StockReceiveType;
}

function Show({ stockReceive }: PropsType) {
    console.log(stockReceive);

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

    return (
        <AuthLayout>
            <Head title="Stock Received | Show - " />
            <Card>
                <Card.Header>
                    <h4 className="card-title">Show Stock Received</h4>
                    <p className="card-title-desc">
                        SHow the detail of a stock received.
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
                                                {stockReceive.id}
                                            </h5>
                                        </td>
                                    </tr>

                                    <tr>
                                        <th scope="row">Date</th>
                                        <td>
                                            <h5 className="font-size-15 mb-1">
                                                {stockReceive.date}
                                            </h5>
                                        </td>
                                    </tr>

                                    <tr>
                                        <th scope="row">Code</th>
                                        <td>
                                            <h5 className="font-size-15 mb-1">
                                                {stockReceive.code}
                                            </h5>
                                        </td>
                                    </tr>

                                    <tr>
                                        <th scope="row">Production Order</th>
                                        <td>
                                            <h5 className="font-size-15 mb-1">
                                                {
                                                    stockReceive
                                                        .production_order.code
                                                }
                                            </h5>
                                        </td>
                                    </tr>

                                    <tr>
                                        <th scope="row">Production Status</th>
                                        <td>
                                            <Badge
                                                className={` p-2 ${getStatusStyle(
                                                    stockReceive
                                                        .production_order
                                                        .status as StatusType
                                                )}`}
                                            >
                                                {stockReceive.production_order.status.toUpperCase()}
                                            </Badge>
                                        </td>
                                    </tr>

                                    <tr>
                                        <th scope="row">Status</th>
                                        <td>
                                            <Badge
                                                className={` p-2 ${getStatusStyle(
                                                    stockReceive.status as StatusType
                                                )}`}
                                            >
                                                {stockReceive.status.toUpperCase()}
                                            </Badge>
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
                                "production.stock-received.edit",
                                stockReceive.id
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
