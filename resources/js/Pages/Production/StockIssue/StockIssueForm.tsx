import InvalidFeedback from "@/components/InvalidFeedback";
import { ItemsType, FormFieldType, ProductionOrderType } from "./types";
import { SystemPropsType } from "./types";
import { usePage } from "@inertiajs/react";
import { error } from "console";

interface StockIssueFormProps {
    data: FormFieldType;
    errors: any;
    handleOnChange: (
        field: keyof FormFieldType,
        value: string | number | ""
    ) => void;
    handleProductionOrderChange: (productionOrderId: number) => void;
    handleUpdateBatch: (index: number, batchId: number) => void;
    computedValue: { totalAmt: number; otherAmt: number };
    productionOrders: ProductionOrderType[];
}

const StockIssueForm = ({
    data,
    errors,
    handleOnChange,
    handleProductionOrderChange,
    handleUpdateBatch,
    computedValue,
    productionOrders,
}: StockIssueFormProps) => {
    const { system } = usePage<SystemPropsType>().props;

    return (
        <>
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
                        <select
                            className="form-select p-3"
                            value={data.production_order}
                            onChange={(e) =>
                                handleProductionOrderChange(+e.target.value)
                            }
                        >
                            <option value="">--- select ---</option>
                            {productionOrders.map((items) => {
                                return (
                                    <option value={items.id} key={items.id}>
                                        {items.code} | {items.product} |{" "}
                                        {items.quantity} {items.unit.short_name}
                                    </option>
                                );
                            })}
                        </select>
                        {errors.production_order && (
                            <InvalidFeedback
                                errorMsg={errors.production_order}
                            />
                        )}
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
                                <td style={{ width: "40%" }}>{item.product}</td>
                                <td>
                                    {item.reqQuantity} {item.unit.short_name}
                                </td>
                                <td
                                    className={
                                        item.avlQuantity - item.reqQuantity < 0
                                            ? "text-danger"
                                            : "text-success"
                                    }
                                >
                                    {item.avlQuantity} {item.unit.short_name}
                                </td>
                                <td>
                                    {item.productBatches &&
                                        item.productBatches.length > 0 && (
                                            <select
                                                className="form-select p-1"
                                                style={{ width: "120px" }}
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
                                                            key={batch.id}
                                                            value={batch.id}
                                                        >
                                                            {batch.batch}
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
                                                {system.currency.symbol}) :
                                            </td>
                                            <td>{computedValue.totalAmt}</td>
                                        </tr>
                                        <tr>
                                            <td>
                                                Extra Cost (
                                                {system.currency.symbol}) :
                                            </td>
                                            <td>{computedValue.otherAmt}</td>
                                        </tr>
                                        <tr>
                                            <td>
                                                Grand Total (
                                                {system.currency.symbol}) :
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
        </>
    );
};

export default StockIssueForm;
