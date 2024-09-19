import Card from "@/components/Cards/Card";
import AuthLayout from "@/Layouts/AuthLayout";
import { Head, useForm } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { FormFieldType, ProductionOrderType, StockReceiveType } from "./type";
import Form from "./Form";

interface PropsType {
    stockReceive: StockReceiveType;
    productionOrders: ProductionOrderType[];
}

function Edit({ stockReceive, productionOrders }: PropsType) {
    console.log(stockReceive);
    const { data, setData, errors, clearErrors, put, processing } =
        useForm<FormFieldType>({
            code: stockReceive.code,
            date: stockReceive.date,
            production_order: stockReceive.production_order,
            is_batch: stockReceive.is_batch,
            batch: stockReceive.batch,
            expiration: stockReceive.expiration,
            status: stockReceive.status,
            remark: stockReceive.remark,
        });

    const handleFieldChange = (field: keyof FormFieldType, value: string) => {
        clearErrors(field);
        setData(field, value);
    };

    const handleSubmit = () =>
        put(route("production.stock-received.update", stockReceive.id));
    // const handleSubmit = () => console.log(data);

    return (
        <AuthLayout>
            <Head title="Stock Received | Create -" />
            <Card>
                <Card.Header>
                    <h4 className="card-title">Edit Stock Received</h4>
                    <p className="card-title-desc">
                        Fill out the form below to update stock received.
                    </p>
                </Card.Header>
                <Card.Body>
                    <Form
                        data={data}
                        handleFieldChange={handleFieldChange}
                        productionOrders={productionOrders}
                        errors={errors}
                    />
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

export default Edit;
