import AuthorizeLink from "@/components/AuthorizeLink";
import Card from "@/components/Cards/Card";
import AuthLayout from "@/Layouts/AuthLayout";
import { PageProp } from "@/types/global";
import { TSystemPagePropType } from "@/types/type";
import { Head, usePage } from "@inertiajs/react";
import React from "react";

interface ItemsType {
    product: string;
    unit: string;
    reqQuantity: number;
    totalUnitCost: number;
    batches: Array<{
        batch: string;
        qnt: number;
        unitShortName: string;
    }>;
}
interface StockIssueDataType {
    id: number;
    code: string;
    date: string;
    production_order: {
        id: number;
        code: string;
        product: string;
        unitShortName: string;
        quantity: number;
    };
    other_cost: number;
    overhead_cost: number;
    status: string;
    items: ItemsType[];
}

interface PropsType {
    stockIssueData: StockIssueDataType;
}
interface PagePropsType extends PageProp {
    system: TSystemPagePropType;
}

function Show({ stockIssueData }: PropsType) {
    const { system } = usePage<PagePropsType>().props;
    return (
        <AuthLayout>
            <Head title="Production | Stock Issue | Show -" />
            <Card>
                <Card.Body>
                    <Card.Header>
                        <h4 className="card-title">Show Stock Issue</h4>
                        <p className="card-title-desc">
                            View the detail of stock issue.
                        </p>
                    </Card.Header>

                    <div className="row">
                        <div className="col-sm-6">
                            <div className="my-3">
                                <h5 className="font-size-14 mb-3">
                                    Date: {stockIssueData.date}
                                </h5>
                                <h5 className="font-size-14 mb-3">
                                    Code: {stockIssueData.code}
                                </h5>
                                <h5 className="font-size-14 mb-3">
                                    Status: {stockIssueData.status}
                                </h5>
                                <h5 className="font-size-14 mb-3">
                                    Production Order :{" "}
                                    {`${stockIssueData.production_order.code} | ${stockIssueData.production_order.product} | ${stockIssueData.production_order.quantity} ${stockIssueData.production_order.unitShortName}`}
                                </h5>
                            </div>
                        </div>
                    </div>

                    <table className="table no-wrap">
                        <thead className="table-light">
                            <tr>
                                <th>SR</th>
                                <th>Product</th>
                                <th>Quantity</th>
                                <th>Cost ({system.currency.symbol})</th>
                                <th>Batches</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stockIssueData.items.map((item, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{item.product}</td>
                                    <td>
                                        {item.reqQuantity} {item.unit}
                                    </td>
                                    <td>{item.totalUnitCost}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Card.Body>
                <Card.Footer>
                    <div className="d-flex justify-content-start">
                        <AuthorizeLink
                            className="btn btn-primary w-md"
                            ability={"production.stock-issue.edit"}
                            href={route(
                                "production.stock-issue.edit",
                                stockIssueData.id
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
