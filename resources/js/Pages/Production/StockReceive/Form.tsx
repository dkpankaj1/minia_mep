import React from "react";
import InvalidFeedback from "@/components/InvalidFeedback";

import { FormFieldType, ProductionOrderType } from "./type";

interface PropsType {
    productionOrders: ProductionOrderType[];
    data: FormFieldType;
    handleFieldChange: (field: keyof FormFieldType, value: string) => void;
    errors: Partial<Record<keyof FormFieldType, string>>;
}

function Form({
    productionOrders,
    data,
    handleFieldChange,
    errors,
}: PropsType) {
    return (
        <div className="row">
            <div className="col-lg-4">
                <div className="mb-3">
                    <label htmlFor="date" className="form-label">
                        Date
                    </label>
                    <input
                        type="date"
                        className="form-control"
                        placeholder="Enter date"
                        value={data.date}
                        onChange={(e) =>
                            handleFieldChange("date", e.target.value)
                        }
                    />
                    {errors.code && <InvalidFeedback errorMsg={errors.code} />}
                </div>
            </div>
            <div className="col-lg-4">
                <div className="mb-4">
                    <label htmlFor="date" className="form-label">
                        Code
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Enter code"
                        value={data.code}
                        onChange={(e) =>
                            handleFieldChange("code", e.target.value)
                        }
                    />
                    {errors.code && <InvalidFeedback errorMsg={errors.code} />}
                </div>
            </div>

            <div className="w-100"></div>
            <div className="col-lg-4">
                <div className="mb-3">
                    <label htmlFor="pdo" className="form-label">
                        Production Order
                    </label>
                    <select
                        className="form-select p-3"
                        value={data.production_order}
                        onChange={(e) =>
                            handleFieldChange(
                                "production_order",
                                e.target.value
                            )
                        }
                    >
                        <option value={""}>--- select ----</option>
                        {productionOrders.map((productionOrder, index) => (
                            <option key={index} value={productionOrder.id}>
                                {productionOrder.code}
                            </option>
                        ))}
                    </select>
                    {errors.production_order && (
                        <InvalidFeedback errorMsg={errors.production_order} />
                    )}
                </div>
            </div>

            <div className="col-lg-4">
                <div className="mb-3">
                    <label htmlFor="date" className="form-label">
                        Status
                    </label>
                    <select
                        className="form-select p-3"
                        value={data.status}
                        onChange={(e) =>
                            handleFieldChange("status", e.target.value)
                        }
                    >
                        <option value="">--- select ---</option>
                        <option value="generate">Generate</option>
                        <option value="reject">Reject</option>
                        <option value="complete">Complete</option>
                    </select>
                    {errors.status && (
                        <InvalidFeedback errorMsg={errors.status} />
                    )}
                </div>
            </div>

            <div className="w-100"></div>
            {data.is_batch === 1 && (
                <>
                    <div className="w-100"></div>
                    <div className="col-lg-2">
                        <div className="mb-3">
                            <label htmlFor="date" className="form-label">
                                Batch
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Enter batch"
                                value={data.batch}
                                onChange={(e) =>
                                    handleFieldChange("batch", e.target.value)
                                }
                            />
                            {errors.batch && (
                                <InvalidFeedback errorMsg={errors.batch} />
                            )}
                        </div>
                    </div>

                    <div className="col-lg-2">
                        <div className="mb-3">
                            <label htmlFor="date" className="form-label">
                                Expiration
                            </label>
                            <input
                                type="date"
                                className="form-control"
                                value={data.expiration}
                                onChange={(e) =>
                                    handleFieldChange(
                                        "expiration",
                                        e.target.value
                                    )
                                }
                            />
                            {errors.expiration && (
                                <InvalidFeedback errorMsg={errors.expiration} />
                            )}
                        </div>
                    </div>
                </>
            )}
            <div className="w-100"></div>

            <div className="col-lg-8">
                <div className="mb-4">
                    <label htmlFor="remark" className="form-label">
                        Remark
                    </label>

                    <textarea
                        className="form-control"
                        value={data.remark}
                        placeholder="Enter remark..."
                        rows={5}
                        onChange={(e) =>
                            handleFieldChange("remark", e.target.value)
                        }
                    />

                    {errors.remark && (
                        <InvalidFeedback errorMsg={errors.remark} />
                    )}
                </div>
            </div>
        </div>
    );
}

export default Form;
