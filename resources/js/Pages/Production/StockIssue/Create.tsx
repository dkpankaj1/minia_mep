import Card from "@/components/Cards/Card";
import AuthLayout from "@/Layouts/AuthLayout";
import { Head, useForm } from "@inertiajs/react";
import { useEffect, useState } from "react";
import StockIssueForm from "./StockIssueForm";
import { FormFieldType, PropsType } from "./types";

function Create({ productionOrders, stockIssueCode, currentData }: PropsType) {
    const [computedValue, setComputedValue] = useState({
        totalAmt: 0,
        otherAmt: 0,
    });
    const { data, setData, errors, clearErrors, processing, post } =
        useForm<FormFieldType>({
            date: currentData,
            code: stockIssueCode,
            production_order: "",
            status: "",
            items: [],
        });

    const handleOnChange = (
        field: keyof FormFieldType,
        value: string | number | ""
    ) => {
        clearErrors(field);
        setData(field, value);
    };

    const handleProductionOrderChange = (productionOrderId: number) => {
        const foundItems = productionOrders.find(
            (productionOrder) => productionOrder.id == productionOrderId
        );
        if (foundItems) {
            const items = foundItems.materials.map((material) => ({
                productWarehouse_id: material.productWarehouse_id,
                product: material.product.name,
                unit: material.unit,
                reqQuantity: material.reqQuantity,
                avlQuantity: material.avlQuantity,
                totalUnitCost: material.totalUnitCost,
                is_batch: material.product.is_batch,
                batch: null,
                productBatches: material.productBatches,
            }));
            setData({ ...data, production_order: foundItems.id, items });
        }
    };

    const handleUpdateBatch = (index: number, batchId: number) => {
        const updatedItems = data.items.map((item, i) =>
            i === index ? { ...item, batch: batchId } : item
        );
        setData("items", updatedItems);
    };

    const handleSubmit = () => post(route("production.stock-issue.store"));

    useEffect(() => {
        const foundItems = productionOrders.find(
            (productionOrder) => productionOrder.id == data.production_order
        );

        if (foundItems) {
            const totalAmount = data.items.reduce(
                (total, { totalUnitCost }) => total + (totalUnitCost || 0),
                0
            );

            setComputedValue({
                ...computedValue,
                totalAmt: totalAmount,
                otherAmt:
                    (foundItems.bom.other_cost + foundItems.bom.overhead_cost) *
                    foundItems.quantity,
            });
        }
    }, [data.items]);

    return (
        <AuthLayout>
            <Head title="Create Stock Issue" />
            <Card>
                <Card.Header>
                    <h4 className="card-title">Create Stock Issue</h4>
                    <p className="card-title-desc">
                        Fill out the form below to create a new stock issue for
                        production.
                    </p>
                </Card.Header>
                <Card.Body>
                    <StockIssueForm
                        data={data}
                        errors={errors}
                        handleOnChange={handleOnChange}
                        handleProductionOrderChange={
                            handleProductionOrderChange
                        }
                        handleUpdateBatch={handleUpdateBatch}
                        computedValue={computedValue}
                        productionOrders={productionOrders}
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
