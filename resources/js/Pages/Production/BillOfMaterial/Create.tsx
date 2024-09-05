import Badge from "@/components/Badge";
import Card from "@/components/Cards/Card";
import ProductSearchInput from "@/components/ProductSearchInput";
import QuantityInput from "@/components/QuantityInput";
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
import { Head, useForm } from "@inertiajs/react";
import React, { useEffect, useState } from "react";

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
}
interface IMaterialType {
    id: number;
    name: string;
    code: string;
    quantity: number;
    cost: number;
    unit: IUnitType;
}

interface IFormDataField {
    product: number | "";
    materials: Array<IMaterialType> | [];
}
interface IPropsType {
    finishProduct: { data: IFinishProductType[] };
    rawProduct: { data: IRawProductType[] };
}
function Create({ finishProduct, rawProduct }: IPropsType) {
    const { data, setData, post, processing, errors } = useForm<IFormDataField>(
        {
            product: "",
            materials: [],
        }
    );
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResult, setSearchResult] = useState<Array<IRawProductType>>(
        []
    );

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
        const newProduct: IMaterialType = {
            id: product.id,
            name: product.name,
            code: product.code,
            quantity: 1,
            unit: product.unit,
            cost: product.cost,
        };
        if (!data.materials.some((material) => material.id === product.id)) {
            setData("materials", [...data.materials, newProduct]);
        }
        setSearchQuery("");
    };

    const handleChangeQuantity = (index: number, value: number) => {
        const updatedCartItems = [...data.materials];
        updatedCartItems[index].quantity = value;
        setData("materials", updatedCartItems);
    };

    const handleSubmit = () => {};

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

    return (
        <AuthLayout>
            <Head title="Production | BillOfMaterial | Create - " />

            <Card>
                <Card.Body>
                    <Card.Title>Create Bill Of Material</Card.Title>
                    <Card.Title.Description>
                        Fill the detail to create new bill of material
                    </Card.Title.Description>

                    <div className="mb-3">
                        <label htmlFor="Product">Product</label>
                        <SearchableSelect
                            options={formateFinishProduct}
                            defaultValue={""}
                            onSelect={() => {}}
                        />
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
                                    <THeader style={{ width: "50%" }}>
                                        Product
                                    </THeader>
                                    <THeader style={{ width: "10%" }}>
                                        Qty
                                    </THeader>
                                    <THeader style={{ width: "" }}>
                                        Unit
                                    </THeader>
                                    <THeader style={{ width: "" }}>
                                        Subtotal
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
                                                <div>
                                                    <span>{material.name}</span>
                                                    |
                                                    <small>
                                                        {material.code}
                                                    </small>
                                                </div>
                                            </TData>
                                            <TData>
                                                <QuantityInput
                                                    index={index}
                                                    value={material.quantity}
                                                    setValue={
                                                        handleChangeQuantity
                                                    }
                                                />
                                            </TData>
                                            <TData>
                                                <Badge className="font-size-14 fw-medium bg-success-subtle text-success">
                                                    {material.unit.short_name}
                                                </Badge>
                                            </TData>
                                            <TData>
                                                {material.quantity *
                                                    material.cost}
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
                                                </div>
                                            </TData>
                                        </TRow>
                                    );
                                })}

                                <TRow>
                                    <TData colSpan="4">{""}</TData>
                                    <TData colSpan="2">
                                        <CustomTable className="table table-striped table-sm">
                                            <TBody>
                                                <TRow>
                                                    <TData>
                                                        <b>Total ( )</b>
                                                    </TData>
                                                </TRow>

                                                <TRow>
                                                    <TData>
                                                        <b>
                                                            Overhead cost +
                                                            Other cost ( )
                                                        </b>
                                                    </TData>
                                                </TRow>

                                                <TRow>
                                                    <TData>
                                                        <b>Grand Total ( )</b>
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
                            <label htmlFor="Other Charges">Overhead cost</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Overhead cost"
                            />
                        </div>

                        <div className="col-md-4">
                            <label htmlFor="Other Charges">Other cost</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Other cost"
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
                        Save
                    </button>
                </Card.Footer>
            </Card>
        </AuthLayout>
    );
}

export default Create;
