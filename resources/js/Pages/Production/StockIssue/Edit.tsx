import Card from "@/components/Cards/Card";
import AuthLayout from "@/Layouts/AuthLayout";
import { Head, useForm, usePage } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { FormFieldType, ItemsType, SystemPropsType } from "./types";
import InvalidFeedback from "@/components/InvalidFeedback";

export interface PropsType {
    stockIssueData: {
        id: number;
        code: string;
        production_order: {
            id: number;
            code: string;
            product: string;
            unitShortName: string;
            quantity: number;
        };
        date: string;
        status: string;
        items: ItemsType[];
        other_cost: number;
        overhead_cost: number;
    };
    stockIssueCode: string;
    currentData: string;
}
function Create({ stockIssueData, currentData }: PropsType) {
    const { system } = usePage<SystemPropsType>().props;
    const [computedValue, setComputedValue] = useState({
        totalAmt: 0,
        otherAmt: 0,
    });
    const { data, setData, errors, clearErrors, processing, put } =
        useForm<FormFieldType>({
            date: stockIssueData.date,
            code: stockIssueData.code,
            production_order: stockIssueData.production_order.id,
            status: stockIssueData.status,
            items: stockIssueData.items,
        });

    const handleOnChange = (
        field: keyof FormFieldType,
        value: string | number | ""
    ) => {
        clearErrors(field);
        setData(field, value);
    };

    const handleUpdateBatch = (index: number, batchId: number) => {
        const updatedItems = data.items.map((item, i) =>
            i === index ? { ...item, batch: batchId } : item
        );
        setData("items", updatedItems);
    };
    const handleSubmit = () =>
        put(route("production.stock-issue.update", stockIssueData.id));

    useEffect(() => {
        const totalAmount = data.items.reduce(
            (total, { totalUnitCost }) => total + (totalUnitCost || 0),
            0
        );
        setComputedValue({
            ...computedValue,
            totalAmt: totalAmount,
            otherAmt:
                (stockIssueData.other_cost + stockIssueData.overhead_cost) *
                stockIssueData.production_order.quantity,
        });
    }, []);

    return (
        <AuthLayout>
            <Head title="Create Stock Issue" />
            <Card>
                <Card.Header>
                    <h4 className="card-title">Edit Stock Issue</h4>
                    <p className="card-title-desc">
                        Fill out the form below to update stock issue for
                        production.
                    </p>
                </Card.Header>
                <Card.Body>
                    <div className="row">
                        <div className="col-md-4">
                            <div className="mb-3">
                                <label htmlFor="pr">Date</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    value={data.date}
                                    onChange={(e) =>
                                        handleOnChange("date", e.target.value)
                                    }
                                />
                                {errors.date && (
                                    <InvalidFeedback errorMsg={errors.date} />
                                )}
                            </div>
                        </div>

                        <div className="col-md-4">
                            <div className="mb-3">
                                <label htmlFor="pr">Issue Code</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={data.code}
                                    onChange={(e) =>
                                        handleOnChange("code", e.target.value)
                                    }
                                />
                                {errors.code && (
                                    <InvalidFeedback errorMsg={errors.code} />
                                )}
                            </div>
                        </div>

                        <div className="col-md-4">
                            <div className="mb-3">
                                <label htmlFor="pr">Status</label>
                                <select
                                    className="form-select"
                                    value={data.status}
                                    onChange={(e) =>
                                        handleOnChange("status", e.target.value)
                                    }
                                >
                                    <option value="">--- select ---</option>
                                    <option value="generate">Generate</option>
                                    <option value="complete">Complete</option>
                                </select>
                                {errors.status && (
                                    <InvalidFeedback errorMsg={errors.status} />
                                )}
                            </div>
                        </div>

                        <div className="w-100"></div>

                        <div className="col-md-4">
                            <div className="mb-3">
                                <label htmlFor="pr">Production Order</label>
                                <input
                                    type="text"
                                    className="form-control p-3"
                                    value={`${stockIssueData.production_order.code} | ${stockIssueData.production_order.product} | ${stockIssueData.production_order.quantity} ${stockIssueData.production_order.unitShortName}`}
                                    disabled={true}
                                />
                            </div>
                        </div>
                    </div>

                    <hr />

                    <div className="table-responsive">
                        <table className="table no-wrap">
                            <thead className="table-secondary">
                                <tr>
                                    <th>#</th>
                                    <th>Product</th>
                                    <th>Quantity</th>
                                    <th>Available</th>
                                    <th>Batch</th>
                                    <th>Cost ({system.currency.symbol})</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.items.map((item, index) => (
                                    <tr key={index + 1}>
                                        <td>{index + 1}</td>
                                        <td style={{ width: "40%" }}>
                                            {item.product}
                                        </td>
                                        <td>
                                            {item.reqQuantity}{" "}
                                            {item.unit.short_name}
                                        </td>
                                        <td
                                            className={
                                                item.avlQuantity -
                                                    item.reqQuantity <
                                                0
                                                    ? "text-danger"
                                                    : "text-success"
                                            }
                                        >
                                            {item.avlQuantity}{" "}
                                            {item.unit.short_name}
                                        </td>
                                        <td>
                                            {item.productBatches &&
                                                item.productBatches.length >
                                                    0 && (
                                                    <select
                                                        className="form-select p-1"
                                                        style={{
                                                            width: "120px",
                                                        }}
                                                        value={item.batch || ""}
                                                        onChange={(e) =>
                                                            handleUpdateBatch(
                                                                index,
                                                                +e.target.value
                                                            )
                                                        }
                                                    >
                                                        <option value="">
                                                            --- batch ---
                                                        </option>
                                                        {item.productBatches.map(
                                                            (batch) => (
                                                                <option
                                                                    key={
                                                                        batch.id
                                                                    }
                                                                    value={
                                                                        batch.id
                                                                    }
                                                                >
                                                                    {
                                                                        batch.batch
                                                                    }
                                                                </option>
                                                            )
                                                        )}
                                                    </select>
                                                )}
                                        </td>
                                        <td>{item.totalUnitCost}</td>
                                    </tr>
                                ))}
                                <tr>
                                    <td colSpan={4}></td>
                                    <td colSpan={2}>
                                        <table className="table table-striped table-sm">
                                            <tbody>
                                                <tr>
                                                    <td>
                                                        Total Cost (
                                                        {system.currency.symbol}
                                                        ) :
                                                    </td>
                                                    <td>
                                                        {computedValue.totalAmt}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        Extra Cost (
                                                        {system.currency.symbol}
                                                        ) :
                                                    </td>
                                                    <td>
                                                        {computedValue.otherAmt}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        Grand Total (
                                                        {system.currency.symbol}
                                                        ) :
                                                    </td>
                                                    <td>
                                                        {computedValue.totalAmt +
                                                            computedValue.otherAmt}
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </Card.Body>

                <Card.Footer>
                    <button
                        className="btn btn-primary w-md"
                        onClick={handleSubmit}
                        disabled={processing}
                    >
                        {processing ? "Updating" : "Update"}
                    </button>
                </Card.Footer>
            </Card>
        </AuthLayout>
    );
}

export default Create;
