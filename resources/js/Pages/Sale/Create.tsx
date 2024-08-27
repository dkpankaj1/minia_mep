import React, { useEffect, useState, useCallback } from "react";
import AuthLayout from "@/Layouts/AuthLayout";
import { Head, useForm, usePage } from "@inertiajs/react";
import { Card, CardBody, CardHeader, CardFooter } from "@/components/Card";
import {
    CustomTable,
    THead,
    THeader,
    TBody,
    TRow,
    TData,
} from "@/components/Table";
import Badge from "@/components/Badge";
import Button from "@/components/Button";
import FormInput from "@/components/FormInput";
import FormSelect from "@/components/FormSelect";
import InputLabel from "@/components/InputLabel";
import InvalidFeedback from "@/components/InvalidFeedback";
import ModalEditCartItem from "@/Pages/Sale/ModalEditCartItem";
import QuantityInput from "@/Pages/Sale/QuantityInput";
import { PageProp } from "@/types/global";
import { error } from "console";
import { TSystemPagePropType } from "@/types/type";
import SearchableSelect from "@/components/SearchableSelect";

// Define the enum
enum OrderStatusEnum {
    GENERATED = "generated",
    PENDING = "pending",
    RECEIVED = "received",
}
// Derive the type from the enum
type TOrderStatus = `${OrderStatusEnum}`;

interface IUnitType {
    id: number;
    name: string;
    short_name: string;
    base_unit: number | null;
    operator: string;
    operator_value: number;
    is_active: number;
}

interface IStockType {
    id: number;
    name: string;
    code: string;
    available: number;
    sale_unit: IUnitType;
    units: Array<IUnitType>;
    price: number;
    tax_method: number;
    net_tax: number;
    is_batch: number;
    batch_id: number | null;
    batch_number: string | null;
    expiration: string | null;
}

interface TWarehouseProductsType {
    id: number;
    name: string;
    stocks: Array<IStockType>;
}
// Interfaces for Customers and Props
interface TCustomerType {
    id: number;
    name: string;
    email: string;
    phone: string;
    groupName: string;
    calculateRate: number;
}
interface IPropsType {
    customers: Array<TCustomerType>;
    warehouseProducts: Array<TWarehouseProductsType>;
    defaultCustomer: TCustomerType;
}

interface ISaleItemType {
    stock_id: number;
    product_code: string;
    name: string;
    original_price: number;
    net_unit_price: number;
    sale_unit: IUnitType;
    available_units: Array<IUnitType>;
    available: number;
    quantity: number;
    subtotal: number;
    discount_method: number;
    discount: number;
    tax_method: number;
    tax_rate: number;
    is_batch: number;
    batch_id: number | null;
    batch_number: string | null;
    expiration: string | null;
}

export interface ISelectedSaleItemType {
    index: number;
    sale_unit: IUnitType;
    available_units: Array<IUnitType>;
    available: number;
    quantity: number;
    discount_method: number;
    discount: number;
    tax_method: number;
    tax_rate: number;
}

type TFormDataField = {
    date: string | "";
    customer: number | "";
    warehouse: number | "";
    order_status: TOrderStatus | string | "";
    sale_items: Array<ISaleItemType> | [];
    shipping_cost: string | number | "";
    other_cost: string | number | "";
    order_tax: string | number | "";
    discount_method: string | number | "";
    discount: string | number | "";
    note: string | "";
};

type TFormField = keyof TFormDataField;

// Page Prop Interface
interface IPagePropType extends PageProp {
    system: TSystemPagePropType;
}

