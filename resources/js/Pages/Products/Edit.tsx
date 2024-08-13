import React, { useEffect, useState } from "react";
import AuthLayout from "@/Layouts/AuthLayout";
import { Head, useForm } from "@inertiajs/react";

import { Card, CardBody, CardHeader, CardFooter } from "@/components/Card";
import Button from "@/components/Button";
import InputLabel from "@/components/InputLabel";
import FormInput from "@/components/FormInput";
import InvalidFeedback from "@/components/InvalidFeedback";
import FormSelect from "@/components/FormSelect";
import ImageUploadPreview from "./ImageUploadPreview";

interface IUnitType {
    id: number;
    name: string;
    short_name: string;
    base_unit: number;
    operator: string;
    operator_value: number;
    sub_units: Array<IUnitType>;
    is_active: boolean;
}
interface ISubCategory {
    id: number;
    name: string;
    description: string;
    category_id: number;
}
interface ICategory {
    id: number;
    name: string;
    description: string;
    sub_category: Array<ISubCategory>;
}
interface IBrand {
    id: number;
    name: string;
    description: string;
    is_active: boolean;
}
interface IProduct {
    id: number;
    code: string;
    barcode_symbology: string;
    category_id: string | number;
    sub_category_id: string | number;
    brand_id: string | number;
    name: string;
    unit_id: string | number;
    purchase_unit_id: string | number;
    sale_unit_id: string | number;
    cost: number;
    price: number;
    tax_method: number;
    net_tax: number;
    is_batch: boolean;
    expiration_alert: number;
    stock_alert: number;
    image: string | undefined;
    is_active: number;
    description: string;
}
interface IFormField {
    _method: string;
    code: string;
    barcode_symbology: string;
    category: string | number;
    sub_category: string | number;
    brand: string | number;
    name: string;
    unit: string | number;
    purchase_unit: string | number;
    sale_unit: string | number;
    cost: number;
    price: number;
    tax_method: number;
    net_tax: number;
    is_batch: boolean;
    expiration_alert: string | number;
    stock_alert: number;
    image: string | undefined;
    remove_old_image: boolean;
    is_active: number;
    description: string;
}
interface IPropsType {
    product: IProduct;
    product_subcategory: Array<ISubCategory>;
    product_unit: Array<IUnitType>;
    categories: Array<ICategory>;
    units: Array<IUnitType>;
    brands: Array<IBrand>;
}

