import React from "react";
import {
    BOMsType,
    WorkStationsType,
    WarehousesType,
    FormFieldType,
} from "./type";
import InvalidFeedback from "@/components/InvalidFeedback";

interface PropsType {
    BOMs: BOMsType[];
    workStations: WorkStationsType[];
    warehouses: WarehousesType[];
    data: FormFieldType;
    onChangeHandler: (
        field: keyof FormFieldType,
        value: string | number | ""
    ) => void;
    errors: Partial<Record<keyof FormFieldType, string>>;
}
function ProductionPlanForm({
    BOMs,
    workStations,
    warehouses,
    data,
    onChangeHandler,
    errors,
}: PropsType) {
    return (
        <div className="row">
            <div className="col-md-4">
                <div className="mb-3">
                    <label htmlFor="bom">Date</label>
                    <input
                        type="date"
                        className="form-control"
                        value={data.date}
                        onChange={(e) =>
                            onChangeHandler("date", e.target.value)
                        }
                    />
                    {errors.date && <InvalidFeedback errorMsg={errors.date} />}
                </div>
            </div>
            <div className="w-100"></div>

            <div className="col-md-4">
                <div className="mb-3">
                    <label htmlFor="bom">Bill Of Material</label>
                    <select
                        className="form-select"
                        value={data.bill_of_material}
                        onChange={(e) =>
                            onChangeHandler("bill_of_material", e.target.value)
                        }
                    >
                        <option>--- select ---</option>
                        {BOMs.map((item) => {
                            return (
                                <option value={item.id} key={item.id}>
                                    {item.code} - {item.product}
                                </option>
                            );
                        })}
                    </select>
                    {errors.bill_of_material && (
                        <InvalidFeedback errorMsg={errors.bill_of_material} />
                    )}
                </div>
            </div>

            <div className="col-md-4">
                <div className="mb-3">
                    <label htmlFor="bom">Workstation</label>
                    <select
                        className="form-select"
                        value={data.work_station}
                        onChange={(e) =>
                            onChangeHandler("work_station", e.target.value)
                        }
                    >
                        <option>--- select ---</option>
                        {workStations.map((item) => {
                            return <option value={item.id} key={item.id}>{item.name}</option>;
                        })}
                    </select>

                    {errors.work_station && (
                        <InvalidFeedback errorMsg={errors.work_station} />
                    )}
                </div>
            </div>
            <div className="col-md-4">
                <div className="mb-3">
                    <label htmlFor="bom">Warehouse</label>
                    <select
                        className="form-select"
                        value={data.warehouse}
                        onChange={(e) =>
                            onChangeHandler("warehouse", e.target.value)
                        }
                    >
                        <option>--- select ---</option>
                        {warehouses.map((item) => {
                            return <option value={item.id} key={item.id}>{item.name}</option>;
                        })}
                    </select>
                    {errors.warehouse && (
                        <InvalidFeedback errorMsg={errors.warehouse} />
                    )}
                </div>
            </div>

            <div className="col-md-4">
                <div className="mb-3">
                    <label htmlFor="bom">Start Date</label>
                    <input
                        type="date"
                        className="form-control"
                        value={data.start_at}
                        onChange={(e) =>
                            onChangeHandler("start_at", e.target.value)
                        }
                    />
                    {errors.start_at && (
                        <InvalidFeedback errorMsg={errors.start_at} />
                    )}
                </div>
            </div>

            <div className="col-md-4">
                <div className="mb-3">
                    <label htmlFor="bom">End Date</label>
                    <input
                        type="date"
                        className="form-control"
                        value={data.end_at}
                        onChange={(e) =>
                            onChangeHandler("end_at", e.target.value)
                        }
                    />
                    {errors.end_at && (
                        <InvalidFeedback errorMsg={errors.end_at} />
                    )}
                </div>
            </div>

            <div className="w-100"></div>

            <div className="col-md-4">
                <div className="mb-3">
                    <label htmlFor="bom">Quantity</label>
                    <input
                        type="number"
                        step={0.1}
                        className="form-control"
                        value={data.quantity}
                        onChange={(e) =>
                            onChangeHandler("quantity", e.target.value)
                        }
                    />
                    {errors.quantity && (
                        <InvalidFeedback errorMsg={errors.quantity} />
                    )}
                </div>
            </div>
        </div>
    );
}

export default ProductionPlanForm;
