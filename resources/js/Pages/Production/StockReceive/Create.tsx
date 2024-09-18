import Card from "@/components/Cards/Card";
import AuthLayout from "@/Layouts/AuthLayout";
import { Head, useForm } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { FormFieldType, ProductionOrderType } from "./type";
import Form from "./Form";

interface PropsType {
    productionOrders: ProductionOrderType[];
    currentData: string;
    nextCode: string;
}

function Create({ productionOrders, currentData, nextCode }: PropsType) {
    const { data, setData, errors, clearErrors, post, processing } =
        useForm<FormFieldType>({
            code: nextCode,
            date: currentData,
            production_order: "",
            is_batch: 0,
            batch: "",
            expiration: "",
            status: "",
            remark: "",
        });

    const handleFieldChange = (field: keyof FormFieldType, value: string) => {
        clearErrors(field);
        setData(field, value);
    };

    const handleSubmit = () => post(route("production.stock-received.store"));

    useEffect(() => {
        const foundPDOrder = productionOrders.find(
            (PDOrder) => PDOrder.id == data.production_order
        );

        if (foundPDOrder) {
            setData({
                ...data,
                is_batch: foundPDOrder.product.is_batch,
                batch: "",
                expiration: "",
            });
        }
    }, [data.production_order]);
    return (
        <AuthLayout>
            <Head title="Stock Received | Create -" />
            <Card>
                <Card.Header>
                    <h4 className="card-title">Create Stock Received</h4>
                    <p className="card-title-desc">
                        Fill out the form below to create a new stock received.
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
                        {processing ? "Creating" : "Create"}
                    </button>
                </Card.Footer>
            </Card>
        </AuthLayout>
    );
}

export default Create;
