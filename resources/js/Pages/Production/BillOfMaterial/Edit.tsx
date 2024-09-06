import Badge from "@/components/Badge";
import Card from "@/components/Cards/Card";
import ProductSearchInput from "@/components/ProductSearchInput";
import SearchableSelect from "@/components/SearchableSelect";
import {
    CustomTable,
    TBody,
    TData,
    THead,
    THeader,
    TRow,
} from "@/components/Table";
import AuthLayout from "@/Layouts/AuthLayout";
import { Head, useForm, usePage } from "@inertiajs/react";
import React, { useCallback, useEffect, useState } from "react";
import EditItem from "./EditItem";
import { PageProp } from "@/types/global";
import { TSystemPagePropType } from "@/types/type";
import InvalidFeedback from "@/components/InvalidFeedback";

interface IUnitType {
    id: number;
    name: string;
    operator: string;
    operator_value: number;
    short_name: string;
    base_unit: Array<IUnitType> | null;
}
interface IFinishProductType {
    id: number;
    code: string;
    name: string;
}
interface IRawProductType {
    id: number;
    code: string;
    name: string;
    unit: IUnitType;
    cost: number;
    available_unit: Array<IUnitType>;
}
interface ISelectedItemType {
    index: number;
    qnt: number;
    unit: IUnitType;
    available_unit: IUnitType[];
}
interface IMaterialType {
    id: number;
    name: string;
    code: string;
    quantity: number;
    cost: number;
    unit_cost: number;
    unit: IUnitType;
}
interface IFormDataField {
    product: number | "";
    materials: Array<IMaterialType> | [];
    overhead_cost: number;
    other_cost: number;
}
interface IBillOfMaterial extends IFormDataField {
    id: number;
}
interface IPagePropType extends PageProp {
    system: TSystemPagePropType;
}
interface IPropsType {
    finishProduct: { data: IFinishProductType[] };
    rawProduct: { data: IRawProductType[] };
    billOfMaterial: IBillOfMaterial;
}
function Edit({ finishProduct, rawProduct, billOfMaterial }: IPropsType) {
    const { system } = usePage<IPagePropType>().props;
    const { data, setData, put, processing, errors } = useForm<IFormDataField>({
        product: billOfMaterial.product,
        materials: billOfMaterial.materials,
        overhead_cost: billOfMaterial.overhead_cost,
        other_cost: billOfMaterial.other_cost,
    });
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResult, setSearchResult] = useState<Array<IRawProductType>>(
        []
    );
    const [selectedItem, setSelectedItem] = useState<ISelectedItemType>();
    const [showModel, setShowModel] = useState(false);
    const [computedValues, setComputedValues] = useState({
        totalCost: 0,
        overHeadCost: 0,
        otherCost: 0,
        grandTotal: 0,
    });
    const toggleModal = useCallback(() => setShowModel((prev) => !prev), []);
    const formateFinishProduct: Array<{
        value: string | number;
        label: string;
    }> = finishProduct.data.map((fnsProduct) => {
        return {
            label: `${fnsProduct.name} - ${fnsProduct.code} `,
            value: fnsProduct.id,
        };
    });
    const handleRemove = (index: number) => {
        const updatedCartItems = [...data.materials];
        updatedCartItems.splice(index, 1);
        setData("materials", updatedCartItems);
    };
    const handleAddToCart = (product: IRawProductType): void => {
        const unitCost =
            product.unit.operator == "*"
                ? product.cost * product.unit.operator_value
                : product.cost / product.unit.operator_value;

        const newProduct: IMaterialType = {
            id: product.id,
            name: product.name,
            code: product.code,
            quantity: 1,
            unit: product.unit,
            cost: product.cost,
            unit_cost: unitCost,
        };
        if (!data.materials.some((material) => material.id === product.id)) {
            setData("materials", [...data.materials, newProduct]);
        }
        setSearchQuery("");
    };
    const handleUpdate = (index: number) => {
        const item = data.materials[index];
        const product = rawProduct.data.find(
            (rProduct) => rProduct.id == item.id
        );
        if (product) {
            setSelectedItem({
                index: index,
                qnt: item.quantity,
                unit: item.unit,
                available_unit: product.available_unit,
            });
            toggleModal();
        }
    };
    const applyUpdate = () => {
        const { index } = selectedItem || {};
        if (typeof index === "number") {
            const updatedItems = [...data.materials];
            const operatorValue = selectedItem?.unit.operator_value ?? 1;
            const unitCost =
                selectedItem?.unit.operator === "*"
                    ? updatedItems[index].cost * operatorValue
                    : updatedItems[index].cost / operatorValue;

            updatedItems[index].quantity = selectedItem?.qnt || 0;
            updatedItems[index].unit = selectedItem?.unit || ({} as IUnitType);
            updatedItems[index].unit_cost = unitCost;
            calculateTotals();
            toggleModal();
        }
    };

    const calculateTotals = () => {
        const overHeadCost =
            typeof data.overhead_cost == "number"
                ? data.overhead_cost
                : parseInt(data.overhead_cost || "0");
        const otherCost =
            typeof data.other_cost == "number"
                ? data.other_cost
                : parseInt(data.other_cost || "0");

        const totalCost = data.materials.reduce((total, item) => {
            return total + item.unit_cost * item.quantity;
        }, 0);

        const grandTotal = overHeadCost + otherCost + totalCost;
        setComputedValues({
            totalCost,
            overHeadCost,
            otherCost,
            grandTotal,
        });
    };

    const handleProductChange = (options: any) => {
        const newValue = options !== null ? options.value : "";
        setData("product", newValue);
    };

    const handleSubmit = () => {
        put(route("production.bill-of-material.update", billOfMaterial.id));
    };
    useEffect(() => {
        if (searchQuery === "") {
            setSearchResult([]);
        } else {
            const timeOutId = setTimeout(() => {
                const filterSearchResult =
                    searchQuery === "*"
                        ? rawProduct.data
                        : rawProduct.data.filter(
                              ({ name, code }) =>
                                  name
                                      .toLowerCase()
                                      .includes(searchQuery.toLowerCase()) ||
                                  code
                                      .toLowerCase()
                                      .includes(searchQuery.toLowerCase())
                          );
                setSearchResult(filterSearchResult);
            }, 500);
            return () => clearTimeout(timeOutId);
        }
    }, [searchQuery, rawProduct.data]);

    useEffect(() => {
        calculateTotals();
    }, [data]);

    return (
        <AuthLayout>
            <Head title="Production | BillOfMaterial | Create - " />

            <Card>
                <Card.Body>
                    <Card.Title>Edit Bill Of Material</Card.Title>
                    <Card.Title.Description>
                        Fill the detail to update bill of material
                    </Card.Title.Description>

                    <div className="mb-3">
                        <label htmlFor="Product">Product</label>
                        <SearchableSelect
                            options={formateFinishProduct}
                            defaultValue={data.product}
                            onSelect={handleProductChange}
                        />
                        {errors.product && (
                            <InvalidFeedback errorMsg={errors.product} />
                        )}
                    </div>

                    <div className="mb-3">
                        <ProductSearchInput
                            label="Required Material"
                            placeholder="Search Product..."
                            searchResult={searchResult}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onSearchResultItemClick={handleAddToCart}
                            renderResultItem={(r) => `${r.name} - ${r.code}`}
                        />
                    </div>

                    <div className="mb-3 table-responsive">
                        <CustomTable className="no-wrap">
                            <THead className="table-secondary">
                                <TRow>
                                    <THeader style={{ width: "" }}>No.</THeader>
                                    <THeader style={{ width: "" }}>
                                        Product
                                    </THeader>

                                    <THeader style={{ width: "" }}>
                                        Code
                                    </THeader>
                                    <THeader style={{ width: "" }}>Qty</THeader>
                                    <THeader style={{ width: "" }}>
                                        Unit
                                    </THeader>
                                    <THeader style={{ width: "" }}>
                                        Subtotal ({system.currency.symbol})
                                    </THeader>
                                    <THeader style={{ width: "" }}>
                                        Action
                                    </THeader>
                                </TRow>
                            </THead>
                            <TBody>
                                {data.materials.map((material, index) => {
                                    return (
                                        <TRow key={index}>
                                            <TData>{index + 1}</TData>
                                            <TData>
                                                <span>{material.name}</span>
                                            </TData>
                                            <TData>
                                                <span>{material.code}</span>
                                            </TData>
                                            <TData>
                                                {material.quantity}{" "}
                                                {material.unit.short_name}
                                            </TData>
                                            <TData>
                                                <Badge className="font-size-14 fw-medium bg-success-subtle text-success">
                                                    {material.unit.name}
                                                </Badge>
                                            </TData>
                                            <TData>
                                                {material.quantity *
                                                    material.unit_cost}
                                            </TData>
                                            <TData>
                                                <div className="d-flex gap-2">
                                                    <button
                                                        className="btn btn-sm btn-soft-danger"
                                                        onClick={() =>
                                                            handleRemove(index)
                                                        }
                                                    >
                                                        <i className="bx bxs-trash font-size-12 align-middle"></i>
                                                    </button>

                                                    <button
                                                        className="btn btn-sm btn-soft-primary"
                                                        onClick={() =>
                                                            handleUpdate(index)
                                                        }
                                                    >
                                                        <i className="bx bxs-edit font-size-12 align-middle"></i>
                                                    </button>
                                                </div>
                                            </TData>
                                        </TRow>
                                    );
                                })}

                                <TRow>
                                    <TData colSpan="5">{""}</TData>
                                    <TData colSpan="2">
                                        <CustomTable className="table table-striped table-sm  mt-3">
                                            <TBody>
                                                <TRow>
                                                    <TData>
                                                        <b>
                                                            Total (
                                                            {
                                                                system.currency
                                                                    .symbol
                                                            }
                                                            )
                                                        </b>
                                                    </TData>
                                                    <TData>
                                                        {
                                                            computedValues.totalCost
                                                        }
                                                    </TData>
                                                </TRow>

                                                <TRow>
                                                    <TData>
                                                        <b>
                                                            Overhead cost +
                                                            Other cost (
                                                            {
                                                                system.currency
                                                                    .symbol
                                                            }{" "}
                                                            )
                                                        </b>
                                                    </TData>
                                                    <TData>
                                                        {computedValues.overHeadCost +
                                                            computedValues.otherCost}
                                                    </TData>
                                                </TRow>

                                                <TRow>
                                                    <TData>
                                                        <b>
                                                            Grand Total (
                                                            {
                                                                system.currency
                                                                    .symbol
                                                            }
                                                            )
                                                        </b>
                                                    </TData>
                                                    <TData>
                                                        {
                                                            computedValues.grandTotal
                                                        }
                                                    </TData>
                                                </TRow>
                                            </TBody>
                                        </CustomTable>
                                    </TData>
                                </TRow>
                            </TBody>
                        </CustomTable>
                    </div>

                    <div className="row mb-3">
                        <div className="col-md-4">
                            <label htmlFor="Other Charges">
                                Overhead cost ({system.currency.symbol})
                            </label>
                            <input
                                type="number"
                                className="form-control"
                                placeholder="Overhead cost"
                                value={data.overhead_cost}
                                onChange={(e) =>
                                    setData("overhead_cost", +e.target.value)
                                }
                            />
                        </div>

                        <div className="col-md-4">
                            <label htmlFor="Other Charges">
                                Other cost ({system.currency.symbol})
                            </label>
                            <input
                                type="number"
                                className="form-control"
                                placeholder="Other cost"
                                value={data.other_cost}
                                onChange={(e) =>
                                    setData("other_cost", +e.target.value)
                                }
                            />
                        </div>
                    </div>
                </Card.Body>
                <Card.Footer>
                    <button
                        className="btn btn-primary w-md"
                        onClick={handleSubmit}
                        disabled={processing}
                    >
                        {processing ? "Updating" :"Update"}
                    </button>
                </Card.Footer>
            </Card>

            <EditItem
                showModel={showModel}
                toggleModal={toggleModal}
                selectedItem={selectedItem as ISelectedItemType}
                setSelectedItem={
                    setSelectedItem as React.Dispatch<
                        React.SetStateAction<ISelectedItemType>
                    >
                }
                handleUpdate={applyUpdate}
            />
        </AuthLayout>
    );
}

export default Edit;