function Create({ customers, warehouseProducts, defaultCustomer }: IPropsType) {
    const { system } = usePage<IPagePropType>().props;
    const [searchQuery, setSearchQuery] = useState("");
    const [showModel, setShowModel] = useState(false);
    const [searchResult, setSearchResult] = useState<Array<IStockType>>([]);
    const [wareHouseStock, setWareHouseStock] = useState<Array<IStockType>>([]);

    // Get the current date and format it to YYYY-MM-DD
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split("T")[0];
    const toggleModal = useCallback(() => setShowModel((prev) => !prev), []);

    const { data, setData, post, processing, errors, clearErrors } =
        useForm<TFormDataField>({
            date: formattedDate,
            customer: defaultCustomer.id,
            warehouse: "",
            order_status: "",
            sale_items: [],
            shipping_cost: 0,
            other_cost: 0,
            order_tax: 0,
            discount_method: 0,
            discount: 0,
            note: "",
        });

    const [selectedCartItem, setSelectedCartItem] = useState({
        index: -1,
        sale_unit: {} as IUnitType,
        available_units: [] as Array<IUnitType>,
        available: -1,
        quantity: -1,
        discount_method: -1,
        discount: -1,
        tax_method: -1,
        tax_rate: -1,
    } as ISelectedSaleItemType);

    const [computedValues, setComputedValues] = useState({
        subtotal: 0,
        orderTax: 0,
        totalDiscount: 0,
        extraCharges: 0,
        grandTotal: 0,
    });

    const changeInputField = (field: TFormField, value: string | number) => {
        clearErrors(field);
        setData(field, value);
    };

    const handleSubmit = () => {
        post(route("sale.store"));
    };

    const changeWarehouse = (value: number) => {
        clearErrors("warehouse");
        setData({
            ...data,
            warehouse: value,
            sale_items: [],
        });
        const foundProductWarehouse = warehouseProducts.find(
            (productWarehouse) => productWarehouse.id == value
        );
        foundProductWarehouse
            ? setWareHouseStock(foundProductWarehouse.stocks)
            : setWareHouseStock([]);
    };

    const handleChangeCustomer = (customerOption: any) => {
        clearErrors("customer");

        const selectedCustomer: TCustomerType | undefined =
            customerOption !== null
                ? customers.find(
                      (customer) => customer.id == customerOption.value
                  )
                : undefined;

        const calculateRate: number = selectedCustomer?.calculateRate || 0;

        const updatedCartItems: Array<ISaleItemType> = data.sale_items.map(
            (item: ISaleItemType) => ({
                ...item,
                net_unit_price:
                    item.original_price +
                        item.original_price * (calculateRate / 100) ||
                    item.original_price,
                subtotal: calculateItemSubTotal({
                    ...item,
                    net_unit_price:
                        item.original_price +
                            item.original_price * (calculateRate / 100) ||
                        item.original_price,
                }),
            })
        );

        setData({
            ...data,
            sale_items: updatedCartItems,
            customer: selectedCustomer?.id || "",
        });
    };

    const handleAddToCart = (stock: IStockType): void => {
        console.log(stock);
        const selectedCustomer = customers.find(
            (customer) => customer.id == data.customer
        );
        const calculateRate = selectedCustomer?.calculateRate || 0;

        const newItem: ISaleItemType = {
            stock_id: stock.id,
            product_code: stock.code,
            name: stock.name,
            original_price: stock.price,
            net_unit_price:
                stock.price + stock.price * (calculateRate / 100) ||
                stock.price,
            sale_unit: stock.sale_unit,
            available_units: stock.units,
            available: stock.available * stock.sale_unit.operator_value,
            quantity: 1 * stock.sale_unit.operator_value,
            subtotal: 0,
            discount_method: 0,
            discount: 0,
            tax_method: stock.tax_method,
            tax_rate: stock.net_tax,
            is_batch: stock.is_batch,
            batch_id: stock.batch_id,
            batch_number: stock.batch_number,
            expiration: stock.expiration,
        };

        newItem.subtotal = calculateItemSubTotal(newItem);

        if (
            !data.sale_items.some((cartItem) => cartItem.stock_id === stock.id)
        ) {
            setData("sale_items", [...data.sale_items, newItem]);
        }
        setSearchQuery("");
    };
    const handleRemoveFromCart = (index: number) => {
        const updatedCartItems = [...data.sale_items];
        updatedCartItems.splice(index, 1);
        setData("sale_items", updatedCartItems);
    };
    const handleChangeQuantity = (index: number, value: number) => {
        const updatedCartItems = [...data.sale_items];
        updatedCartItems[index].quantity = value;
        updatedCartItems[index].subtotal = calculateItemSubTotal(
            updatedCartItems[index]
        );
        setData("sale_items", updatedCartItems);
    };

    const handleEditCartItem = (index: number) => {
        const cart = data.sale_items[index];
        setSelectedCartItem({
            index: index,
            sale_unit: cart.sale_unit,
            available_units: cart.available_units,
            available: cart.available,
            quantity: cart.quantity,
            discount_method: cart.discount_method,
            discount: cart.discount,
            tax_method: cart.tax_method,
            tax_rate: cart.tax_rate,
        });
        toggleModal();
    };

    const handleUpdate = () => {
        const { index } = selectedCartItem || {};

        if (index !== undefined && index !== null) {
            const currentItem = data.sale_items[index];

            const updatedCartItem: ISaleItemType = {
                ...currentItem,
                ...selectedCartItem,
            };

            updatedCartItem.subtotal = calculateItemSubTotal(updatedCartItem);

            const updatedCartItems = [...data.sale_items];
            updatedCartItems[index] = updatedCartItem;

            setData("sale_items", updatedCartItems);

            toggleModal();
        } else {
            console.error("Selected cart item or index is invalid.");
        }
    };

    const getProductAvailableWithUnit = (
        available: number,
        unit: IUnitType
    ) => {
        return `${available} ${unit.name}`;
    };

    const calculateItemSubTotal = (item: ISaleItemType) => {
        const {
            quantity = 0,
            net_unit_price = 0,
            discount = 0,
            tax_rate = 0,
            sale_unit,
            discount_method,
            tax_method,
        } = item;

        const { operator = "*", operator_value = 1 } = sale_unit;

        const calculateDiscountedCost = (
            costWithTax: number,
            discount: number,
            method: number
        ) =>
            method === 0
                ? costWithTax - discount
                : costWithTax * (1 - discount / 100);

        const calculateTaxedCost = (
            cost: number,
            taxRate: number,
            method: number
        ) => (method === 0 ? cost : cost * (1 + taxRate / 100));

        const netCostAfterTax = calculateTaxedCost(
            net_unit_price,
            tax_rate,
            tax_method
        );

        const netCostAfterDiscount = calculateDiscountedCost(
            netCostAfterTax,
            discount,
            discount_method
        );

        return operator === "/"
            ? (quantity * netCostAfterDiscount) / operator_value
            : quantity * netCostAfterDiscount;
    };

    const calculateSubtotal = () => {
        return data.sale_items.reduce((total, item) => {
            return total + calculateItemSubTotal(item);
        }, 0);
    };
    const calculateTotalDiscount = (taxSubtotal: number): number => {
        const discount =
            typeof data.discount == "number"
                ? data.discount
                : parseInt(data.discount || "0");
        if (data.discount_method == 0) {
            return discount;
        } else {
            return taxSubtotal * (discount / 100);
        }
    };

    const calculateOrderTax = (subtotal: number): number => {
        const orderTax =
            typeof data.order_tax == "number"
                ? data.order_tax
                : parseInt(data.order_tax || "0");

        return subtotal * (orderTax / 100);
    };

    const calculateGrandTotal = (
        subtotal: number,
        orderTax: number,
        totalDiscount: number
    ): number => {
        const discountedGrandTotal = subtotal - totalDiscount;

        const shippingCost =
            typeof data.shipping_cost == "number"
                ? data.shipping_cost
                : parseInt(data.shipping_cost || "0");

        const otherCost =
            typeof data.other_cost == "number"
                ? data.other_cost
                : parseInt(data.other_cost || "0");

        return discountedGrandTotal + orderTax + shippingCost + otherCost;
    };

    const calculateTotals = () => {
        const shippingCost =
            typeof data.shipping_cost == "number"
                ? data.shipping_cost
                : parseInt(data.shipping_cost || "0");

        const otherCost =
            typeof data.other_cost == "number"
                ? data.other_cost
                : parseInt(data.other_cost || "0");

        const subtotal = calculateSubtotal();
        const orderTax = calculateOrderTax(subtotal);
        const totalDiscount = calculateTotalDiscount(subtotal);
        const grandTotal = calculateGrandTotal(
            subtotal,
            orderTax,
            totalDiscount
        );
        const extraCharges = shippingCost + otherCost;
        setComputedValues({
            subtotal,
            orderTax,
            totalDiscount,
            extraCharges,
            grandTotal,
        });
    };

    useEffect(() => {
        if (searchQuery === "") {
            setSearchResult([]);
        } else {
            const timeOutId = setTimeout(() => {
                const filterSearchResult =
                    searchQuery === "*"
                        ? wareHouseStock
                        : wareHouseStock.filter(
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
    }, [searchQuery, wareHouseStock]);

    useEffect(() => {
        calculateTotals();
    }, [data]);

    return (
        <AuthLayout>
            <Head title="Sale | Create - " />
            <Card>
                <CardHeader>
                    <h4 className="card-title">Create Sale</h4>
                    <p className="card-title-desc">
                        Fill out the form below to create a new Sale.
                    </p>
                </CardHeader>
                <CardBody>
                    <div className="row">
                        {/* date input */}
                        <div className="col-md-4">
                            <div className="mb-4">
                                <InputLabel label={"Date"} />
                                <FormInput
                                    type="date"
                                    className="form-control"
                                    value={data.date}
                                    onChange={(
                                        e: React.ChangeEvent<HTMLInputElement>
                                    ) =>
                                        changeInputField("date", e.target.value)
                                    }
                                />
                                {errors.date && (
                                    <InvalidFeedback errorMsg={errors.date} />
                                )}
                            </div>
                        </div>

                        {/* warehouse input */}
                        <div className="col-md-4">
                            <div className="mb-4">
                                <InputLabel label={"Warehouse"} />
                                <FormSelect
                                    className={`form-select ${
                                        errors.warehouse && "is-invalid"
                                    }`}
                                    value={data.warehouse}
                                    onChange={(
                                        e: React.ChangeEvent<HTMLInputElement>
                                    ) => changeWarehouse(+e.target.value)}
                                >
                                    {warehouseProducts.map(
                                        (warehouseProduct) => (
                                            <option
                                                key={warehouseProduct.id}
                                                value={warehouseProduct.id}
                                            >
                                                {warehouseProduct.name}
                                            </option>
                                        )
                                    )}
                                </FormSelect>
                                {errors.warehouse && (
                                    <InvalidFeedback
                                        errorMsg={errors.warehouse}
                                    />
                                )}
                            </div>
                        </div>

                        {/* order status input */}
                        <div className="col-md-4">
                            <div className="mb-4">
                                <InputLabel label={"Order Status"} />
                                <FormSelect
                                    defaultValue={data.order_status}
                                    onChange={(
                                        e: React.ChangeEvent<HTMLInputElement>
                                    ) =>
                                        changeInputField(
                                            "order_status",
                                            e.target.value
                                        )
                                    }
                                    className={
                                        errors.order_status && "is-invalid"
                                    }
                                >
                                    <option value={OrderStatusEnum.GENERATED}>
                                        {"Generated"}
                                    </option>
                                    <option value={OrderStatusEnum.PENDING}>
                                        {"Pending"}
                                    </option>
                                    <option value={OrderStatusEnum.RECEIVED}>
                                        {"Received"}
                                    </option>
                                </FormSelect>

                                {errors.order_status && (
                                    <InvalidFeedback
                                        errorMsg={errors.order_status}
                                    />
                                )}
                            </div>
                        </div>

                        {/* customer input */}
                        <div className="col-md-6">
                            <div className="mb-4">
                                <InputLabel label={"Customer"} />
                                <SearchableSelect
                                    options={
                                        customers.map((customer) => ({
                                            value: customer.id,
                                            label: `${customer.name}  - ${customer.email}`,
                                        })) as any
                                    }
                                    onSelect={handleChangeCustomer}
                                    className={errors.customer && "is-invalid"}
                                />

                                {/* <CustomSelect
                                    options={customers.map((customer) => ({
                                        value: customer.id,
                                        label: `${customer.name}  - ${customer.email}`,
                                    }))}
                                    value={data.customer}
                                    onChange={handleChangeCustomer}
                                    placeholder="Please Select Customer"
                                    className={errors.customer && "is-invalid"}
                                /> */}
                                {errors.customer && (
                                    <InvalidFeedback
                                        errorMsg={errors.customer}
                                    />
                                )}
                            </div>
                        </div>
                    </div>

                    {/* search Product input */}
                    <div className="col-12">
                        <div className="mb-4">
                            <InputLabel label={"Product"} />
                            <div className="input-group">
                                <div className="input-group-text px-4 search-input-prefix">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        fill="currentColor"
                                        className="bi bi-upc-scan"
                                        viewBox="0 0 16 16"
                                    >
                                        <path d="M1.5 1a.5.5 0 0 0-.5.5v3a.5.5 0 0 1-1 0v-3A1.5 1.5 0 0 1 1.5 0h3a.5.5 0 0 1 0 1zM11 .5a.5.5 0 0 1 .5-.5h3A1.5 1.5 0 0 1 16 1.5v3a.5.5 0 0 1-1 0v-3a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 1-.5-.5M.5 11a.5.5 0 0 1 .5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 1 0 1h-3A1.5 1.5 0 0 1 0 14.5v-3a.5.5 0 0 1 .5-.5m15 0a.5.5 0 0 1 .5.5v3a1.5 1.5 0 0 1-1.5 1.5h-3a.5.5 0 0 1 0-1h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 1 .5-.5M3 4.5a.5.5 0 0 1 1 0v7a.5.5 0 0 1-1 0zm2 0a.5.5 0 0 1 1 0v7a.5.5 0 0 1-1 0zm2 0a.5.5 0 0 1 1 0v7a.5.5 0 0 1-1 0zm2 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm3 0a.5.5 0 0 1 1 0v7a.5.5 0 0 1-1 0z" />
                                    </svg>
                                </div>
                                <FormInput
                                    className="form-control py-3 search-input"
                                    placeholder={"Scan/Search Product"}
                                    value={searchQuery}
                                    onChange={(
                                        e: React.ChangeEvent<HTMLInputElement>
                                    ) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            {searchResult.length > 0 && (
                                <ul className="searchResultContainer">
                                    {searchResult.map((result, index) => (
                                        <li
                                            key={index}
                                            className="searchResultItem"
                                            onClick={() =>
                                                handleAddToCart(result)
                                            }
                                        >
                                            {" "}
                                            {result.code} | {result.name}{" "}
                                            {result.is_batch == 1 &&
                                                ` -${result.batch_number}/${result.expiration}`}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                    <div className="table-responsive">
                        <CustomTable className="no-wrap">
                            <THead className="table-secondary">
                                <TRow>
                                    <THeader>No.</THeader>
                                    <THeader>Product</THeader>
                                    <THeader>
                                        Net Unit Cost ({system.currency.symbol})
                                    </THeader>
                                    <THeader>Available</THeader>
                                    <THeader>Qty</THeader>
                                    <THeader>Batch</THeader>
                                    <THeader>Tax (%)</THeader>
                                    <THeader>
                                        Unit Discount ({system.currency.symbol})
                                    </THeader>
                                    <THeader>Subtotal</THeader>
                                    <THeader>Action</THeader>
                                </TRow>
                            </THead>
                            <TBody>
                                {data.sale_items.length <= 0 ? (
                                    <TRow>
                                        <TData colSpan="10">
                                            No data available.
                                        </TData>
                                    </TRow>
                                ) : (
                                    data.sale_items.map((item, index) => (
                                        <TRow key={index}>
                                            <TData>{index + 1}</TData>
                                            <TData>
                                                <span>{item.product_code}</span>{" "}
                                                &nbsp;|&nbsp;
                                                <span>
                                                    <b>{item.name}</b>
                                                </span>
                                            </TData>
                                            <TData>
                                                {system.currency.symbol}
                                                {item.net_unit_price.toFixed(2)}
                                                {errors[
                                                    `sale_item.${index}.net_unit_cost` as keyof typeof error
                                                ] && (
                                                    <InvalidFeedback
                                                        errorMsg={
                                                            errors[
                                                                `sale_item.${index}.net_unit_cost` as keyof typeof errors
                                                            ]
                                                        }
                                                    />
                                                )}
                                            </TData>
                                            <TData>
                                                <Badge className="rounded-pill font-size-14 fw-medium bg-info-subtle text-info">
                                                    {getProductAvailableWithUnit(
                                                        item.available,
                                                        item.sale_unit
                                                    )}
                                                </Badge>
                                            </TData>
                                            <TData>
                                                <QuantityInput
                                                    index={index}
                                                    value={item.quantity}
                                                    setValue={
                                                        handleChangeQuantity
                                                    }
                                                    maxValue={item.available}
                                                />
                                                {errors[
                                                    `sale_item.${index}.quantity` as keyof typeof error
                                                ] && (
                                                    <InvalidFeedback
                                                        errorMsg={
                                                            errors[
                                                                `sale_item.${index}.quantity` as keyof typeof errors
                                                            ]
                                                        }
                                                    />
                                                )}
                                            </TData>

                                            <TData>
                                                {item.is_batch == 1 && (
                                                    <>
                                                        <Badge
                                                            className={`font-size-14 fw-medium ${
                                                                item.is_batch
                                                                    ? "bg-info-subtle text-info"
                                                                    : "bg-danger-subtle text-danger"
                                                            } `}
                                                        >
                                                            {item.batch_number}
                                                        </Badge>
                                                        {errors[
                                                            `sale_items.${index}.batch_id` as keyof typeof error
                                                        ] && (
                                                            <InvalidFeedback
                                                                errorMsg={
                                                                    errors[
                                                                        `sale_items.${index}.batch_id` as keyof typeof errors
                                                                    ]
                                                                }
                                                            />
                                                        )}
                                                    </>
                                                )}
                                            </TData>

                                            <TData>{item.tax_rate} %</TData>
                                            <TData>
                                                {system.currency.symbol}{" "}
                                                {item.discount_method == 0
                                                    ? item.discount
                                                    : item.net_unit_price *
                                                      (item.discount / 100)}
                                            </TData>
                                            <TData>
                                                {system.currency.symbol}{" "}
                                                {item.subtotal.toFixed(2)}
                                            </TData>
                                            <TData>
                                                <div className="d-flex gap-2">
                                                    <Button
                                                        className="btn btn-sm btn-soft-primary"
                                                        onClick={() =>
                                                            handleEditCartItem(
                                                                index
                                                            )
                                                        }
                                                    >
                                                        <i className="bx bxs-edit font-size-12 align-middle"></i>
                                                    </Button>
                                                    <Button
                                                        className="btn btn-sm btn-soft-danger"
                                                        onClick={() =>
                                                            handleRemoveFromCart(
                                                                index
                                                            )
                                                        }
                                                    >
                                                        <i className="bx bxs-trash font-size-12 align-middle"></i>
                                                    </Button>
                                                </div>
                                            </TData>
                                        </TRow>
                                    ))
                                )}
                                <TRow>
                                    <TData colSpan="11">
                                        <div
                                            className={
                                                errors.sale_items ? "my-1" : ""
                                            }
                                        >
                                            {errors.sale_items && (
                                                <InvalidFeedback
                                                    errorMsg={errors.sale_items}
                                                />
                                            )}
                                        </div>
                                    </TData>
                                </TRow>

                                <TRow>
                                    <TData colSpan="7">{""}</TData>
                                    <TData colSpan="4">
                                        <CustomTable className="table table-striped table-sm">
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
                                                        {" "}
                                                        {computedValues.subtotal.toFixed(
                                                            2
                                                        )}
                                                    </TData>
                                                </TRow>

                                                <TRow>
                                                    <TData>
                                                        <b>
                                                            Discount (
                                                            {
                                                                system.currency
                                                                    .symbol
                                                            }
                                                            )
                                                        </b>
                                                    </TData>
                                                    <TData>
                                                        {computedValues.totalDiscount.toFixed(
                                                            2
                                                        )}
                                                    </TData>
                                                </TRow>

                                                <TRow>
                                                    <TData>
                                                        <b>
                                                            Tax (
                                                            {
                                                                system.currency
                                                                    .symbol
                                                            }
                                                            )
                                                        </b>
                                                    </TData>
                                                    <TData>
                                                        {" "}
                                                        {computedValues.orderTax.toFixed(
                                                            2
                                                        )}
                                                    </TData>
                                                </TRow>

                                                <TRow>
                                                    <TData>
                                                        <b>
                                                            Shipping cost +
                                                            Other Cost (
                                                            {
                                                                system.currency
                                                                    .symbol
                                                            }
                                                            )
                                                        </b>
                                                    </TData>
                                                    <TData>
                                                        {" "}
                                                        {computedValues.extraCharges.toFixed(
                                                            2
                                                        )}
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
                                                        {computedValues.grandTotal.toFixed(
                                                            2
                                                        )}
                                                    </TData>
                                                </TRow>
                                            </TBody>
                                        </CustomTable>
                                    </TData>
                                </TRow>
                            </TBody>
                        </CustomTable>
                    </div>

                    <div className="row">
                        <div className="col-md-4">
                            <div className="mb-3">
                                <InputLabel
                                    label={`Shipping Cost (${system.currency.symbol})`}
                                />
                                <FormInput
                                    type="number"
                                    className="form-control"
                                    value={data.shipping_cost}
                                    onChange={(
                                        e: React.ChangeEvent<HTMLInputElement>
                                    ) =>
                                        setData("shipping_cost", e.target.value)
                                    }
                                />
                                {errors.shipping_cost && (
                                    <InvalidFeedback
                                        errorMsg={errors.shipping_cost}
                                    />
                                )}
                            </div>
                        </div>

                        <div className="col-md-4">
                            <div className="mb-3">
                                <InputLabel
                                    label={`Other Cost (${system.currency.symbol})`}
                                />
                                <FormInput
                                    type="number"
                                    className="form-control"
                                    value={data.other_cost}
                                    onChange={(
                                        e: React.ChangeEvent<HTMLInputElement>
                                    ) => setData("other_cost", e.target.value)}
                                />
                                {errors.other_cost && (
                                    <InvalidFeedback
                                        errorMsg={errors.other_cost}
                                    />
                                )}
                            </div>
                        </div>

                        <div className="col-md-4">
                            <div className="mb-3">
                                <InputLabel label={"Order Tax (%)"} />
                                <FormInput
                                    min={0}
                                    max={100}
                                    step={0.1}
                                    type="number"
                                    className="form-control"
                                    value={data.order_tax}
                                    onChange={(
                                        e: React.ChangeEvent<HTMLInputElement>
                                    ) => setData("order_tax", e.target.value)}
                                />
                                {errors.order_tax && (
                                    <InvalidFeedback
                                        errorMsg={errors.order_tax}
                                    />
                                )}
                            </div>
                        </div>

                        <div className="col-md-4">
                            <div className="mb-3">
                                <InputLabel label={"Discount Type"} />
                                <FormSelect
                                    className="form-select"
                                    value={data.discount_method}
                                    onChange={(
                                        e: React.ChangeEvent<HTMLInputElement>
                                    ) =>
                                        setData(
                                            "discount_method",
                                            e.target.value
                                        )
                                    }
                                >
                                    <option value="0">
                                        Fixed ({system.currency.symbol})
                                    </option>
                                    <option value="1">Percent (%)</option>
                                </FormSelect>
                                {errors.discount_method && (
                                    <InvalidFeedback
                                        errorMsg={errors.discount_method}
                                    />
                                )}
                            </div>
                        </div>

                        <div className="col-md-4">
                            <div className="mb-3">
                                <InputLabel label={"Discount"} />
                                <FormInput
                                    type="number"
                                    className="form-control"
                                    value={data.discount}
                                    onChange={(
                                        e: React.ChangeEvent<HTMLInputElement>
                                    ) => setData("discount", e.target.value)}
                                />
                                {errors.discount && (
                                    <InvalidFeedback
                                        errorMsg={errors.discount}
                                    />
                                )}
                            </div>
                        </div>

                        <div className="col-md-12">
                            <div className="mb-3">
                                <InputLabel label={"Note"} />
                                <textarea
                                    className="form-control"
                                    value={data.note}
                                    onChange={(
                                        e: React.ChangeEvent<HTMLTextAreaElement>
                                    ) => setData("note", e.target.value)}
                                />
                                {errors.note && (
                                    <InvalidFeedback errorMsg={errors.note} />
                                )}
                            </div>
                        </div>
                    </div>
                </CardBody>
                <CardFooter>
                    <Button
                        className="btn btn-primary w-md"
                        onClick={handleSubmit}
                        disabled={processing}
                    >
                        Save
                    </Button>
                </CardFooter>
            </Card>

            <ModalEditCartItem
                showModel={showModel}
                toggleModal={toggleModal}
                selectedCartItem={selectedCartItem}
                setSelectedCartItem={setSelectedCartItem}
                handleUpdate={handleUpdate}
                system={system}
            />
        </AuthLayout>
    );
}

export default Create;