function Edit({
    product,
    product_subcategory,
    product_unit,
    categories,
    units,
    brands,
}: IPropsType) {
    console.log(Object.keys(brands[0]));
    const [availableUnit, setAvailableUnit] =
        useState<Array<IUnitType>>(product_unit);
    const [subcategories, setSubCategories] =
        useState<Array<ISubCategory>>(product_subcategory);
    const { data, setData, post, processing, errors } = useForm<IFormField>({
        _method: "put",
        code: product.code,
        barcode_symbology: product.barcode_symbology,
        category: product.category_id,
        sub_category: product.sub_category_id,
        brand: product.brand_id,
        name: product.name,
        unit: product.unit_id,
        purchase_unit: product.purchase_unit_id,
        sale_unit: product.sale_unit_id,
        cost: product.cost,
        price: product.price,
        tax_method: product.tax_method,
        net_tax: product.net_tax,
        is_batch: product.is_batch,
        expiration_alert: product.expiration_alert,
        stock_alert: product.stock_alert,
        image: undefined,
        remove_old_image: false,
        is_active: product.is_active,
        description: product.description,
    });

    const handleChangeCategory = (e: number) => {
        const selectedCategory = categories.find((category) => {
            return category.id == e;
        });
        setData({
            ...data,
            category: e,
            sub_category: "",
        });
        setSubCategories(selectedCategory?.sub_category || []);
    };

    const handelChangeUnit = (e: number) => {
        const selectedUnit = units.find((unit) => unit.id == e);
        selectedUnit
            ? setAvailableUnit([selectedUnit, ...selectedUnit.sub_units])
            : setAvailableUnit([]);
        setData({
            ...data,
            unit: e,
            sale_unit: "",
            purchase_unit: "",
        });
    };

    const handleIsBatchCheck = (e: boolean) => {
        setData({
            ...data,
            expiration_alert: "",
            is_batch: e,
        });
    };

    const handleSubmit = () => {
        // console.log(data)
        post(route("product.update", product.id));
    };

    return (
        <AuthLayout>
            <Head title="Product | Edit - " />

            <Card>
                <CardHeader>
                    <h4 className="card-title">Edit Product</h4>
                    <p className="card-title-desc">
                        Modify the details of the Product. Ensure all fields are
                        correctly filled out before saving changes.
                    </p>
                </CardHeader>

                <CardBody>
                    <div className="row">
                        {/* form inputs col-9 */}
                        <div className="col-md-9">
                            <div className="row">
                                {/* name input */}
                                <div className="col-md-6">
                                    <div className="mb-4">
                                        <InputLabel label={"Name"} />
                                        <FormInput
                                            type="text"
                                            className="form-control"
                                            placeholder="Enter Product Name"
                                            value={data.name}
                                            onChange={(
                                                e: React.ChangeEvent<HTMLInputElement>
                                            ) =>
                                                setData("name", e.target.value)
                                            }
                                        />
                                        {errors.name && (
                                            <InvalidFeedback
                                                errorMsg={errors.name}
                                            />
                                        )}
                                    </div>
                                </div>

                                {/* code input */}
                                <div className="col-md-6">
                                    <div className="mb-3">
                                        <InputLabel label={"Code"} />
                                        <FormInput
                                            type="text"
                                            className="form-control"
                                            placeholder="Enter Product Code"
                                            value={data.code}
                                            onChange={(
                                                e: React.ChangeEvent<HTMLInputElement>
                                            ) =>
                                                setData("code", e.target.value)
                                            }
                                        />
                                        {errors.code && (
                                            <InvalidFeedback
                                                errorMsg={errors.code}
                                            />
                                        )}
                                    </div>
                                </div>

                                <div className="w-100"></div>

                                {/* category input */}
                                <div className="col-md-4">
                                    <div className="mb-3">
                                        <InputLabel label={"Category"} />
                                        <FormSelect
                                            defaultValue={data.category}
                                            onChange={(
                                                e: React.ChangeEvent<HTMLSelectElement>
                                            ) =>
                                                handleChangeCategory(
                                                    +e.target.value
                                                )
                                            }
                                        >
                                            {categories.map((category) => (
                                                <option
                                                    key={category.id}
                                                    value={category.id}
                                                >
                                                    {category.name}
                                                </option>
                                            ))}
                                        </FormSelect>
                                        {errors.category && (
                                            <InvalidFeedback
                                                errorMsg={errors.category}
                                            />
                                        )}
                                    </div>
                                </div>

                                {/* sub category input */}
                                <div className="col-md-4">
                                    <div className="mb-3">
                                        <InputLabel label={"Sub Category"} />
                                        <FormSelect
                                            defaultValue={data.sub_category}
                                            onChange={(
                                                e: React.ChangeEvent<HTMLSelectElement>
                                            ) =>
                                                setData(
                                                    "sub_category",
                                                    e.target.value
                                                )
                                            }
                                        >
                                            {subcategories.map(
                                                (subCategory) => (
                                                    <option
                                                        key={subCategory.id}
                                                        value={subCategory.id}
                                                    >
                                                        {subCategory.name}
                                                    </option>
                                                )
                                            )}
                                        </FormSelect>
                                        {errors.sub_category && (
                                            <InvalidFeedback
                                                errorMsg={errors.sub_category}
                                            />
                                        )}
                                    </div>
                                </div>

                                {/* barcode symbology input */}
                                <div className="col-md-4">
                                    <div className="mb-3">
                                        <InputLabel
                                            label={"Barcode Symbology"}
                                        />
                                        <FormSelect
                                            defaultValue={
                                                data.barcode_symbology
                                            }
                                            onChange={(
                                                e: React.ChangeEvent<HTMLSelectElement>
                                            ) =>
                                                setData(
                                                    "barcode_symbology",
                                                    e.target.value
                                                )
                                            }
                                        >
                                            <option value="C128">C128</option>
                                            <option value="C39">C39</option>
                                            <option value="EAN13">EAN13</option>
                                            <option value="UPCA">UPCA</option>
                                            <option value="C93">C93</option>
                                            <option value="EAN8">EAN8</option>
                                            <option value="QRCODE">
                                                QRCODE
                                            </option>
                                            <option value="PDF417">
                                                PDF417
                                            </option>
                                            <option value="DATAMATRIX">
                                                DATAMATRIX
                                            </option>
                                        </FormSelect>
                                        {errors.barcode_symbology && (
                                            <InvalidFeedback
                                                errorMsg={
                                                    errors.barcode_symbology
                                                }
                                            />
                                        )}
                                    </div>
                                </div>

                                {/* brand input */}
                                <div className="col-md-4">
                                    <div className="mb-3">
                                        <InputLabel label={"Brand"} />
                                        <FormSelect
                                            defaultValue={data.brand}
                                            onChange={(
                                                e: React.ChangeEvent<HTMLSelectElement>
                                            ) =>
                                                setData("brand", e.target.value)
                                            }
                                        >
                                            {brands.map((brand) => (
                                                <option
                                                    key={brand.id}
                                                    value={brand.id}
                                                >
                                                    {brand.name}
                                                </option>
                                            ))}
                                        </FormSelect>
                                        {errors.brand && (
                                            <InvalidFeedback
                                                errorMsg={errors.brand}
                                            />
                                        )}
                                    </div>
                                </div>

                                {/* Product Cost input */}
                                <div className="col-md-4">
                                    <div className="mb-3">
                                        <InputLabel label={"Product Cost"} />
                                        <FormInput
                                            type="text"
                                            className="form-control"
                                            placeholder="Enter Product Cost"
                                            value={data.cost}
                                            onChange={(
                                                e: React.ChangeEvent<HTMLInputElement>
                                            ) =>
                                                setData("cost", +e.target.value)
                                            }
                                        />
                                        {errors.cost && (
                                            <InvalidFeedback
                                                errorMsg={errors.cost}
                                            />
                                        )}
                                    </div>
                                </div>

                                {/* Product Price input */}
                                <div className="col-md-4">
                                    <div className="mb-3">
                                        <InputLabel label={"Product Price"} />
                                        <FormInput
                                            type="text"
                                            className="form-control"
                                            placeholder="Enter Product Price"
                                            value={data.price}
                                            onChange={(
                                                e: React.ChangeEvent<HTMLInputElement>
                                            ) =>
                                                setData(
                                                    "price",
                                                    +e.target.value
                                                )
                                            }
                                        />
                                        {errors.price && (
                                            <InvalidFeedback
                                                errorMsg={errors.price}
                                            />
                                        )}
                                    </div>
                                </div>

                                {/* unit input */}
                                <div className="col-md-4">
                                    <div className="mb-3">
                                        <InputLabel label={"Unit"} />
                                        <FormSelect
                                            defaultValue={data.unit}
                                            onChange={(
                                                e: React.ChangeEvent<HTMLSelectElement>
                                            ) =>
                                                handelChangeUnit(
                                                    +e.target.value
                                                )
                                            }
                                        >
                                            {units.map((unit) => (
                                                <option
                                                    key={unit.id}
                                                    value={unit.id}
                                                >
                                                    {unit.name} (
                                                    {unit.short_name})
                                                </option>
                                            ))}
                                        </FormSelect>
                                        {errors.unit && (
                                            <InvalidFeedback
                                                errorMsg={errors.unit}
                                            />
                                        )}
                                    </div>
                                </div>

                                {/* purchase unit input */}
                                <div className="col-md-4">
                                    <div className="mb-3">
                                        <InputLabel label={"Purchase Unit"} />
                                        <FormSelect
                                            defaultValue={data.purchase_unit}
                                            onChange={(
                                                e: React.ChangeEvent<HTMLSelectElement>
                                            ) =>
                                                setData(
                                                    "purchase_unit",
                                                    e.target.value
                                                )
                                            }
                                        >
                                            {availableUnit.map((unit) => (
                                                <option
                                                    key={unit.id}
                                                    value={unit.id}
                                                >
                                                    {unit.name} (
                                                    {unit.short_name})
                                                </option>
                                            ))}
                                        </FormSelect>
                                        {errors.purchase_unit && (
                                            <InvalidFeedback
                                                errorMsg={errors.purchase_unit}
                                            />
                                        )}
                                    </div>
                                </div>

                                {/* sale unit input */}
                                <div className="col-md-4">
                                    <div className="mb-3">
                                        <InputLabel label={"Sale Unit"} />
                                        <FormSelect
                                            defaultValue={data.sale_unit}
                                            onChange={(
                                                e: React.ChangeEvent<HTMLSelectElement>
                                            ) =>
                                                setData(
                                                    "sale_unit",
                                                    e.target.value
                                                )
                                            }
                                        >
                                            {availableUnit.map((unit) => (
                                                <option
                                                    key={unit.id}
                                                    value={unit.id}
                                                >
                                                    {unit.name} (
                                                    {unit.short_name})
                                                </option>
                                            ))}
                                        </FormSelect>
                                        {errors.sale_unit && (
                                            <InvalidFeedback
                                                errorMsg={errors.sale_unit}
                                            />
                                        )}
                                    </div>
                                </div>

                                {/* tex_method input */}
                                <div className="col-md-4">
                                    <div className="mb-3">
                                        <InputLabel label={"Tax Method"} />
                                        <FormSelect
                                            defaultValue={data.tax_method}
                                            onChange={(
                                                e: React.ChangeEvent<HTMLSelectElement>
                                            ) =>
                                                setData(
                                                    "tax_method",
                                                    +e.target.value
                                                )
                                            }
                                        >
                                            <option value="0">Inclusive</option>
                                            <option value="1">
                                                Exclusive{" "}
                                            </option>
                                        </FormSelect>
                                        {errors.tax_method && (
                                            <InvalidFeedback
                                                errorMsg={errors.tax_method}
                                            />
                                        )}
                                    </div>
                                </div>

                                {/* order_tex input */}
                                <div className="col-md-4">
                                    <div className="mb-3">
                                        <InputLabel label={"Net Tax"} />
                                        <div className="input-group">
                                            <FormInput
                                                type="number"
                                                step={"0.1"}
                                                className="form-control"
                                                placeholder="Enter Product Code"
                                                value={data.net_tax}
                                                onChange={(
                                                    e: React.ChangeEvent<HTMLInputElement>
                                                ) =>
                                                    setData(
                                                        "net_tax",
                                                        +e.target.value
                                                    )
                                                }
                                            />
                                            <div className="input-group-text">
                                                %
                                            </div>
                                        </div>
                                        {errors.net_tax && (
                                            <InvalidFeedback
                                                errorMsg={errors.net_tax}
                                            />
                                        )}
                                    </div>
                                </div>

                                {/* stock alert input */}
                                <div className="col-md-4">
                                    <div className="mb-3">
                                        <InputLabel label={"Stock Alert"} />
                                        <FormInput
                                            type="number"
                                            className="form-control"
                                            placeholder="Stock Alert Quantity"
                                            value={data.stock_alert}
                                            onChange={(
                                                e: React.ChangeEvent<HTMLInputElement>
                                            ) =>
                                                setData(
                                                    "stock_alert",
                                                    +e.target.value
                                                )
                                            }
                                        />
                                        {errors.stock_alert && (
                                            <InvalidFeedback
                                                errorMsg={errors.stock_alert}
                                            />
                                        )}
                                    </div>
                                </div>

                                <div className="w-100"></div>

                                {/* status input */}
                                <div className="col-md-4">
                                    <div className="mb-3">
                                        <InputLabel label={"Is Active"} />
                                        <FormSelect
                                            defaultValue={data.is_active}
                                            onChange={(
                                                e: React.ChangeEvent<HTMLSelectElement>
                                            ) =>
                                                setData(
                                                    "is_active",
                                                    +e.target.value
                                                )
                                            }
                                        >
                                            <option value="1">Active</option>
                                            <option value="0">Inactive</option>
                                        </FormSelect>
                                        {errors.is_active && (
                                            <InvalidFeedback
                                                errorMsg={errors.is_active}
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="w-100"></div>

                            {/* description input */}
                            <div className="col-12">
                                <div className="mb-3">
                                    <InputLabel label={"Description"} />
                                    <textarea
                                        className="form-control"
                                        placeholder="Enter Product Description"
                                        value={data.description}
                                        onChange={(e) =>
                                            setData(
                                                "description",
                                                e.target.value
                                            )
                                        }
                                    ></textarea>
                                    {errors.description && (
                                        <InvalidFeedback
                                            errorMsg={errors.description}
                                        />
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* form inputs col-3  */}
                        <div className="col-md-3">
                            {/* image input */}
                            <div className="mb-3">
                                <ImageUploadPreview
                                    data={data}
                                    setData={setData}
                                    errors={errors}
                                    defaultImage={product.image}
                                />
                            </div>

                            {/* batch and expiration input */}
                            <div className="mb-3">
                                <div className="form-check">
                                    <FormInput
                                        type="checkbox"
                                        className="form-check-input"
                                        checked={data.is_batch}
                                        onChange={(
                                            e: React.ChangeEvent<HTMLInputElement>
                                        ) =>
                                            handleIsBatchCheck(e.target.checked)
                                        }
                                    />
                                    <InputLabel
                                        className="text-primary"
                                        label={
                                            "Product Has Batch And Expiration"
                                        }
                                    />
                                </div>
                                {errors.is_batch && (
                                    <InvalidFeedback
                                        errorMsg={errors.is_batch}
                                    />
                                )}
                            </div>

                            {/* expiration alert input */}
                            {data.is_batch == true && (
                                <div className="mb-3">
                                    <InputLabel
                                        label={"Expiration Alert (in day)"}
                                    />
                                    <FormInput
                                        type="number"
                                        className="form-control"
                                        value={data.expiration_alert}
                                        onChange={(
                                            e: React.ChangeEvent<HTMLSelectElement>
                                        ) =>
                                            setData(
                                                "expiration_alert",
                                                e.target.value
                                            )
                                        }
                                        placeholder="Enter expiration alert"
                                    />
                                    {errors.expiration_alert && (
                                        <InvalidFeedback
                                            errorMsg={errors.expiration_alert}
                                        />
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </CardBody>

                <CardFooter>
                    <div className="d-flex justify-content-start">
                        <Button
                            type="submit"
                            className="btn btn-primary w-md"
                            onClick={handleSubmit}
                            disabled={processing}
                        >
                            {processing ? "Updating..." : "Update"}
                        </Button>
                    </div>
                </CardFooter>
            </Card>
        </AuthLayout>
    );
}

export default Edit;
