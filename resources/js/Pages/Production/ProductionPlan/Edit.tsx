import React from "react";
import { Head, useForm, usePage } from "@inertiajs/react";
import Card from "@/components/Cards/Card";
import AuthLayout from "@/Layouts/AuthLayout";
import ProductionPlanForm from "./ProductionPlanForm";
import {
    BOMsType,
    WorkStationsType,
    WarehousesType,
    FormFieldType,
} from "./type";
import { PageProp } from "@/types/global";
import { TSystemPagePropType } from "@/types/type";

interface PropsType {
    productionOrder: {
        id: number;
        date: string;
        code:string;
        bill_of_material_id: number;
        finance_year_id: number;
        warehouse_id: number;
        work_station_id: number;
        quantity: number;
        cost: number;
        other_cost: number;
        start_at: string;
        end_at: string;
    };
    BOMs: BOMsType[];
    workStations: WorkStationsType[];
    warehouses: WarehousesType[];
    currentData: string;
}
interface PagePropsType extends PageProp {
    system: TSystemPagePropType;
}

function Edit({
    productionOrder,
    BOMs,
    workStations,
    warehouses,
    currentData,
}: PropsType) {
    const { system } = usePage<PagePropsType>().props;
    const { data, setData, errors, clearErrors, processing, put } =
        useForm<FormFieldType>({
            date: productionOrder.date,
            code:productionOrder.code,
            bill_of_material: productionOrder.bill_of_material_id,
            warehouse: productionOrder.warehouse_id,
            work_station: productionOrder.work_station_id,
            quantity: productionOrder.quantity,
            cost: productionOrder.cost,
            other_cost: productionOrder.other_cost,
            start_at: productionOrder.start_at,
            end_at: productionOrder.end_at,
        });

    const handleOnChange = (
        field: keyof FormFieldType,
        value: string | number | ""
    ) => {
        clearErrors(field);

        if (field === "quantity") {
            console.log(value as number);
            setData("quantity", value as number);
            return;
        }

        if (field === "bill_of_material") {
            const bom = BOMs.find((bom) => bom.id == value);
            if (bom) {
                const { total, other_cost, overhead_cost } = bom;
                setData({
                    ...data,
                    bill_of_material: value as number,
                    cost: total,
                    other_cost: other_cost + overhead_cost,
                });
            }
            return;
        }
        // Default case
        setData(field, value);
    };

    const handleOnSubmit = () => {
        put(route("production.production-order.update", productionOrder.id));
    };
    return (
        <AuthLayout>
             <Head title="Production | Production Order | Edit - " />
            <Card>
                <Card.Header>
                    <h4 className="card-title">Edit Production Order</h4>
                    <p className="card-title-desc">
                        Fill out the form below to update production order.
                    </p>
                </Card.Header>
                <Card.Body>
                    <ProductionPlanForm
                        BOMs={BOMs}
                        workStations={workStations}
                        warehouses={warehouses}
                        data={data}
                        errors={errors}
                        onChangeHandler={handleOnChange}
                    />

                    <div className="row">
                        <div className="col-md-4">
                            <div className="alert alert-primary" role="alert">
                                <b>
                                    Estimated Cost : {system.currency.symbol}{" "}
                                    {data.cost * data.quantity}
                                </b>
                                <br />
                                <b>
                                    Extra Cost : {system.currency.symbol}{" "}
                                    {data.other_cost * data.quantity}
                                </b>

                                <br />
                                <b>
                                    Total Cost : {system.currency.symbol}{" "}
                                    {(data.cost + data.other_cost) *
                                        data.quantity}
                                </b>
                            </div>
                        </div>
                    </div>
                </Card.Body>
                <Card.Footer>
                    <div className="d-flex justify-content-start">
                        <button
                            type="submit"
                            className="btn btn-primary w-md"
                            onClick={handleOnSubmit}
                            disabled={processing}
                        >
                            {processing ? "Updating..." : "Update"}
                        </button>
                    </div>
                </Card.Footer>
            </Card>
        </AuthLayout>
    );
}

export default Edit;
