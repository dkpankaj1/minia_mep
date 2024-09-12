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
    BOMs: BOMsType[];
    workStations: WorkStationsType[];
    warehouses: WarehousesType[];

    productionCode:string;
    currentData: string;
}
interface PagePropsType extends PageProp {
    system: TSystemPagePropType;
}

function Create({ BOMs, workStations, warehouses, productionCode,currentData }: PropsType) {
    const { system } = usePage<PagePropsType>().props;
    const { data, setData, errors, clearErrors, processing, post } =
        useForm<FormFieldType>({
            date: currentData,
            code:productionCode,
            bill_of_material: "",
            warehouse: "",
            work_station: "",
            quantity: 0,
            cost: 0,
            other_cost: 0,
            start_at: "",
            end_at: "",
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
            console.log(bom);
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
        post(route("production.production-order.store"));
    };
    return (
        <AuthLayout>
            <Head title="Production | Production Order | Create - " />
            <Card>
                <Card.Header>
                    <h4 className="card-title">Create Production Order</h4>
                    <p className="card-title-desc">
                        Fill out the form below to create a new production
                        order.
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
                    <hr />

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
                            {processing ? "Creating..." : "Create"}
                        </button>
                    </div>
                </Card.Footer>
            </Card>
        </AuthLayout>
    );
}

export default Create;
